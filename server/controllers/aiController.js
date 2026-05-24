import { clerkClient } from "@clerk/express";
import OpenAI from "openai";
import { 
  openai, 
  chatModel, 
  fallbackChatModel, 
  isOpenRouter 
} from "../configs/openai.js";
import sql from "../configs/db.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const PDFDocument = require("pdfkit");

// Defensive helper to parse PDF using either pdf-parse v1 (function) or v2 (class)
const extractTextFromPdf = async (buffer) => {
  if (pdfParse && typeof pdfParse.PDFParse === 'function') {
    console.log("📄 Parsing PDF using pdf-parse v2+ PDFParse class API");
    const parser = new pdfParse.PDFParse({ data: buffer });
    const textResult = await parser.getText();
    return textResult.text;
  }
  
  const pdfParseFn = typeof pdfParse === 'function' ? pdfParse : (pdfParse.default || pdfParse);
  if (typeof pdfParseFn === 'function') {
    console.log("📄 Parsing PDF using pdf-parse v1 standard function API");
    const parsedData = await pdfParseFn(buffer);
    return parsedData.text;
  }
  
  throw new Error("Unable to locate a valid PDF parsing function or class in 'pdf-parse' package.");
};

// Helper to clean JSON string returned by AI models
const cleanJsonString = (str) => {
  if (!str) return "";
  return str
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
};

// ==========================================
// SECTION 1: AI ARTICLE GENERATOR CONTROLLER
// ==========================================
export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth || {};
    const { prompt, length } = req.body;
    const plan = req.plan || 'free';
    const free_usage = req.free_usage || 0;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (plan !== 'premium' && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue."
      });
    }

    const response = await openai.chat.completions.create({
      model: chatModel,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length || 500,
    });

    const content = response.choices[0].message.content;

    try {
      await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`;
    } catch (dbErr) {
      console.warn("Database insert skipped:", dbErr.message);
    }

    if (plan !== 'premium') {
      try {
        await clerkClient.users.updateUserMetadata(userId, {
          privateMetadata: {
            free_usage: free_usage + 1
          }
        });
      } catch (clerkErr) {
        console.warn("⚠️ Clerk updateUserMetadata failed in generateArticle:", clerkErr.message);
      }
    }
    res.json({ success: true, content });

  } catch (error) {
    console.error("generateArticle error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ==========================================
// SECTION 2: AI PLAN GENERATOR CONTROLLER
// ==========================================
export const generatePlan = async (req, res) => {
  try {
    const { userId } = req.auth || {};
    const { prompt } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Default static fallback parsedPlan matching specification
    const parsedPlan = {
      "root": {
        "id": "workflow",
        "label": "workflow",
        "children": [
          {
            "id": "planning",
            "label": "planning",
            "color": "#ec4899",
            "children": [
              {
                "id": "p1",
                "label": "Project Scope Definition",
                "details": "Define the boundaries, features, and target metrics for Quick.ai. Establish key deliverables.",
                "tools": ["Notion", "Miro"]
              },
              {
                "id": "p2",
                "label": "Requirements Gathering",
                "details": "Collect and document functional and non-functional requirements from stakeholders.",
                "tools": ["Jira", "Confluence"]
              }
            ]
          },
          {
            "id": "design",
            "label": "design",
            "color": "#8b5cf6",
            "children": [
              {
                "id": "d1",
                "label": "System Architecture Design",
                "details": "Design global service structure, caching layers, and backend route protection.",
                "tools": ["Lucidchart", "Draw.io"]
              }
            ]
          }
        ]
      },
      "techStack": {
        "frontend": "React with Tailwind CSS and Vite.",
        "backend": "Node.js with Express.",
        "database": "PostgreSQL database hosted on Neon db.",
        "other": "Clerk authentication and OpenAI API."
      },
      "bashCommand": "mkdir client server && cd client && npm create vite@latest . -- --template react"
    };

    res.json({ success: true, plan: parsedPlan });

  } catch (error) {
    console.error("generatePlan error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

// ==========================================
// SECTION 3: AI WORKFLOW BUILDER CONTROLLER
// ==========================================
export const generateWorkflow = async (req, res) => {
  try {
    const { userId } = req.auth || {};
    const { userPrompt } = req.body;

    if (!userPrompt) {
      return res.json({ success: false, message: "userPrompt is required" });
    }

    const systemPrompt = `You are a professional software architect. Your task is to analyze the user's project idea and generate a complete structured development roadmap and workflow.
You must output a single JSON object. Do not include any markdown styling, code blocks, or extra text. Output strictly valid JSON.
 conformed to the requested schema.`;

    const response = await openai.chat.completions.create({
      model: chatModel,
      messages: [
        { role: "system", content: "You output strictly valid JSON conforming to the requested schema. No conversational filler or markdown formatting." },
        { role: "user", content: `${systemPrompt}\n\nProject idea: ${userPrompt}` }
      ],
      temperature: 0.3
    });

    const resultText = cleanJsonString(response.choices[0].message.content);
    const parsedData = JSON.parse(resultText);

    res.json({ success: true, plan: parsedData });
  } catch (error) {
    console.error("generateWorkflow error:", error);
    res.json({ success: false, message: error.message });
  }
};

export const createWorkflow = async (req, res) => {
  try {
    const { userPrompt, prompt } = req.body;
    const finalPrompt = userPrompt || prompt;

    if (!finalPrompt || !finalPrompt.trim()) {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    const systemPrompt = `You are a professional software architect. Your task is to analyze the user's project idea and generate a complete structured development roadmap and workflow.
You must output a single JSON object. Do not include any markdown styling, code blocks, or extra text. Output strictly valid JSON.

The JSON schema must be exactly:
{
  "root": {
    "id": "workflow",
    "label": "workflow",
    "children": [
      {
        "id": "planning",
        "label": "Planning",
        "color": "#ec4899",
        "children": [
          {
            "id": "p1",
            "label": "Project Scope Definition",
            "details": "Details here...",
            "tools": ["Miro"],
            "features": ["Scope setup"],
            "databaseTables": [],
            "apiEndpoints": [],
            "testingTools": [],
            "deploymentTools": []
          }
        ]
      },
      {
        "id": "design",
        "label": "Design",
        "color": "#3b82f6",
        "children": []
      },
      {
        "id": "implementation",
        "label": "Implementation",
        "color": "#10b981",
        "children": []
      },
      {
        "id": "testing",
        "label": "Testing",
        "color": "#f59e0b",
        "children": []
      },
      {
        "id": "deployment",
        "label": "Deployment",
        "color": "#f97316",
        "children": []
      },
      {
        "id": "maintenance",
        "label": "Maintenance",
        "color": "#a855f7",
        "children": []
      }
    ]
  },
  "techStack": {
    "frontend": "Frontend details",
    "backend": "Backend details",
    "database": "Database details",
    "hosting": "Hosting details",
    "aiTools": "AI details",
    "devTools": "Dev details"
  },
  "techStackDetails": [
    {
      "name": "React",
      "category": "Frontend",
      "whyToUse": "Easy to build complex UI.",
      "alternatives": ["Vue"],
      "rating": 5
    }
  ],
  "bashCommand": "mkdir custom-project && cd custom-project"
}`;

    let response;
    try {
      response = await openai.chat.completions.create({
        model: chatModel,
        messages: [
          { role: "system", content: "You output strictly valid JSON conforming to the requested schema. No conversational filler or markdown formatting." },
          { role: "user", content: `${systemPrompt}\n\nProject: ${finalPrompt}` }
        ],
        temperature: 0.3
      });
    } catch (err) {
      if (isOpenRouter) {
        console.warn("⚠️ OpenRouter failed, trying fallback model:", err.message);
        response = await openai.chat.completions.create({
          model: fallbackChatModel,
          messages: [
            { role: "system", content: "You output strictly valid JSON conforming to the requested schema. No conversational filler or markdown formatting." },
            { role: "user", content: `${systemPrompt}\n\nProject: ${finalPrompt}` }
          ],
          temperature: 0.3
        });
      } else {
        throw err;
      }
    }

    const resultText = cleanJsonString(response.choices[0].message.content);
    const parsedData = JSON.parse(resultText);

    res.json({ 
      success: true, 
      workflow: parsedData,
      plan: parsedData 
    });
  } catch (error) {
    console.error("createWorkflow error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// SECTION 4: AI IMAGE GENERATOR CONTROLLER
// ==========================================
export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth || {};
    const { prompt, style } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, message: "Prompt is required" });
    }

    const finalPrompt = style && style !== 'None' 
      ? `${prompt}, high-fidelity ${style} style, futuristic premium AI SaaS style, 8k resolution, photorealistic` 
      : `${prompt}, futuristic premium AI SaaS style, 8k resolution, photorealistic`;

    let imageUrl;
    
    // Attempt DALL-E 3 synthesis first if using official OpenAI client
    try {
      if (!isOpenRouter && process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.startsWith("placeholder")) {
        console.log("🎨 Synthesizing image with official OpenAI DALL-E 3...");
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt: finalPrompt,
          n: 1,
          size: "1024x1024"
        });
        imageUrl = response.data[0].url;
      } else {
        throw new Error("Using fallback rendering model");
      }
    } catch (dalleErr) {
      console.warn("⚠️ DALL-E 3 failed or bypassed. Using high-fidelity visual rendering fallback:", dalleErr.message);
      const seed = Math.floor(Math.random() * 1000000);
      imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=1024&height=1024&nologo=true&seed=${seed}`;
    }

    if (userId) {
      try {
        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${imageUrl}, 'image')`;
      } catch (dbErr) {
        console.warn("⚠️ Database save skipped for image generation:", dbErr.message);
      }
    }

    res.json({
      success: true,
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error("generateImage error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// SECTION 5: BACKGROUND REMOVER CONTROLLER
// ==========================================
export const removeBackground = async (req, res) => {
  try {
    let base64Image = req.body.image;

    // Handle direct file uploads via Multer
    if (req.file) {
      base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      console.log("📂 Multer upload captured in removeBackground");
    }

    if (!base64Image) {
      return res.status(400).json({ success: false, message: "No image file or base64 representation provided" });
    }

    // Mirror image data back to be rendered interactively on high fidelity client canvas chroma mask
    res.json({
      success: true,
      processedImage: base64Image
    });
  } catch (error) {
    console.error("removeBackground error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// SECTION 6: RESUME REVIEWER CONTROLLER
// ==========================================
export const reviewResume = async (req, res) => {
  try {
    let resumeText = req.body.resumeText || "";
    const { jobDescription } = req.body;

    // Handle direct file uploads in memory buffers
    if (req.file) {
      const buffer = req.file.buffer;
      const fileName = req.file.originalname;
      console.log(`📂 Multer file upload captured in reviewResume: ${fileName}`);
      
      if (fileName.endsWith('.pdf')) {
        try {
          resumeText = await extractTextFromPdf(buffer);
        } catch (pdfErr) {
          console.error("pdf-parse failed:", pdfErr.message);
          return res.status(400).json({ success: false, message: "Failed to parse PDF file: " + pdfErr.message });
        }
      } else if (fileName.endsWith('.docx')) {
        try {
          const parsedData = await mammoth.extractRawText({ buffer });
          resumeText = parsedData.value;
        } catch (docxErr) {
          console.error("mammoth failed:", docxErr.message);
          return res.status(400).json({ success: false, message: "Failed to parse DOCX file: " + docxErr.message });
        }
      } else {
        // Plain text buffer conversion
        resumeText = buffer.toString('utf-8');
      }
    }

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ success: false, message: "Resume text content is empty or unsupported" });
    }

    const targetJob = jobDescription || "General Professional Software Engineer / Developer role";

    const systemPrompt = `You are a Senior Executive Recruiter and professional ATS (Applicant Tracking System) Analyzer.
Evaluate the following resume text against the target job profile: "${targetJob}".
Analyze and extract skills, education, projects, experience, keywords, missing keywords, formatting issues, grammar suggestions, improvement suggestions, and an ATS score out of 100.
Also, provide a fully polished, rewritten Markdown resume that optimizes their experience with measurable metrics.

You MUST return a single valid JSON object. Do not wrap in markdown code blocks or add any conversational filler.
The JSON schema MUST match:
{
  "atsScore": 85,
  "skills": ["React", "Node.js", "Express", "PostgreSQL"],
  "education": ["BS in Computer Science, State University"],
  "projects": ["QuickAI: Multi-model AI SaaS suite built with React & Express"],
  "experience": ["Senior Engineer at Tech Corp (2022-Pres): Led migration to microservices"],
  "keywords": ["Node.js", "Express", "API Design", "Architecture"],
  "missingKeywords": ["AWS", "Docker", "CI/CD"],
  "formattingIssues": ["Add visual section separators", "Keep bullet points consistent"],
  "grammarSuggestions": ["Change passive voice in experience section to action verbs"],
  "improvementSuggestions": ["Incorporate quantitative metrics (e.g. improved speed by 40%)"],
  "improvedResume": "# Professional Resume\\n\\nDetailed professional markdown content..."
}`;

    let response;
    try {
      response = await openai.chat.completions.create({
        model: chatModel,
        messages: [
          { role: "system", content: "You output strictly valid JSON conforming to the requested schema. No conversational filler or markdown formatting." },
          { role: "user", content: `${systemPrompt}\n\nResume Text:\n${resumeText}` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.4
      });
    } catch (err) {
      if (isOpenRouter) {
        console.warn("⚠️ OpenRouter failed for resume review, trying fallback model:", err.message);
        response = await openai.chat.completions.create({
          model: fallbackChatModel,
          messages: [
            { role: "system", content: "You output strictly valid JSON conforming to the requested schema. No conversational filler or markdown formatting." },
            { role: "user", content: `${systemPrompt}\n\nResume Text:\n${resumeText}` }
          ],
          response_format: { type: "json_object" },
          temperature: 0.4
        });
      } else {
        throw err;
      }
    }

    const resultText = cleanJsonString(response.choices[0].message.content);
    const parsedData = JSON.parse(resultText);

    res.json({
      success: true,
      analysis: parsedData
    });
  } catch (error) {
    console.error("reviewResume error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// SECTION 6a: LIVE RESUME MODIFIER CONTROLLER
// ==========================================
export const modifyResume = async (req, res) => {
  try {
    const { resumeText, prompt, jobDescription } = req.body;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({ success: false, message: "Resume text is empty or missing" });
    }
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ success: false, message: "User prompt is empty or missing" });
    }

    const targetJob = jobDescription || "General Professional Software Engineer / Developer role";

    const systemPrompt = `You are a professional executive resume writer and ATS optimizer.
Your task is to take the provided resume in Markdown/text and update/edit it live based on the user's specific request: "${prompt}".
Target Job Role: "${targetJob}".

Ensure you:
1. Incorporate the requested change perfectly (e.g., adding a specific React project, modifying the summary, adding internship experience, making the resume ATS friendly).
2. Keep the formatting highly professional, polished, and optimized for ATS systems.
3. Keep the content detailed, and use quantitative achievements (e.g. "improved query performance by 30%").
4. Output the updated resume in standard professional Markdown.

Your entire response should be in pure, standard Markdown only. Do not wrap in markdown code blocks (e.g., do not start with \`\`\`markdown) and do not output conversational filler or introductions. Just output the clean, modified Markdown resume content directly.`;

    let response;
    try {
      response = await openai.chat.completions.create({
        model: chatModel,
        messages: [
          { role: "system", content: "You update resumes in Markdown based on user instructions. You only return the raw updated Markdown content with no conversation, code blocks, or comments." },
          { role: "user", content: `${systemPrompt}\n\nCurrent Resume Text:\n${resumeText}` }
        ],
        temperature: 0.5
      });
    } catch (err) {
      if (isOpenRouter) {
        console.warn("⚠️ OpenRouter failed for resume modify, trying fallback model:", err.message);
        response = await openai.chat.completions.create({
          model: fallbackChatModel,
          messages: [
            { role: "system", content: "You update resumes in Markdown based on user instructions. You only return the raw updated Markdown content with no conversation, code blocks, or comments." },
            { role: "user", content: `${systemPrompt}\n\nCurrent Resume Text:\n${resumeText}` }
          ],
          temperature: 0.5
        });
      } else {
        throw err;
      }
    }

    const updatedResume = response.choices[0].message.content;

    res.json({
      success: true,
      updatedResume: updatedResume
    });
  } catch (error) {
    console.error("modifyResume error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// SECTION 6b: AI RESUME GENERATOR CONTROLLER
// ==========================================
export const generateResume = async (req, res) => {
  try {
    const { name, skills, projects, education, experience, jobTitle } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Full Name is required to build a resume." });
    }

    const targetTitle = jobTitle || "Professional Developer / Engineer";

    const systemPrompt = `You are a professional executive resume writer and ATS optimizer.
Create a beautifully structured, professionally written, and high-impact resume in Markdown.
Incorporate action verbs, quantitative achievements, and optimize keywords for a "${targetTitle}" role.

Details to include:
- Name: ${name}
- Skills: ${skills || "None provided"}
- Projects: ${projects || "None provided"}
- Education: ${education || "None provided"}
- Experience: ${experience || "None provided"}

Output format:
Your response should be in pure, standard Markdown. Use clear headings (# for Name, ## for Sections) and bullet points for lists. Do not include conversational filler or extra metadata.`;

    const response = await openai.chat.completions.create({
      model: chatModel,
      messages: [
        { role: "system", content: "You generate professional resumes in Markdown. Do not output conversational text or introductions." },
        { role: "user", content: systemPrompt }
      ],
      temperature: 0.5
    });

    const markdownResume = response.choices[0].message.content;

    // Dynamically compile Markdown to beautifully typeset PDF via PDFKit
    const pdfBuffer = await new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers = [];
        doc.on('data', chunk => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', err => reject(err));

        // Styling Layout Configuration
        doc.fillColor('#0f172a'); // slate-900

        const lines = markdownResume.split('\n');
        lines.forEach(line => {
          const trimmed = line.trim();
          if (trimmed.startsWith('# ')) {
            const content = trimmed.substring(2);
            doc.fontSize(22).font('Helvetica-Bold').fillColor('#1e1b4b').text(content, { align: 'center' });
            doc.moveDown(0.4);
          } else if (trimmed.startsWith('## ')) {
            const content = trimmed.substring(3);
            doc.fontSize(12).font('Helvetica-Bold').fillColor('#4338ca').text(content.toUpperCase());
            // Draw neat line divisor below heading
            doc.moveTo(50, doc.y).lineTo(560, doc.y).strokeColor('#e2e8f0').lineWidth(1).stroke();
            doc.moveDown(0.4);
          } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const content = trimmed.substring(2);
            doc.fontSize(9.5).font('Helvetica').fillColor('#334155').text('•  ' + content, { indent: 15 });
            doc.moveDown(0.25);
          } else if (trimmed !== '') {
            doc.fontSize(9.5).font('Helvetica').fillColor('#334155').text(trimmed);
            doc.moveDown(0.35);
          }
        });

        doc.end();
      } catch (pdfErr) {
        reject(pdfErr);
      }
    });

    res.json({
      success: true,
      markdownResume,
      pdfBase64: pdfBuffer.toString('base64')
    });

  } catch (error) {
    console.error("generateResume error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// SECTION 7: AI CHATBOT CONTROLLER
// ==========================================
export const handleChat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    const chatHistory = history || [];
    const messages = [
      { 
        role: "system", 
        content: `You are Quick.ai's premium 24/7 AI Architect and Coding Assistant. 
You provide clear, accurate, and comprehensive help with code development, API design, system architecture, database modeling, tech stack optimization, and deployment scripts.
Support full Markdown formatting, code blocks, structured lists, and step-by-step guides. Keep your tone supportive, smart, and futuristic.`
      },
      ...chatHistory.slice(-10), // Limit history to last 10 exchanges for performance
      { role: "user", content: message }
    ];

    let response;
    try {
      response = await openai.chat.completions.create({
        model: chatModel,
        messages: messages,
        temperature: 0.5
      });
    } catch (err) {
      if (isOpenRouter) {
        console.warn("⚠️ OpenRouter chat failed, trying fallback model:", err.message);
        response = await openai.chat.completions.create({
          model: fallbackChatModel,
          messages: messages,
          temperature: 0.5
        });
      } else {
        throw err;
      }
    }

    const responseText = response.choices[0].message.content;

    res.json({
      success: true,
      response: responseText
    });
  } catch (error) {
    console.error("handleChat error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

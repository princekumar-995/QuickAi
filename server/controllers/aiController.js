import OpenAI from "openai";

import sql from "../configs/db.js";

const openai = new OpenAI({
    apiKey: "GEMINI_API_KEY",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});
export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== 'premium' && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue."
      });
    }
const response = await openai.chat.completions.create({

    model: "gemini-2.5-flash",
    messages: [
        {
            role: "user",
            content:prompt,
        },

    ],
    temperature:0.7,
    max_tokens:length,
});

const content= response.choices[0].message.content
await sql `INSERT INTO creations (user_id,prompt,content,type) VALUES (${userId},${prompt},${content},'article)`;

if(plan !=='premium'){
  await clerkClient.users.updateUserMetadata(userId,{
    privateMetadata:{

      free_usage:free_usage +1
    }
  })
}
res.json({success:true,content})

  } catch (error) {
    console.log(error.message)
    res.json({success:false,message:error.message})
  }
}

// //import geminiModel from "../configs/gemini.js";
// import OpenAI from "openai";
// import sql from "../configs/db.js";
// import { clerkClient } from "@clerk/express";

// const AI = new OpenAI({
//   apiKey: process.env.GEMINI_API_KEY,
//   baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
// });

// export const generateArticle = async (req, res) => {
//   try {
//      const { userId } = req.auth();
//     const { prompt, length } = req.body;

//     // const plan = user.privateMetadata?.plan || "free";
//     const plan = "free";
//     const free_usage = 0; // 🔒 Usage limit
//     if (plan !== "premium" && free_usage >= 10) {
//       return res.json({
//         success: false,
//         message: "Limit reached. Upgrade to continue.",
//       });
//     }

//    // 🤖 Gemini API
//     const response = await AI.chat.completions.create({
//       model: "gemini-1.5-flash",
//       messages: [
//         {
//           role: "user",
//           content: prompt
//         }
//       ],
//       temperature: 0.7,
//       max_tokens: length || 500
//     });

//     const content = response.choices[0].message.content;

//    // 💾 Save to DB
//     await sql`
//       INSERT INTO creations (user_id, prompt, content, type)
//       VALUES (${userId}, ${prompt}, ${content}, 'article')
//     `;

//     //📉 Update free usage
//     if (plan !== "premium") {
//       await clerkClient.users.updateUserMetadata(userId, {
//         privateMetadata: {
//           free_usage: free_usage + 1
//         }
//       });
//     }

//     const result = await geminiModel.generateContent(prompt);
//     const message = result.response.candidates[0].content.parts[0].text;

//     res.json({
//       success: true,
//       content: message,
//     });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };







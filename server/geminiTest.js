import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const geminiKey = process.env.GEMINI_API_KEY;

if (!geminiKey || geminiKey === "your_gemini_api_key_here") {
  console.error("❌ Error: GEMINI_API_KEY is not configured in your server/.env file!");
  process.exit(1);
}

const client = new OpenAI({
  apiKey: geminiKey,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

async function runTest() {
  console.log("⚡ Testing connection to Google Gemini API...");
  try {
    const response = await client.chat.completions.create({
      model: "gemini-1.5-flash",
      messages: [
        { role: "user", content: "Say hello in one sentence to verify the API connection." }
      ]
    });

    console.log("\n✅ Gemini Response Success!");
    console.log("Response content:", response.choices[0].message.content);
  } catch (err) {
    console.error("\n❌ Gemini API request failed!");
    console.error(err);
  }
}

runTest();

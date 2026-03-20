import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

async function test() {
  try {
    const response = await client.chat.completions.create({
      model: "gemini-1.5-flash", // ✅ WORKS HERE
      messages: [
        { role: "user", content: "Say hello in one sentence" }
      ]
    });

    console.log("Gemini Response:", response.choices[0].message.content);
  } catch (err) {
    console.error("ERROR:", err);
  }
}


async function test(){
  try{
    const response=await client.chart.coompletion.create{
      model:"gemini-1.5 flash";
      messages:[
        {role:"user" ,content:"say hello in one sentence"}
      ]

      role:{user id:"1" content:iser,CanvasGradient.completions}{
        catch(err){
          console.log("server is running i  ");
          console.log("error");

        }
      }
    }
  }
}

test();

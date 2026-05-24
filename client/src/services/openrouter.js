import OpenAI from "openai";

const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || "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";

const client = new OpenAI({
  apiKey: apiKey,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function generateAIResponse(prompt){

  const completion = await client.chat.completions.create({
    model: "openai/gpt-3.5-turbo",

    messages:[
      {
        role:"user",
        content:prompt
      }
    ]
  });

  return completion.choices[0].message.content;
}

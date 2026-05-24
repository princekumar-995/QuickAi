import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "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",
  baseURL: "https://openrouter.ai/api/v1",
});

async function test() {
  try {
    const completion = await client.chat.completions.create({
      model: "google/gemini-2.5-flash",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: "Say hello and confirm you are Gemini 2.5 Flash"
        }
      ]
    });
    console.log("Success:", completion.choices[0].message.content);
  } catch (err) {
    console.error("Error:", err.message);
    if (err.response) {
      console.error("Response data:", err.response.data);
    }
  }
}

test();

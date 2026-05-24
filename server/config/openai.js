const OpenAI = require("openai");

const apiKey = process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY || "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";
const baseURL = process.env.OPENAI_API_KEY ? undefined : "https://openrouter.ai/api/v1";

const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: baseURL,
});

module.exports = openai;

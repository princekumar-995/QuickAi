import OpenAI from "openai";

const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey && apiKey !== "your_openai_api_key_here" && !apiKey.startsWith("placeholder")) {
    console.log("🚀 Using official OpenAI API Client");
    return {
      client: new OpenAI({ apiKey }),
      isOpenRouter: false,
      chatModel: "gpt-4o-mini",
      imageModel: "dall-e-3"
    };
  }
  
  // Fallback to OpenRouter (using configured or hardcoded key for bulletproof execution)
  const openRouterKey = process.env.OPENROUTER_API_KEY || "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";
  console.log("🌐 Using OpenRouter API Client Fallback");
  return {
    client: new OpenAI({
      apiKey: openRouterKey,
      baseURL: "https://openrouter.ai/api/v1"
    }),
    isOpenRouter: true,
    chatModel: "openai/gpt-4o-mini",
    fallbackChatModel: "google/gemini-2.5-flash",
    imageModel: "openai/gpt-4o-mini"
  };
};

const aiConfig = getOpenAIClient();

export const openai = aiConfig.client;
export const chatModel = aiConfig.chatModel;
export const fallbackChatModel = aiConfig.fallbackChatModel || "google/gemini-2.5-flash";
export const isOpenRouter = aiConfig.isOpenRouter;
export const imageModel = aiConfig.imageModel;
export default openai;

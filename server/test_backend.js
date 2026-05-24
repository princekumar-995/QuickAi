import 'dotenv/config';
import { generateArticle } from "./controllers/aiController.js";

async function testController() {
  const req = {
    auth: { userId: "user_2yMX02PRbyMtQK6PebpjnxvRNIA" },
    body: { prompt: "Explain loops in programming", length: 100 },
    plan: "free",
    free_usage: 0
  };

  const res = {
    json: (data) => {
      console.log("Controller Output:", data);
    },
    status: (code) => {
      console.log("Status Code:", code);
      return res;
    }
  };

  try {
    await generateArticle(req, res);
  } catch (err) {
    console.error("Controller Error:", err);
  }
}

testController();

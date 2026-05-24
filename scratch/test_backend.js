import { generateArticle } from "../server/controllers/aiController.js";
import dotenv from "dotenv";
dotenv.config({ path: "../server/.env" });

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

import express from "express";
import { auth } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";
import { 
  generateArticle, 
  generatePlan, 
  generateWorkflow,
  generateImage,
  removeBackground,
  reviewResume,
  modifyResume,
  generateResume,
  handleChat
} from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.post('/generate-article', auth, generateArticle);
aiRouter.post('/generate-plan', auth, generatePlan);
aiRouter.post('/generate-workflow', auth, generateWorkflow);

// New premium endpoints for Section 4, 5, 6, and 7
aiRouter.post('/generate-image', auth, generateImage);
aiRouter.post('/remove-background', auth, upload.single('image'), removeBackground);
aiRouter.post('/review-resume', auth, upload.single('file'), reviewResume);
aiRouter.post('/modify-resume', auth, modifyResume);
aiRouter.post('/generate-resume', auth, generateResume);
aiRouter.post('/chat', auth, handleChat);

export default aiRouter;



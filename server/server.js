// import express from 'express';
// import cors from 'cors';
// import 'dotenv/config';
// import { clerkMiddleware,requireAuth } from '@clerk/express'
// import aiRouter from './routes/aiRoutes.js';


// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(clerkMiddleware())


// // app.get('/', (req, res) => res.send('Server is Live! !'));

//  app.use(requireAuth())

// app.use('/api/ai',aiRouter);

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log('Server is running on port', PORT);
// });



import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import aiRouter from './routes/aiRoutes.js';
import blogRouter from './routes/blogRoutes.js';
import { 
  handleChat, 
  generateImage, 
  removeBackground, 
  reviewResume, 
  modifyResume,
  generateResume, 
  createWorkflow 
} from './controllers/aiController.js';
import { auth } from './middlewares/auth.js';
import { upload } from './middlewares/upload.js';

const app = express();

// Configure CORS properly with dynamic allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost:")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(clerkMiddleware());

// Health route
app.get("/", (req, res) => {
   res.json({
      success: true,
      message: "Backend Connected"
   });
});

// Dummy geminiLimiter for compatibility
const geminiLimiter = (req, res, next) => next();

// Register the targeted workflow generation route
app.post('/api/generate/workflow', geminiLimiter, createWorkflow);

// Register direct routes as aliases for production compatibility
app.post('/api/chat', auth, handleChat);
app.post('/api/generate-image', auth, generateImage);
app.post('/api/remove-background', auth, upload.single('image'), removeBackground);
app.post('/api/review-resume', auth, upload.single('file'), reviewResume);
app.post('/api/modify-resume', auth, modifyResume);
app.post('/api/generate-resume', auth, generateResume);

// Standard modular routers
app.use('/api/ai', aiRouter);
app.use('/api/blogs', blogRouter);

// Backend server runs on 5000 now
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});


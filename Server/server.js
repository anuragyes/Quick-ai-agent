


import express from 'express';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import cors from 'cors';
import aiRouter from './routes/airoutes.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userroutes.js';

// Initialize Express app
const app = express();

// Define an async function to handle the app setup
const startServer = async () => {
  try {
    // Connect to Cloudinary
    await connectCloudinary();

    // Middleware to parse JSON bodies
    app.use(cors());
    app.use(express.json());

    // Middleware to parse URL-encoded bodies (for form submissions)
    app.use(express.urlencoded({ extended: true }));

    // Apply Clerk Middleware globally
    app.use(clerkMiddleware());

    // Home route - public route (can be accessed without authentication)
    app.get('/', (req, res) => {
      res.send('Hello, World!');
    });

    app.get('/api/hello', (req, res) => {
      res.json({ message: 'Hello from the protected API!' });
    });

    // Protected API route - requires authentication
    app.use(requireAuth());  // This ensures that any route below this is protected

    // API routes for AI (you can define your AI-related routes in aiRouter)
    app.use('/api/ai', aiRouter);
    app.use("/api/user",userRouter);

    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error during server setup:", error);
  }
};

// Call the async function to start the server
startServer();


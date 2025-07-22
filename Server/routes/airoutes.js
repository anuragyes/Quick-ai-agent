import express from 'express';
import { generateArticle, generateblog, generateImage, RemoveImageBackground, RemoveImageObject, ReviewResume } from '../controllers/aicontroller.js';
import { auth } from "../middleware/auth.js";
import upload from '../config/multer.js';


const aiRouter = express.Router();

// POST route for generating articles, using auth middleware for authentication
aiRouter.post("/generate-article", auth, generateArticle);
aiRouter.post("/generate-blog", auth, generateblog);
aiRouter.post("/generate-img", auth, generateImage);


aiRouter.post("/remove-image-background", upload.single('image'), auth, RemoveImageBackground);

aiRouter.post("/remove-image-object", upload.single('image'), auth, RemoveImageObject);
aiRouter.post('/review-resume', upload.single('image'), auth, ReviewResume);



export default aiRouter;


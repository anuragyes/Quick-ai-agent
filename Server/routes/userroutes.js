
import express from 'express'
import { auth } from '../middleware/auth.js';
import { getPublicCreations, getUserCreations, Togglecreation } from '../controllers/usercontroller.js';


const userRouter = express.Router();



userRouter.get("/get-user-creations", auth, getUserCreations)

userRouter.get("/get-public-creations", auth, getPublicCreations)


userRouter.post("/get-toggle-creations", auth, Togglecreation)


export default userRouter;
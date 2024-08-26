import express from "express";

import { getAllUsers, logInController, signUpController } from "../controllers/userControllers.js";
import { logInValidator, signUpValidator, validationErrorHandler } from "../middlewares/validations/validators.js";

const userRouter = express.Router();

userRouter.post('/register', signUpValidator(), validationErrorHandler, signUpController);

userRouter.post('/login', logInValidator(), validationErrorHandler, logInController);

userRouter.get('/all', validationErrorHandler, getAllUsers);

export default userRouter;
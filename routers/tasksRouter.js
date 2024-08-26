import express from "express";

import { addTaskController, deleteTaskController, editTaskController, getAllTasksController, getTaskController } from "../controllers/tasksControllers.js";

import authMiddleware from "../middlewares/auth/userAuth.js";
import { taskIdValidator, addTaskValidator, validationErrorHandler, editTaskValidator } from "../middlewares/validations/validators.js";

const tasksRouter = express.Router();

// Router-level Auth middleware
tasksRouter.use(authMiddleware);

tasksRouter.get('/all', getAllTasksController);

tasksRouter.get('/:taskid', taskIdValidator(), validationErrorHandler, getTaskController);

tasksRouter.post('/add', addTaskValidator(), validationErrorHandler, addTaskController);

tasksRouter.put('/edit/:taskid', taskIdValidator(), editTaskValidator(), validationErrorHandler, editTaskController);

tasksRouter.delete('/delete/:taskid', taskIdValidator(), validationErrorHandler, deleteTaskController);

export default tasksRouter;
// Third-party Packages
import express from "express";

// DB Connection file
import "./utils/dbConnect.js";

// Routers
import userRouter from "./routers/userRouter.js";
import tasksRouter from "./routers/tasksRouter.js";

const app = express();
const port = process.env.PORT || 8000;

// JSON Body Parser
app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/tasks', tasksRouter);

// Handles req at unavailable endpoints
app.all('*', (req, res) => {
    return res.status(404).json({ message: 'API not found!' });
});

app.listen(port, () => {
    console.log(`Server running at ${port}.`);
});
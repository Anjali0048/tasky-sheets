import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    task: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
        default: false
    },
    reminders: [Date]
})

const TaskModel = mongoose.model('Task', taskSchema, 'tasks');

export default TaskModel;
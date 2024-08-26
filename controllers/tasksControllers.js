import TaskModel from "../models/Task.js";

import { getReminders } from "../utils/helpers.js";
import { cancelJobs, scheduleNotifications } from "../utils/notifications.js";
import { appendTasksToGoogleSheet, getAllTasksToSheets } from "./sheetController.js";

/* 
    @route : /api/tasks/add
    @method : POST
    @body : { task: , deadline: }
    @description :
        * For an invalid deadline, sends a 400 (Bad Req) response.
        * Otherwise, creates a new Task document and pushes it in the tasks collection.
*/
async function addTaskController(req, res) {
    try {
        let { task, deadline } = req.body;

        // Get 3 timestamps for the notifications
        const reminders = getReminders(deadline);
        deadline = new Date(deadline);

        // Extract user's ObjectId and phone no.
        const { id: user, phone } = req.user;

        const taskDoc = new TaskModel({ user, task, deadline, reminders });
        await taskDoc.save(); // Save the new Task info in the DB

        // Schedule reminders only if the task status is false
        const jobData = {
            taskID: taskDoc._id,
            task,
            deadline,
            receiver: phone,
            dateArr: reminders
        };
        scheduleNotifications(jobData);

        // Append data to Google Sheets
        await appendTasksToGoogleSheet(taskDoc);

        return res.status(200).json({ message: "Task Added Successfully." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error. Try Again!" });
    }
}

/* 
    @route : /api/tasks/edit/:taskid
    @method : PUT
    @body : { task: , status: , deadline: }
    @description :
        * For an invalid deadline, sends a 400 (Bad Req) response.
        * If the taskid is NA in the DB, sends a 404 (Not Found) response.
        * Otherwise, updates the relevant Task document.
*/
async function editTaskController(req, res) {
    try {
        const taskID = req.params.taskid;

        // Match taskid with userid
        const { id } = req.user;
        const task = await TaskModel.findOne({ _id: taskID, user: id });

        if (!task) {
            return res.status(404).json({ message: "Task Not Found!" });
        }

        // Extract the updated task info
        let { task: updatedTask, deadline, status } = req.body;

        // Get 3 timestamps for notifications
        const reminders = getReminders(deadline);
        deadline = new Date(deadline);

        // Update the task in the DB
        await TaskModel.updateOne(
            { _id: taskID },
            { $set: { task: updatedTask, status, deadline, reminders } }
        );
        cancelJobs(taskID); // Cancel the previously scheduled notifications

        if (!status) {
            const { phone } = req.user;
            const jobData = {
                taskID,
                task: updatedTask,
                deadline,
                receiver: phone,
                dateArr: reminders
            };
            scheduleNotifications(jobData);
        }
        return res.status(200).json({ message: "Task Updated Successfully." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error. Try Again!" });
    }
}

/* 
    @route : /api/tasks/delete/:taskid
    @method : DELETE
    @description :
        * Extracts taskid from the route param, and creates a delete query.
        * If deletedCount is 0, sends a 404(Not Found) response.
        * Otherwise if the doc is deleted, sends a 200 (OK) response.
*/
async function deleteTaskController(req, res) {
    try {
        const taskID = req.params.taskid;
        const { id } = req.user;
        const result = await TaskModel.deleteOne({ _id: taskID, user: id });
        const deleteCount = result.deletedCount;

        // For invalid taskid, deleteCount is 0
        if (!deleteCount) {
            return res.status(404).json({ message: "Task Not Found." });
        }
        return res.status(200).json({ message: "Task Deleted Successfully." });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error. Try Again!" });
    }
}

/* 
    @route : /api/tasks/:taskid
    @method : GET
    @description :
        * For an invalid taskid, sends a 404 (Not Found) response.
        * Otherwise, sends the relevant JSON document with 200 status code.
*/
async function getTaskController(req, res) {
    try {
        const { id } = req.user;
        const taskDoc = await TaskModel.findOne({ _id: req.params.taskid, user: id }, '-__v -_id -user');

        if (!taskDoc) {
            return res.status(404).json({ message: "Task Not Found!" });
        }
        return res.status(200).json(taskDoc);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error. Try Again!" });
    }
}

/* 
    @route : /api/tasks/all
    @method : GET
    @description :
        * If no tasks are available for the user, sends a 404 (Not Found) response.
        * Otherwise, sends an array of Task documents with 200 status code.
*/
async function getAllTasksController(req, res) {
    try {
        const { id } = req.user;
        const tasks = await TaskModel.find({ user: id }, '-__v -_id');

        // fetch tasks from mongodb and append to sheet
        await getAllTasksToSheets(tasks);

        return res.status(200).json(tasks);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error. Try Again!" });
    }
}

export { addTaskController, editTaskController, deleteTaskController, getTaskController, getAllTasksController };
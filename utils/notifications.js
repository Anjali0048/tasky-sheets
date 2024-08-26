import { scheduleJob } from "node-schedule";
import sendSMS from "./sendSMS.js";

// To track of the scheduled jobs for each task
const jobs = {};

function scheduleNotifications(jobData) {
    const { taskID, task, deadline, receiver, dateArr } = jobData;
    // Create a key with the given taskid and map it to an empty array
    jobs[taskID] = [];

    // Schedule 3 notifications
    dateArr.forEach((date, i) => {
        const msgBody = `Reminder ${i + 1} to finish your task: "${task}" by ${deadline.toString()}.`;
        const job = scheduleJob(date, async () => {
            try {
                const msg = { body: msgBody, to: receiver };
                await sendSMS(msg);
            } catch (error) {
                console.log(error);
            }
        });
        // Push every job object in the above array
        jobs[taskID].push(job);
    });
}

function cancelJobs(taskID) {
    jobs[taskID]?.forEach(job => job.cancel());
}

export { scheduleNotifications, cancelJobs };
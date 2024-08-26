import { google } from "googleapis";
import { GoogleSpreadsheet } from "google-spreadsheet";

async function getSheet(sheetTitle) {
    // Authenticate with Google
    const auth = new google.auth.GoogleAuth({
        keyFile: 'googleKeys.json', // Path to google credentials
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const spreadsheetId = process.env.SPREAD_SHEET_ID;

    // Load the spreadsheet
    const doc = new GoogleSpreadsheet(spreadsheetId, auth);
    await doc.loadInfo();

    await doc.updateProperties({ title: "Tasky sheets" });

    let sheet = doc.sheetsByTitle[sheetTitle];
    if (!sheet) {
        // Create a new sheet with appropriate headers based on the title
        if (sheetTitle === "Tasks") {
            sheet = await doc.addSheet({
                title: "Tasks",
                headerValues: ['User', 'Task', 'Deadline', 'Status', 'Reminders'],
            });
        } else if (sheetTitle === "Users") {
            sheet = await doc.addSheet({
                title: "Users",
                headerValues: ['id', 'fname', 'email', 'phone'],
            });
        }
    }

    return sheet;
}

// Append task data to the "Tasks" sheet
async function appendTasksToGoogleSheet(taskDoc) {
    const taskSheet = await getSheet("Tasks");

    const values = [
        {
            User: taskDoc.user.toString(),
            Task: taskDoc.task,
            Deadline: taskDoc.deadline.toISOString(),
            Status: taskDoc.status,
            Reminders: taskDoc.reminders.join(', '),
        },
    ];

    await taskSheet.addRows(values);
}

// fetching all tasks from mongoDB and then append to "Tasks" sheet
async function getAllTasksToSheets (tasks) {
    const taskSheet = await getSheet("Tasks");

    const rows = tasks.map(task => [
        task.user.toString(),
        task.task,
        new Date(task.deadline).toISOString(),
        task.status,
        task.reminders.join(', ')
    ]);

    await taskSheet.addRows(rows);
}

// Append user data to the "Users" sheet
async function appendUserToGoogleSheet(users) {
    const userSheet = await getSheet("Users");

    const rows = users.map(user => ({
        id: user._id,
        fname: user.fname,
        email: user.email,
        phone: user.phone,
    }));

    await userSheet.addRows(rows);
}

export { appendTasksToGoogleSheet, appendUserToGoogleSheet, getAllTasksToSheets };


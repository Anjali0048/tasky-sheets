import { google } from "googleapis"

async function accessGoogleSheet () {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: `${process.env.CLIENT_EMAIL}`,
            private_key: `${process.env.PRIVATE_KEY}`,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })    
    
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth })
    
    const spreadsheetId = process.env.SPREAD_SHEET_ID;
    const range = 'tasks';

    async function readSheetData () {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range
        })
        const values = response.data.values;
        console.log(values);
    }
    readSheetData();
}

accessGoogleSheet();
import twilio from "twilio";


// const {
//     TWILIO_SID: sid,
//     TWILIO_AUTH: auth,
//     TWILIO_NO: myNo
// } = process.env;

// const client = twilio(sid, auth);

async function sendSMS(msg) {
    try {
        const { body, to } = msg;
        // const res = await client.messages.create({
        //     body,
        //     to,
        //     from: myNo
        // });
        // console.log(res);
        console.log(body);
    } catch (error) {
        console.log(error);
    }
}

export default sendSMS;
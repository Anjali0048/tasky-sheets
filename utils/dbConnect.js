import mongoose from "mongoose";


async function connectMongo() {
    try {
        const db = process.env.DB_NAME;
        await mongoose.connect(`${process.env.MONGO_URI}${db}`);
        console.log('Connected to MongoDB.');
    } catch (error) {
        console.log('Error connecting to MongoDB.');
        console.log(error);
    }
}

connectMongo();
import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {

    await mongoose.connect('mongodb://127.0.0.1:27017/food-del').then(() => console.log("DB Connected"));

}

// export const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_CONNECT_URI)
//         console.log("Connect to MongoDB successfully")
//     } catch (error) {
//         console.log("Connect failed " + error.message)
//     }
// }

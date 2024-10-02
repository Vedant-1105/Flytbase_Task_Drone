import mongoose, { Mongoose } from "mongoose";
import dotenv from "dotenv";
import { ApiError } from "../utils/ApiError";
import { DB_NAME } from "../constants";
dotenv.config();


const connectDB = async () =>{
    try {
       const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
       console.log(`\nMongo DB Connected !! \nDB Host : ${connectionInstance.connection.host}`)
    } catch (error) {
        throw new ApiError(404 , "MONGODB Connection Faild")
    }
}



export default connectDB;
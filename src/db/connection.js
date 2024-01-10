import mongoose from "mongoose";

import { dbName } from "../constants.js";


const dbConnection = async() =>{
    try {
       const mongoConnection = await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`)
       console.log("connection established" , mongoConnection.connection.host, mongoConnection.connection.port);
    } catch (error) {
        console.error("MongoDb connection failed: " , error);
    }
}

export default dbConnection

import dotenv from "dotenv";
import dbConnection from "./db/connection.js";

import app from "./app.js";

dotenv.config({
    path: './env'
});

dbConnection()
.then(() =>{

    app.on("error",(err) =>{
        console.log("Error: " + err);
        throw err;
    });

    app.listen(process.env.PORT || 8000 , () =>{
        console.log(`Server running at ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.error("Mongo Db Connection Failed", err.message);
})
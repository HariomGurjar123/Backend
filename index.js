import { app } from "./app.js";
import { connectDB } from "./db/db.js";
import dotenv from "dotenv";


dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 4000, ()=>{
        console.log(`Server is running on ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("Server is not running", err);
})

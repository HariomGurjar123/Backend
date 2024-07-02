import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));

app.use(express.json({limit:"16KB"}))
app.use(express.static("Public"))
app.use(express.urlencoded({urlencoded:true,limit:"16KB"}))
app.use(cookieParser())

import userRouter from "./routes/user.route.js"
app.use("/users",userRouter)

export {app}
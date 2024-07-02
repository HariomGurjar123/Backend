import mongoose from "mongoose";

const connectDB = async (req, res) => {
    try {
      mongoose.connect(`${process.env.MONGODB_CONNECTION}`)
        console.log("Database Connected Successfully");

    } catch(error) {
        console.log("DB Not Connected");
        process.exit(1)
    }
}

export { connectDB }
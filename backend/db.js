import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://anjali7860:Tanu8764@cluster.mongodb.net/sanux", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("🟢 MongoDB Connected Successfully");
  } catch (error) {
    console.error("🔴 MongoDB Connection Failed:", error.message);
  }
};

export default connectDB;

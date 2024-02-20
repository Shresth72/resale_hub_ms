import mongoose from "mongoose";
import { mongo_url } from "./config";
mongoose.set("strictQuery", false);

const ConnectDB = async () => {
  const MONGO_URL = mongo_url;
  if (!MONGO_URL) {
    throw new Error("MONGO_URL is not defined");
  }

  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};

export default ConnectDB;

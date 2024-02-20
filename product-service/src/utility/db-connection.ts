import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const ConnectDB = async () => {
  const MONGO_URL =
    "mongodb+srv://snehashrivastava539:lNpNGriULxiLdnKe@products.jxjf28x.mongodb.net/products";
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

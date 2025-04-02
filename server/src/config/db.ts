import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const MONGO_URL = process.env.MONGO_URL;
    if (!MONGO_URL) {
      throw new Error("MONGO_URL is not defined!");
    }

    mongoose.set("strictQuery", true);

    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

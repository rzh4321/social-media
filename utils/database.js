import mongoose from "mongoose";

let isConnected = false; // track the connection

const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;

  } catch (error) {
    console.log(error);
  }
};

export default connectToDB;

import mongoose, { Mongoose } from "mongoose";

interface Connection {
  isConnected?: number;
}

const connection: Connection = {};

const connectToDb = async (): Promise<void> => {
  try {
    if (connection.isConnected) {
      console.log("Using existing connection");
      return;
    }
    const db: Mongoose = await mongoose.connect(
      process.env.MONGO_URI as string
    );
    connection.isConnected = db.connections[0].readyState;
    console.log("New connection");
  } catch (error) {
    console.log(error);
    throw new Error(String(error));
  }
};

export default connectToDb;

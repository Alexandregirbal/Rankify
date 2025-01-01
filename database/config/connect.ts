import { getEnvConfigs } from "@/envConfig";
import type { Connection } from "mongoose";
import mongoose from "mongoose";

const createMongooseConnection = async (): Promise<mongoose.Connection> => {
  const options = {
    useCreateIndex: true,
    bufferCommands: false,
  };
  const connectionResult = await mongoose.connect(
    getEnvConfigs().MONGODB_URI,
    options
  );
  console.debug("MongoDB connected");
  return connectionResult.connection;
};

let connection: Connection;

export const getMongooseConnection = async () => {
  if (!connection) {
    connection = await createMongooseConnection();
  }
  return connection;
};

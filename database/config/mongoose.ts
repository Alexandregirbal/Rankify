/* eslint-disable no-var */

import { getEnvConfigs } from "@/envConfig";
import type { MongoClient } from "mongodb";
import type { Mongoose } from "mongoose";
import { connect } from "mongoose";

declare global {
  var mongoose: {
    _mongoosePromise: Promise<Mongoose> | null;
    mongooseConnection: Mongoose | null;
    mongoClient: MongoClient | null;
  };
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    _mongoosePromise: null,
    mongooseConnection: null,
    mongoClient: null,
  };
}

type MongooseConnectReturnType = {
  mongooseConnection: Mongoose;
  mongoClient: MongoClient;
};

const mongooseConnect = async (): Promise<MongooseConnectReturnType> => {
  if (cached.mongooseConnection && cached.mongoClient) {
    return cached as MongooseConnectReturnType;
  }
  if (process.env.NODE_ENV === "test") {
    return {
      mongooseConnection: {} as Mongoose,
      mongoClient: {} as MongoClient,
    };
  }

  if (!cached._mongoosePromise) {
    const opts = {
      bufferCommands: false,
    };

    cached._mongoosePromise = connect(getEnvConfigs().MONGODB_URI, opts).then(
      (mongoose) => {
        return mongoose;
      }
    );
  }

  try {
    const mongooseConnection = await cached._mongoosePromise;
    if (!mongooseConnection) throw new Error("No connection returned");
    cached.mongooseConnection = mongooseConnection;
    cached.mongoClient =
      mongooseConnection.connection.getClient() as unknown as MongoClient;
  } catch (e) {
    cached._mongoosePromise = null;
    throw e;
  }

  return cached as MongooseConnectReturnType;
};

export default mongooseConnect;

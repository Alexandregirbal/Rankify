import { MongoClient } from "mongodb";
import "../envConfig";

const getDatabaseConfigs = () => {
  const mongodbUri = process.env.MONGODB_URI;
  if (!mongodbUri) {
    throw new Error("MONGODB_URI is not set");
  }
  return {
    mongodbUri,
  };
};

const options = {};

let client: MongoClient;

const uri = getDatabaseConfigs().mongodbUri;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
}

// Export a module-scoped MongoClient. By doing this in a
// separate module, the client can be shared across functions.
export default client;

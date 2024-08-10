import client from "./client";

export const getDatabaseClient = () => {
  const db = client.db("elo-world");
  return db;
};

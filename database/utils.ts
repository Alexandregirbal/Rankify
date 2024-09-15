import { ObjectId } from "mongodb";
import { SchemaOptions } from "mongoose";
import { z } from "zod";

export const zodObjectId = z.custom<ObjectId | string>((value) =>
  ObjectId.isValid(value)
);

export const baseMongoSchema = z.object({
  _id: zodObjectId,
  createdAt: z.date(),
  updatedAt: z.date(),
});

const transformOjectIdToString = (_doc: any, ret: Record<string, any>) => {
  if (ret._id) ret._id = ret._id.toString();
  // If you have any other ObjectIds in your schema (like playerId), convert them here
  return ret;
};

export const baseSchemaOptions: SchemaOptions<any> = {
  _id: true,
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: transformOjectIdToString,
  },
  toObject: {
    transform: transformOjectIdToString,
  },
};

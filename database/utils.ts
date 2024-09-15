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

export const baseSchemaOptions: SchemaOptions<any> = {
  _id: true,
  timestamps: true,
  versionKey: false,
};

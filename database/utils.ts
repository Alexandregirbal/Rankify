import { ObjectId } from "mongodb";
import { SchemaOptions, Types } from "mongoose";
import { z } from "zod";

export const zodObjectId = z.custom<ObjectId | string>((value) =>
  ObjectId.isValid(value)
);

export type ZodObjectId = z.infer<typeof zodObjectId>;

export const baseMongoSchema = z.object({
  _id: zodObjectId,
  createdAt: z.date(),
  updatedAt: z.date(),
});

const isObjectId = (value: any): value is Types.ObjectId =>
  Types.ObjectId.isValid(value) && value instanceof Types.ObjectId;

const transformObjectIdToString = (_doc: any, ret: Record<string, any>) => {
  for (const key of Object.keys(ret)) {
    if (isObjectId(ret[key])) {
      ret[key] = ret[key].toString();
    }
  }
  return ret;
};

export const baseSchemaOptions: SchemaOptions<any> = {
  _id: true,
  timestamps: true,
  versionKey: false,
  toJSON: {
    transform: transformObjectIdToString,
  },
  toObject: {
    transform: transformObjectIdToString,
  },
};

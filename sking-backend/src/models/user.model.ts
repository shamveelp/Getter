import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { ObjectId } from "mongodb";

export interface IUser extends Document {
  _id: ObjectId;
  username: string;
  email: string;
  password?: string;
  name: string;
  isActive: boolean;
  tokenVersion: number;
  profilePicture?: string;
  bio?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    name: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    tokenVersion: { type: Number, default: 0 },
    profilePicture: { type: String, default: "" },
    bio: { type: String, default: "" },
    phoneNumber: { type: String, default: "" }
  },
  { timestamps: true }
);

export const UserModel: Model<IUser> = mongoose.model<IUser>(
  "User",
  UserSchema
);
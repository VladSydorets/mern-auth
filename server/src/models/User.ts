import { Schema, model } from "mongoose";

export interface UserFields {
  name: string;
  password: string;
  email: string;
}

export interface User extends UserFields {
  _id: string;
  createdAt: Date;
}

const userSchema = new Schema<User>({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    maxlength: [50, "Name cannot be more than 50 characters"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [6, "Passowrd cannot be less than 6 characters"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const UserModel = model<User>("User", userSchema);

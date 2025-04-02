import { SimpleRes } from "./Types";

export interface UserLoginFields {
  email: string;
  password: string;
}

export interface UserFields extends UserLoginFields {
  name: string;
}

export interface User extends UserFields {
  _id: string;
}

export interface GetUser extends SimpleRes, User {}

export interface GetTokenRes {
  token: string;
  user: User;
}

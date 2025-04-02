import { AxiosError } from "axios";

export interface SimpleRes {
  status: number;
}

export interface ResMessage extends SimpleRes {
  message: string;
}

export type ResError = AxiosError<ResMessage>;

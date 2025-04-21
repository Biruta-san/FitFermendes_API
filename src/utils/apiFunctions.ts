import { Response } from "express";
import { ApiResponse } from "../models/responseModels";

export function sendSuccess<T>(res: Response, data: T, message?: string) {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return res.status(200).json(response);
}

export function sendError(
  res: Response,
  statusCode: number,
  error: string,
  message?: string
) {
  const response: ApiResponse<null> = {
    success: false,
    error,
    message,
  };
  return res.status(statusCode).json(response);
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

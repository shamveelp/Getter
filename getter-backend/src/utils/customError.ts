import { StatusCode } from "../enums/statusCode.enums";

export class CustomError extends Error {
  public readonly statusCode: StatusCode;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: StatusCode = StatusCode.INTERNAL_SERVER_ERROR,
    isOperational = true
  ) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);

    Error.captureStackTrace(this, this.constructor);
  }
}

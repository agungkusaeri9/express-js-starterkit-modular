export class AppError extends Error {
  public statusCode: number;
  public errors?: Record<string, string[]> | undefined;

  constructor(
    message: string,
    statusCode = 400,
    errors?: Record<string, string[]>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

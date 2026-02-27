/**
 * Centralized error message configuration.
 * Use for user-facing messages and error handling (per @03-data-and-api).
 */

export const ERROR_MESSAGES = {
  SERVER_ERROR: "Something went wrong. Please try again later.",
  NETWORK_ERROR: "Unable to connect. Please check your internet connection.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again.",
  VALIDATION_ERROR: "Invalid request parameters.",
  NOT_FOUND:
    "Unable to retrieve machine data. Please try again or contact support if the issue persists.",
} as const;

export type ErrorType = keyof typeof ERROR_MESSAGES;

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: unknown;
}

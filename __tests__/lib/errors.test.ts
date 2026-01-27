/**
 * Unit tests for error handling utilities
 */

import {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  handleApiError,
  getUserFriendlyMessage,
} from "@/lib/errors";
import { describe, it, expect } from "@jest/globals";

describe("Error Classes", () => {
  it("should create AppError with default status code", () => {
    const error = new AppError("Test error");
    expect(error.message).toBe("Test error");
    expect(error.statusCode).toBe(500);
    expect(error.isOperational).toBe(true);
  });

  it("should create ValidationError with 400 status", () => {
    const error = new ValidationError("Invalid input", { email: "Invalid email" });
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.fields).toEqual({ email: "Invalid email" });
  });

  it("should create AuthenticationError with 401 status", () => {
    const error = new AuthenticationError();
    expect(error.statusCode).toBe(401);
    expect(error.code).toBe("AUTHENTICATION_ERROR");
  });

  it("should create AuthorizationError with 403 status", () => {
    const error = new AuthorizationError();
    expect(error.statusCode).toBe(403);
    expect(error.code).toBe("AUTHORIZATION_ERROR");
  });

  it("should create NotFoundError with 404 status", () => {
    const error = new NotFoundError("Job");
    expect(error.message).toBe("Job not found");
    expect(error.statusCode).toBe(404);
  });
});

describe("Error Handling Utilities", () => {
  it("handleApiError should return proper response for AppError", () => {
    const error = new ValidationError("Invalid input");
    const response = handleApiError(error);
    
    expect(response.status).toBe(400);
  });

  it("handleApiError should hide error details in production", () => {
    process.env.NODE_ENV = "production";
    const error = new Error("Sensitive error");
    const response = handleApiError(error);
    
    const json = response.json();
    expect(json.error.message).not.toContain("Sensitive");
  });

  it("getUserFriendlyMessage should return user-friendly message", () => {
    const error = new ValidationError("Invalid input");
    const message = getUserFriendlyMessage(error);
    
    expect(message).toBe("Invalid input");
  });

  it("getUserFriendlyMessage should hide technical errors", () => {
    const error = new Error("Technical error details");
    const message = getUserFriendlyMessage(error);
    
    expect(message).toBe("Something went wrong. Please try again later.");
  });
});

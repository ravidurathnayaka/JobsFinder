/**
 * Unit tests for logger utility
 */

import { describe, it, expect, beforeEach, jest } from "@jest/globals";

// Mock console methods
const mockConsoleError = jest.spyOn(console, "error").mockImplementation();
const mockConsoleWarn = jest.spyOn(console, "warn").mockImplementation();
const mockConsoleInfo = jest.spyOn(console, "info").mockImplementation();
const mockConsoleDebug = jest.spyOn(console, "debug").mockImplementation();

describe("Logger", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset NODE_ENV
    process.env.NODE_ENV = "test";
  });

  it("should log info messages", () => {
    // Import logger after setting NODE_ENV
    jest.resetModules();
    const { logger } = require("@/lib/logger");
    
    logger.info("Test message", { key: "value" });
    
    expect(mockConsoleInfo).toHaveBeenCalled();
  });

  it("should log error messages with error objects", () => {
    jest.resetModules();
    const { logger } = require("@/lib/logger");
    
    const error = new Error("Test error");
    logger.error("Error occurred", error, { context: "test" });
    
    expect(mockConsoleError).toHaveBeenCalled();
  });

  it("should log warnings", () => {
    jest.resetModules();
    const { logger } = require("@/lib/logger");
    
    logger.warn("Warning message");
    
    expect(mockConsoleWarn).toHaveBeenCalled();
  });

  it("should not log debug messages in production", () => {
    process.env.NODE_ENV = "production";
    jest.resetModules();
    const { logger } = require("@/lib/logger");
    
    logger.debug("Debug message");
    
    expect(mockConsoleDebug).not.toHaveBeenCalled();
  });
});

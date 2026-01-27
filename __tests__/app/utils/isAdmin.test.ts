/**
 * Unit tests for isAdmin utility
 */

import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";

describe("isAdmin", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should return true for admin email", () => {
    process.env.ADMIN_EMAILS = "admin@example.com,another@example.com";
    const { isAdmin } = require("@/app/utils/isAdmin");
    
    expect(isAdmin("admin@example.com")).toBe(true);
    expect(isAdmin("another@example.com")).toBe(true);
  });

  it("should return false for non-admin email", () => {
    process.env.ADMIN_EMAILS = "admin@example.com";
    const { isAdmin } = require("@/app/utils/isAdmin");
    
    expect(isAdmin("user@example.com")).toBe(false);
  });

  it("should be case-insensitive", () => {
    process.env.ADMIN_EMAILS = "admin@example.com";
    const { isAdmin } = require("@/app/utils/isAdmin");
    
    expect(isAdmin("ADMIN@EXAMPLE.COM")).toBe(true);
  });

  it("should return false when ADMIN_EMAILS is not set", () => {
    delete process.env.ADMIN_EMAILS;
    const { isAdmin } = require("@/app/utils/isAdmin");
    
    expect(isAdmin("admin@example.com")).toBe(false);
  });

  it("should return false for null or undefined email", () => {
    process.env.ADMIN_EMAILS = "admin@example.com";
    const { isAdmin } = require("@/app/utils/isAdmin");
    
    expect(isAdmin(null)).toBe(false);
    expect(isAdmin(undefined)).toBe(false);
  });
});

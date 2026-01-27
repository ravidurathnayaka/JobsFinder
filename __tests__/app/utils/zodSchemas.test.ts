/**
 * Unit tests for Zod validation schemas
 */

import { describe, it, expect } from "@jest/globals";
import {
  companySchema,
  jobSchema,
  jobSeekerSchema,
  applicationSchema,
} from "@/app/utils/zodSchemas";

describe("Zod Schemas", () => {
  describe("companySchema", () => {
    it("should validate valid company data", () => {
      const validData = {
        name: "Test Company",
        location: "San Francisco",
        logo: "https://example.com/logo.png",
        website: "https://example.com",
        about: "A test company",
      };

      expect(() => companySchema.parse(validData)).not.toThrow();
    });

    it("should reject invalid company data", () => {
      const invalidData = {
        name: "", // Empty name
        location: "SF",
      };

      expect(() => companySchema.parse(invalidData)).toThrow();
    });
  });

  describe("jobSchema", () => {
    it("should validate valid job data", () => {
      const validData = {
        jobTitle: "Software Engineer",
        employmentType: "full-time",
        location: "Remote",
        salaryFrom: 50000,
        salaryTo: 100000,
        jobDescription: JSON.stringify({ content: "Job description" }),
        listingDuration: 30,
        benefits: ["health", "dental"],
      };

      expect(() => jobSchema.parse(validData)).not.toThrow();
    });

    it("should reject invalid job data", () => {
      const invalidData = {
        jobTitle: "", // Empty title
        salaryFrom: 100000,
        salaryTo: 50000, // To < From
      };

      expect(() => jobSchema.parse(invalidData)).toThrow();
    });
  });

  describe("applicationSchema", () => {
    it("should validate valid application data", () => {
      const validData = {
        jobId: "test-job-id",
        name: "John Doe",
        email: "john@example.com",
        resume: "https://example.com/resume.pdf",
        coverLetter: "Optional cover letter",
      };

      expect(() => applicationSchema.parse(validData)).not.toThrow();
    });

    it("should reject invalid email", () => {
      const invalidData = {
        jobId: "test-job-id",
        name: "John Doe",
        email: "invalid-email",
        resume: "https://example.com/resume.pdf",
      };

      expect(() => applicationSchema.parse(invalidData)).toThrow();
    });
  });
});

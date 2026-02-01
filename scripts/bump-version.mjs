#!/usr/bin/env node
/**
 * Bump package.json version based on the last commit message (Conventional Commits).
 * Used by post-commit hook so every commit updates the version.
 *
 * Rules (semver):
 * - BREAKING CHANGE or type! (e.g. feat!:) -> major
 * - feat -> minor
 * - fix, perf, refactor, style, chore, build, ci, test -> patch
 * - docs, chore(release) -> no bump
 */

import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const pkgPath = join(root, "package.json");

function getLastCommitMessage() {
  try {
    return execSync("git log -1 --pretty=%B", { encoding: "utf-8", cwd: root });
  } catch {
    return "";
  }
}

function parseBumpType(message) {
  if (!message || typeof message !== "string") return null;
  const firstLine = message.split("\n")[0].trim();
  // Match: type(scope): or type: or type!: or type(scope)!:
  const match = firstLine.match(/^(\w+)(?:\([^)]+\))?(!?)\s*:/);
  if (!match) return null;
  const [, type, breaking] = match;
  const lowerType = type.toLowerCase();

  // Don't bump on version-bump commits (avoid loop)
  if (lowerType === "chore" && firstLine.includes("chore(release):")) return null;
  // Don't bump on docs-only (optional: use "patch" to bump)
  if (lowerType === "docs") return null;

  if (breaking === "!" || message.includes("BREAKING CHANGE")) return "major";
  if (lowerType === "feat") return "minor";
  if (["fix", "perf", "refactor", "style", "chore", "build", "ci", "test"].includes(lowerType)) return "patch";
  return "patch";
}

function parseVersion(version) {
  const parts = version.replace(/^v/, "").split(".").map(Number);
  return { major: parts[0] || 0, minor: parts[1] || 0, patch: parts[2] || 0 };
}

function formatVersion({ major, minor, patch }) {
  return `${major}.${minor}.${patch}`;
}

function bump(version, type) {
  const v = parseVersion(version);
  if (type === "major") {
    v.major += 1;
    v.minor = 0;
    v.patch = 0;
  } else if (type === "minor") {
    v.minor += 1;
    v.patch = 0;
  } else if (type === "patch") {
    v.patch += 1;
  }
  return formatVersion(v);
}

function main() {
  const message = getLastCommitMessage();
  const bumpType = parseBumpType(message);
  if (!bumpType) {
    process.exit(0);
    return;
  }

  const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
  const current = pkg.version || "0.0.0";
  const nextVersion = bump(current, bumpType);
  if (nextVersion === current) {
    process.exit(0);
    return;
  }

  pkg.version = nextVersion;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n", "utf-8");
  console.log(nextVersion);
}

main();

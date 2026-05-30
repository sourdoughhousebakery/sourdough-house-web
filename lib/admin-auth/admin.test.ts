import { describe, expect, it } from "vitest";
import { getAdminEmails, isAdminEmailAllowed } from "./admin";

describe("admin auth rules", () => {
  it("normalizes comma-separated admin emails", () => {
    expect(getAdminEmails(" Owner@Example.com, helper@example.com ,, ")).toEqual(["owner@example.com", "helper@example.com"]);
  });

  it("allows configured admin emails case-insensitively", () => {
    expect(isAdminEmailAllowed("OWNER@example.com", "owner@example.com")).toBe(true);
    expect(isAdminEmailAllowed("guest@example.com", "owner@example.com")).toBe(false);
  });

  it("can allow any authenticated email when no allow-list is configured outside production", () => {
    expect(isAdminEmailAllowed("owner@example.com", "", true)).toBe(true);
    expect(isAdminEmailAllowed(undefined, "", true)).toBe(false);
  });

  it("denies authenticated email when production has no allow-list", () => {
    expect(isAdminEmailAllowed("owner@example.com", "", false)).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import { ContactSchema } from "@/domain/contact.schema";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "I would like to talk about a graduate role.",
  website: "",
  turnstileToken: "token",
};

describe("ContactSchema", () => {
  it("accepts a valid submission and trims whitespace", () => {
    const result = ContactSchema.parse({ ...valid, name: "  Ada  " });
    expect(result.name).toBe("Ada");
  });

  it.each([
    ["name too short", { name: "A" }],
    ["name too long", { name: "x".repeat(81) }],
    ["invalid email", { email: "not-an-email" }],
    ["message too short", { message: "short" }],
    ["message too long", { message: "x".repeat(2001) }],
    ["honeypot filled", { website: "http://spam" }],
    ["missing token", { turnstileToken: "" }],
  ])("rejects %s", (_label, override) => {
    expect(ContactSchema.safeParse({ ...valid, ...override }).success).toBe(
      false,
    );
  });
});

import { z } from "zod";

// PRD §7.1. Shared by the form and the route handler so both agree on the rules.
export const ContactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email().max(254),
  message: z.string().trim().min(20).max(2000),
  website: z.literal(""),
  turnstileToken: z.string().min(1),
});

export type ContactInput = z.infer<typeof ContactSchema>;

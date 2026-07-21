import { z } from "zod";

/** Shared by the server action and the client-side field validation. */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name.")
    .max(100, "Name must be under 100 characters."),
  email: z.email("Please enter a valid email address."),
  message: z
    .string()
    .trim()
    .min(1, "Please write a message.")
    .max(5000, "Message must be under 5,000 characters."),
});

export type ContactFields = z.infer<typeof contactSchema>;
export type ContactFieldName = keyof ContactFields;

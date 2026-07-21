"use server";

import { headers } from "next/headers";
import { after } from "next/server";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import { AckEmail } from "@/emails/ack-email";
import { ContactEmail } from "@/emails/contact-email";
import { site } from "@/data/site";
import { contactSchema, type ContactFieldName } from "./contact-schema";
import { checkRateLimit } from "./rate-limit";

export interface ContactFormState {
  status: "idle" | "success" | "error";
  /** Form-level error shown above the submit button. */
  message?: string;
  fieldErrors?: Partial<Record<ContactFieldName, string>>;
}

export async function sendContactMessage(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Honeypot: real users never see this field. Pretend success so bots move on.
  if (formData.get("company")) {
    return { status: "success" };
  }

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return {
      status: "error",
      message: "Too many messages in a short time - please try again in a few minutes.",
    };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const fieldErrors: Partial<Record<ContactFieldName, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (typeof field === "string" && !(field in fieldErrors)) {
        fieldErrors[field as ContactFieldName] = issue.message;
      }
    }
    return { status: "error", fieldErrors };
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.CONTACT_TO_EMAIL || gmailUser;
  if (!gmailUser || !gmailAppPassword || !to) {
    return {
      status: "error",
      message: "The contact form isn't configured yet - please use the email link instead.",
    };
  }

  const { name, email, message } = parsed.data;

  // The UI should confirm within ~1s, not wait on Gmail's SMTP round-trip (which can take
  // several seconds for two emails). Validation above is synchronous and fast; the actual
  // sends run after the response goes out, via Next's after() - errors here are logged
  // server-side rather than surfaced, since the visitor already saw "message sent".
  after(async () => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailAppPassword },
    });

    try {
      await transporter.sendMail({
        from: `"${site.name}" <${gmailUser}>`,
        to,
        replyTo: email,
        subject: `New message from ${name} - Portfolio contact form`,
        html: await render(ContactEmail({ name, email, message })),
      });
    } catch (error) {
      console.error("Gmail send error (notification):", error);
    }

    try {
      await transporter.sendMail({
        from: `"${site.name}" <${gmailUser}>`,
        to: email,
        subject: `Thanks for reaching out, ${name}!`,
        html: await render(AckEmail({ name, message })),
      });
    } catch (error) {
      console.error("Gmail send error (acknowledgement):", error);
    }
  });

  return { status: "success" };
}

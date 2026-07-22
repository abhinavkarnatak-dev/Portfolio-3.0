"use client";

import { useActionState, useState } from "react";
import { sendContactMessage, type ContactFormState } from "@/lib/actions";
import { contactSchema, type ContactFieldName } from "@/lib/contact-schema";

const initialState: ContactFormState = { status: "idle" };

const inputClasses =
  "w-full border border-foreground/25 bg-surface px-3.5 py-3 text-foreground placeholder:text-faint transition-colors duration-200 focus:border-accent";

const labelClasses = "mb-2 block font-mono text-xs tracking-caps uppercase text-muted";

/** Validate a single field on blur with the same schema the server uses. */
function validateField(field: ContactFieldName, value: string): string | undefined {
  const result = contactSchema.shape[field].safeParse(value.trim());
  return result.success ? undefined : result.error.issues[0]?.message;
}

export function ContactForm() {
  // Remounting via key resets useActionState (and the uncontrolled inputs) back to
  // a blank form - simpler and effect-free compared to hand-rolling a reset action.
  const [instance, setInstance] = useState(0);
  return <ContactFormInstance key={instance} onSendAnother={() => setInstance((n) => n + 1)} />;
}

function ContactFormInstance({ onSendAnother }: { onSendAnother: () => void }) {
  const [state, formAction, isPending] = useActionState(sendContactMessage, initialState);
  const [clientErrors, setClientErrors] = useState<
    Partial<Record<ContactFieldName, string | undefined>>
  >({});
  // Only tracked to gate the submit button - the inputs stay uncontrolled.
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const allEmpty = Object.values(values).every((v) => v.trim() === "");

  if (state.status === "success") {
    return (
      <div
        className="border border-lime/60 bg-surface p-6 shadow-hard-sm shadow-lime"
        role="status"
      >
        <p className="font-mono font-semibold text-foreground uppercase">
          <span aria-hidden="true" className="text-lime">
            ✓
          </span>{" "}
          Message sent.
        </p>
        <p className="mt-2 text-sm text-muted">Thanks for reaching out - I&apos;ll reply soon.</p>
        <button
          type="button"
          onClick={onSendAnother}
          className="mt-4 inline-flex cursor-pointer items-center gap-2 font-mono text-xs tracking-caps text-muted uppercase transition-colors hover:text-foreground"
        >
          Send another message →
        </button>
      </div>
    );
  }

  const errorFor = (field: ContactFieldName) => clientErrors[field] ?? state.fieldErrors?.[field];

  const handleChange = (field: ContactFieldName) => (e: React.ChangeEvent<HTMLElement>) => {
    setValues((prev) => ({ ...prev, [field]: (e.target as HTMLInputElement).value }));
  };

  const handleBlur = (field: ContactFieldName) => (e: React.FocusEvent<HTMLElement>) => {
    const value = (e.target as HTMLInputElement | HTMLTextAreaElement).value;
    // Only surface errors on blur once the user has typed something.
    setClientErrors((prev) => ({
      ...prev,
      [field]: value ? validateField(field, value) : undefined,
    }));
  };

  // Full-schema check before the request ever goes out - a format issue (bad email,
  // too-short message, etc.) shows inline instead of round-tripping to the server
  // action just to learn what it would have said.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const parsed = contactSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    });
    if (!parsed.success) {
      e.preventDefault();
      const errors: Partial<Record<ContactFieldName, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !(field in errors)) {
          errors[field as ContactFieldName] = issue.message;
        }
      }
      setClientErrors(errors);
    }
  };

  const fieldProps = (field: ContactFieldName) => ({
    id: field,
    name: field,
    required: true,
    onChange: handleChange(field),
    onBlur: handleBlur(field),
    "aria-invalid": errorFor(field) ? true : undefined,
    "aria-describedby": errorFor(field) ? `${field}-error` : undefined,
  });

  const renderError = (field: ContactFieldName) => {
    const error = errorFor(field);
    return error ? (
      <p id={`${field}-error`} className="mt-1.5 text-sm text-red-400">
        {error}
      </p>
    ) : null;
  };

  return (
    <form action={formAction} noValidate className="space-y-5">
      {/* Honeypot — hidden from real users, tempting to bots. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClasses}>
            Name
          </label>
          <input
            {...fieldProps("name")}
            type="text"
            autoComplete="name"
            placeholder="Your name"
            className={inputClasses}
          />
          {renderError("name")}
        </div>
        <div>
          <label htmlFor="email" className={labelClasses}>
            Email
          </label>
          <input
            {...fieldProps("email")}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClasses}
          />
          {renderError("email")}
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClasses}>
          Message
        </label>
        <textarea
          {...fieldProps("message")}
          rows={5}
          placeholder="What are you building?"
          className={`${inputClasses} resize-y`}
        />
        {renderError("message")}
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="font-mono text-sm text-alarm">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex cursor-pointer items-center gap-2.5 bg-lime px-6 py-3 font-mono text-sm font-semibold tracking-wide text-background uppercase shadow-hard-sm shadow-foreground transition duration-200 ease-out-quint hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:translate-x-0 disabled:translate-y-0 disabled:opacity-60"
      >
        {isPending ? "Sending…" : "Send message →"}
      </button>
    </form>
  );
}

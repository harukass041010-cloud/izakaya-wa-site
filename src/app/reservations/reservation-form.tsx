"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { buttonClasses } from "@/components/button";
import type { ReservationCopy } from "@/lib/content";

/*
  Questions and general inquiries are delivered by Web3Forms, a free
  form-to-email service that works from a fully static site. Create an access
  key at https://web3forms.com and set it as NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
  (see `.env.example`). The key is public, so it is safe to inline at build time.

  Reservations are not taken here — they are handled by phone.
*/
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const inputClass =
  "w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-clay/60 focus:border-vermilion";

function Field({
  label,
  htmlFor,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-xs text-vermilion">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type Status = "idle" | "submitting" | "success" | "error";

export function ReservationForm({ copy }: { copy: ReservationCopy }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const get = (key: string) => String(formData.get(key) ?? "").trim();

    const values = {
      name: get("name"),
      email: get("email"),
      phone: get("phone"),
    };

    const nextErrors: Record<string, string> = {};
    if (!values.name) nextErrors.name = copy.errors.name;
    if (!values.phone) nextErrors.phone = copy.errors.phone;
    if (!emailPattern.test(values.email)) nextErrors.email = copy.errors.email;

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("error");
      setMessage(copy.validationMessage);
      return;
    }

    setErrors({});

    if (!ACCESS_KEY) {
      setStatus("error");
      setMessage(copy.missingKeyMessage);
      return;
    }

    setStatus("submitting");

    // Web3Forms reads these fields along with the form values.
    formData.set("access_key", ACCESS_KEY);
    formData.set("subject", `Website inquiry — ${values.name}`);
    formData.set("from_name", "Izakaya WA website");

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as { success?: boolean };

      if (response.ok && result.success) {
        setStatus("success");
        return;
      }

      setStatus("error");
      setMessage(copy.sendErrorMessage);
    } catch {
      setStatus("error");
      setMessage(copy.sendErrorMessage);
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col gap-3 rounded-2xl border border-shiso/30 bg-shiso/5 p-8"
      >
        <span className="font-display text-2xl text-shiso">
          {copy.successKanji}
        </span>
        <h3 className="text-xl">{copy.successTitle}</h3>
        <p className="text-sm leading-relaxed text-clay">
          {copy.successMessage}
        </p>
        <p className="text-sm leading-relaxed text-clay">{copy.successNote}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {status === "error" && message ? (
        <p
          role="alert"
          className="rounded-xl border border-vermilion/30 bg-vermilion/5 px-4 py-3 text-sm text-vermilion-dark"
        >
          {message}
        </p>
      ) : null}

      {/* Honeypot: real guests never see or check this. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={copy.labels.name} htmlFor="name" error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            className={inputClass}
            placeholder={copy.placeholders.name}
          />
        </Field>

        <Field label={copy.labels.phone} htmlFor="phone" error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            className={inputClass}
            placeholder={copy.placeholders.phone}
          />
        </Field>

        <Field
          label={copy.labels.email}
          htmlFor="email"
          error={errors.email}
          className="sm:col-span-2"
        >
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            className={inputClass}
            placeholder={copy.placeholders.email}
          />
        </Field>
      </div>

      <Field label={copy.labels.message} htmlFor="message">
        <textarea
          id="message"
          name="message"
          rows={5}
          className={cn(inputClass, "resize-y")}
          placeholder={copy.placeholders.message}
        />
      </Field>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs leading-relaxed text-clay">
          {copy.disclaimer}
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className={buttonClasses("primary", "lg")}
        >
          {status === "submitting" ? copy.submitting : copy.submit}
        </button>
      </div>
    </form>
  );
}

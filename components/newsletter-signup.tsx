"use client";

import { useState } from "react";

type NewsletterSignupProps = {
  buttonLabel: string;
  placeholder: string;
  successMessage: string;
};

export function NewsletterSignup({ buttonLabel, placeholder, successMessage }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "subscribed" | "exists" | "invalid" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        setStatus(response.status === 400 ? "invalid" : "error");
        return;
      }

      const result = (await response.json()) as { status: "subscribed" | "exists" };
      setStatus(result.status === "exists" ? "exists" : "subscribed");
      if (result.status === "subscribed") {
        setEmail("");
      }
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {status === "subscribed" ? <div className="status-note">{successMessage}</div> : null}
      {status === "exists" ? <div className="status-note">That email is already subscribed.</div> : null}
      {status === "invalid" ? <div className="status-note">Enter a valid email address.</div> : null}
      {status === "error" ? <div className="status-note">Subscription could not be completed right now.</div> : null}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={placeholder}
          required
        />
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          {buttonLabel}
        </button>
      </form>
    </>
  );
}

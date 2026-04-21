"use client";

import { useState } from "react";

export function ContactForm({ successMessage, title, eyebrow }: { successMessage: string; title: string; eyebrow: string }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        setStatus(result.error || "Your message could not be sent right now.");
        return;
      }

      setStatus(successMessage);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("Your message could not be sent right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="panel">
      <div className="eyebrow">{eyebrow}</div>
      <h3>{title}</h3>
      {status ? <div className="status-note" style={{ marginTop: 14 }}>{status}</div> : null}
      <form onSubmit={handleSubmit} className="editor-form" style={{ marginTop: 14 }}>
        <div className="input-row">
          <label>
            Name
            <input name="name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              required
            />
          </label>
        </div>
        <label>
          Subject
          <input
            name="subject"
            value={form.subject}
            onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
            required
          />
        </label>
        <label>
          Message
          <textarea
            name="message"
            value={form.message}
            onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
            required
            style={{ minHeight: 180 }}
          />
        </label>
        <button type="submit" className="primary-button" disabled={isSubmitting}>
          Send message
        </button>
      </form>
    </div>
  );
}

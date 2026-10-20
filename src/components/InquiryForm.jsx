"use client";

import { useEffect, useRef, useState } from "react";
import { validateInquiry, TOPICS } from "@/lib/validate";
import { Arrow, Check } from "./Icons";

const SLOTS = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
];

/**
 * One form, three jobs:
 *  - mode="general"  : contact page
 *  - mode="viewing"  : listing page (pass `listing`)
 *  - mode="compact"  : short version for the home-page call to action
 */
export default function InquiryForm({ mode = "general", listing, defaultTopic, id = "inquiry" }) {
  const initialTopic = mode === "viewing" ? "viewing" : TOPICS.some((t) => t.value === defaultTopic) ? defaultTopic : "rent";
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    topic: initialTopic,
    date: "",
    slot: "afternoon",
    format: "in-person",
    message: "",
    consent: false,
    company: "", // honeypot — real people never see or fill this
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [reference, setReference] = useState("");
  const [minDate, setMinDate] = useState("");
  const formRef = useRef(null);

  // Earliest bookable day = today, computed in the browser's local time.
  useEffect(() => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    setMinDate(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  }, []);

  const set = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((s) => ({ ...s, [k]: undefined }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    const { valid, errors: found } = validateInquiry(values);
    if (mode === "viewing" && !values.date) found.date = "Pick the day you’d like to visit.";
    if (!valid || found.date) {
      setErrors(found);
      const first = Object.keys(found)[0];
      formRef.current?.querySelector(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, listing: listing ? { slug: listing.slug, title: listing.title } : null }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setReference(data.reference);
        setStatus("sent");
      } else if (data.errors) {
        setErrors(data.errors);
        setStatus("idle");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="form-done" role="status" id={id}>
        <span className="form-done__icon"><Check /></span>
        <h3>{mode === "viewing" ? "Viewing request sent." : "Thank you — we’ve got it."}</h3>
        <p>
          An agent will reply to <strong>{values.email}</strong> shortly
          {mode === "viewing" && values.date ? ` to confirm your visit on ${values.date}` : ""}.
        </p>
        <p className="form-done__ref">Reference {reference}</p>
        <button
          type="button"
          className="btn btn--ink"
          onClick={() => {
            setStatus("idle");
            setValues((s) => ({ ...s, message: "", consent: false }));
          }}
        >
          <span>Send another</span>
        </button>
      </div>
    );
  }

  const field = (name, label, props = {}) => (
    <div className={`field ${errors[name] ? "has-error" : ""} ${props.wide ? "field--wide" : ""}`}>
      <label htmlFor={`${id}-${name}`}>{label}</label>
      <input
        id={`${id}-${name}`}
        name={name}
        value={values[name]}
        onChange={set(name)}
        aria-invalid={errors[name] ? "true" : undefined}
        aria-describedby={errors[name] ? `${id}-${name}-err` : undefined}
        {...props.input}
      />
      {errors[name] && <p className="field__err" id={`${id}-${name}-err`}>{errors[name]}</p>}
    </div>
  );

  return (
    <form ref={formRef} className={`form form--${mode}`} onSubmit={onSubmit} noValidate id={id}>
      {mode === "viewing" && listing && (
        <p className="form__context">
          Viewing: <strong>{listing.title}</strong>
        </p>
      )}

      <div className="form__grid">
        {field("name", "Full name", { input: { autoComplete: "name", required: true } })}
        {field("email", "Email", { input: { type: "email", autoComplete: "email", required: true } })}
        {mode !== "compact" && field("phone", "Phone (optional)", { input: { type: "tel", autoComplete: "tel" } })}

        {mode === "general" && (
          <div className="field">
            <label htmlFor={`${id}-topic`}>How can we help?</label>
            <select id={`${id}-topic`} name="topic" value={values.topic} onChange={set("topic")}>
              {TOPICS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        )}

        {mode === "viewing" && (
          <>
            {field("date", "Preferred day", { input: { type: "date", min: minDate || undefined, required: true } })}
            <fieldset className="field field--wide seg">
              <legend>Time of day</legend>
              <div className="seg__row">
                {SLOTS.map((s) => (
                  <label key={s.value} className={values.slot === s.value ? "is-on" : ""}>
                    <input type="radio" name="slot" value={s.value} checked={values.slot === s.value} onChange={set("slot")} />
                    {s.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="field field--wide seg">
              <legend>Format</legend>
              <div className="seg__row">
                {[["in-person", "In person"], ["video", "Video call"]].map(([v, l]) => (
                  <label key={v} className={values.format === v ? "is-on" : ""}>
                    <input type="radio" name="format" value={v} checked={values.format === v} onChange={set("format")} />
                    {l}
                  </label>
                ))}
              </div>
            </fieldset>
          </>
        )}

        <div className={`field field--wide ${errors.message ? "has-error" : ""}`}>
          <label htmlFor={`${id}-message`}>
            {mode === "compact" ? "What are you looking for?" : "Message (optional)"}
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={mode === "compact" ? 3 : 4}
            value={values.message}
            onChange={set("message")}
            aria-invalid={errors.message ? "true" : undefined}
            aria-describedby={errors.message ? `${id}-message-err` : undefined}
            placeholder={mode === "compact" ? "Area, budget, move-in date…" : undefined}
          />
          {errors.message && <p className="field__err" id={`${id}-message-err`}>{errors.message}</p>}
        </div>

        {/* Honeypot: hidden from people and assistive tech. */}
        <div className="hp" aria-hidden="true">
          <label>
            Company
            <input name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={set("company")} />
          </label>
        </div>
      </div>

      <div className={`consent ${errors.consent ? "has-error" : ""}`}>
        <label>
          <input
            type="checkbox"
            name="consent"
            checked={values.consent}
            onChange={set("consent")}
            aria-invalid={errors.consent ? "true" : undefined}
            aria-describedby={errors.consent ? `${id}-consent-err` : undefined}
          />
          <span>I agree to be contacted about this request and that my details are stored to handle it.</span>
        </label>
        {errors.consent && <p className="field__err" id={`${id}-consent-err`}>{errors.consent}</p>}
      </div>

      {status === "error" && (
        <p className="form__error" role="alert">
          Something went wrong sending that. Please try again, or call us instead.
        </p>
      )}

      <button type="submit" className="btn btn--clay form__submit" disabled={status === "sending"}>
        <span>{status === "sending" ? "Sending…" : mode === "viewing" ? "Request viewing" : "Send message"}</span>
        <Arrow />
      </button>
    </form>
  );
}

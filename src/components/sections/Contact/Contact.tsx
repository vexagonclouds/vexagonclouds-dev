"use client";

import { useRef, type FormEvent } from "react";
import s from "./Contact.module.css";
import c from "@/data/en/contact.json";
import { useContact } from "@/lib/animations/useContact";

// Endpoint + token come from build-time env (NEXT_PUBLIC_* are inlined). When the
// Sheets endpoint is set the form POSTs submissions to a Google Apps Script web
// app (see CONTACT-SHEETS-SETUP.md); otherwise it falls back to the mailto so the
// form still works before the endpoint is configured.
const SHEETS_ENDPOINT = process.env.NEXT_PUBLIC_SHEETS_ENDPOINT ?? "";
const SHEETS_TOKEN = process.env.NEXT_PUBLIC_SHEETS_TOKEN ?? "";

// Contact — net-new section carrying Website B's contact form. Submissions go to a
// Google Sheet via an Apps Script web app (no server); if NEXT_PUBLIC_SHEETS_ENDPOINT
// is unset it falls back to a mailto to info@vexagonclouds.com. Light band so it flows
// from the Closing CTA above it; id="contact" is the Method link + Closing CTA target.
export function Contact() {
  const root = useRef<HTMLElement>(null);
  useContact(root, s);

  const sendMailto = (
    name: string,
    email: string,
    company: string,
    interest: string,
    message: string,
  ) => {
    const body = `Name: ${name}\nEmail: ${email}\nCompany: ${company}\nInterest: ${interest}\n\n${message}`;
    window.location.href = `mailto:${c.email}?subject=${encodeURIComponent(
      `Project enquiry — ${name}`,
    )}&body=${encodeURIComponent(body)}`;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const get = (k: string) => (fd.get(k)?.toString() ?? "").trim();
    const name = get("name");
    const email = get("email");
    const company = get("company");
    const interest = get("interest");
    const message = get("message");
    const honeypot = get("_hp");
    const status = form.querySelector<HTMLParagraphElement>(`.${s.status}`);
    const submitBtn = form.querySelector<HTMLButtonElement>(`.${s.submit}`);

    if (!name || !email || !message) {
      if (status) status.textContent = c.status.error;
      return;
    }

    // No endpoint configured yet → keep the original mailto behavior.
    if (!SHEETS_ENDPOINT) {
      if (status) status.textContent = c.status.sending;
      sendMailto(name, email, company, interest, message);
      return;
    }

    if (status) status.textContent = c.status.sending;
    if (submitBtn) submitBtn.disabled = true;
    try {
      // form-urlencoded keeps this a "simple" request (no CORS preflight);
      // no-cors is required for the Apps Script web app, so the response is
      // opaque — we optimistically confirm once the request is sent.
      await fetch(SHEETS_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        body: new URLSearchParams({
          name,
          email,
          company,
          interest,
          message,
          token: SHEETS_TOKEN,
          _hp: honeypot,
        }),
      });
      if (status) status.textContent = c.status.success;
      form.reset();
    } catch {
      if (status) status.textContent = c.status.network;
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  };

  return (
    <section
      className={s.contact}
      id="contact"
      aria-label="Contact"
      data-nav-theme="light"
      ref={root}
    >
      <div className={s.inner}>
        <span className={s.kicker}>{c.kicker}</span>

        <form className={s.form} onSubmit={onSubmit} noValidate>
          {/* Honeypot: hidden from users, bots tend to fill it → script drops the row. */}
          <input
            type="text"
            name="_hp"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-9999px",
              width: "1px",
              height: "1px",
              opacity: 0,
            }}
          />
          <div className={s.row}>
            <label className={s.field}>
              <span className={s.label}>{c.fields.name}</span>
              <input className={s.input} type="text" name="name" autoComplete="name" required />
            </label>
            <label className={s.field}>
              <span className={s.label}>{c.fields.email}</span>
              <input className={s.input} type="email" name="email" autoComplete="email" required />
            </label>
          </div>

          <div className={s.row}>
            <label className={s.field}>
              <span className={s.label}>{c.fields.company}</span>
              <input className={s.input} type="text" name="company" autoComplete="organization" />
            </label>
            <label className={s.field}>
              <span className={s.label}>{c.fields.interest}</span>
              <select className={s.input} name="interest" defaultValue="">
                <option value="" disabled>
                  {c.interestPlaceholder}
                </option>
                {c.interestOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className={`${s.field} ${s.full}`}>
            <span className={s.label}>{c.fields.message}</span>
            <textarea
              className={s.input}
              name="message"
              rows={5}
              required
              placeholder={c.messagePlaceholder}
            />
          </label>

          <div className={s.actions}>
            <button type="submit" className={s.submit}>
              {c.submit}
            </button>
            <a className={s.direct} href={`mailto:${c.email}`}>
              {c.emailDirect}
            </a>
          </div>

          <p className={s.status} role="status" aria-live="polite" />
        </form>
      </div>
    </section>
  );
}

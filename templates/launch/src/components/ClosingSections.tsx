"use client";

import type { FormEvent } from "react";
import { siteContent } from "@/content/site";

export function ClosingSections() {
  const { faq, waitlist, footer } = siteContent;

  const openEmailRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const body = `Please add ${email} to the Launch early-access list.`;
    window.location.href = `mailto:${waitlist.mailto}?subject=${encodeURIComponent(waitlist.mailSubject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      <section className="faq section-pad" id="faq">
        <div className="section-heading split-heading">
          <p className="eyebrow">{faq.eyebrow}</p>
          <h2>{faq.title}</h2>
        </div>
        <div className="faq-list">
          {faq.items.map((item, index) => (
            <details key={item.question} open={index === 0}>
              <summary>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.question}
                <b aria-hidden="true">+</b>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="waitlist section-pad" id="waitlist">
        <div>
          <p className="eyebrow">{waitlist.eyebrow}</p>
          <h2>{waitlist.title}</h2>
        </div>
        <div className="waitlist-form-wrap">
          <p>{waitlist.body}</p>
          <form onSubmit={openEmailRequest}>
            <label htmlFor="waitlist-email">{waitlist.emailLabel}</label>
            <div className="input-row">
              <input
                id="waitlist-email"
                name="email"
                type="email"
                placeholder={waitlist.emailPlaceholder}
                required
                autoComplete="email"
              />
              <button className="button button-orange" type="submit">
                {waitlist.submitLabel}
              </button>
            </div>
          </form>
          <small>{waitlist.note}</small>
        </div>
      </section>

      <footer>
        <div className="footer-brand">
          <strong>{siteContent.brand}</strong>
          <span>{footer.line}</span>
        </div>
        <div className="footer-links">
          {footer.links.map((link) => (
            <a key={link.label} href={link.href}>{link.label}</a>
          ))}
        </div>
        <p>{footer.copyright}</p>
      </footer>
    </>
  );
}

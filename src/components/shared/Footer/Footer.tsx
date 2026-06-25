"use client";

import { useRef, useState, type FormEvent, type ReactNode } from "react";
import s from "./Footer.module.css";
import footer from "@/data/en/footer.json";
import { PpMark } from "@/components/shared/PpMark";
import { useFooter } from "@/lib/animations/useFooter";

// Brand social glyphs (VexagonClouds footer). Inlined so they tint via
// currentColor; viewBox 0 0 24 24, fill currentColor.
const SOCIAL: Record<string, ReactNode> = {
  LinkedIn: (
    <path d="M19 0h-14C2.2 0 0 2.2 0 5v14c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5V5c0-2.8-2.2-5-5-5zM8 19H5V8h3v11zM6.5 6.7c-1 0-1.7-.7-1.7-1.7s.7-1.7 1.8-1.7 1.7.7 1.7 1.7-.7 1.7-1.8 1.7zM20 19h-3v-5.6c0-1.5-.9-1.8-1.2-1.8s-1.4.2-1.4 1.8c0 .2 0 5.6 0 5.6h-3V8h3v1.5c.4-.7 1.2-1.5 3-1.5s2.6 1.4 2.6 3.3V19z" />
  ),
  Twitter: (
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  ),
  GitHub: (
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.05-.02-2.06-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.22.7.83.58C20.56 21.8 24 17.31 24 12c0-6.63-5.37-12-12-12z" />
  ),
};

export function Footer() {
  const root = useRef<HTMLElement>(null);
  useFooter(root, s);
  const [subscribed, setSubscribed] = useState(false);

  const { links, contact, newsletter } = footer.columns;

  const onSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubscribed(true);
  };

  return (
    <footer className={s.footer} data-nav-theme="blue" ref={root}>
      <div className={s.grain} aria-hidden="true" />
      <div className={`${s.cloud} ${s.cloudTop}`} aria-hidden="true">
        <img src="/images/clouds.webp" alt="" />
      </div>
      <div className={`${s.cloud} ${s.cloudLeft}`} aria-hidden="true">
        <img src="/images/clouds.webp" alt="" />
      </div>

      <div className={s.content}>
        <div className={s.grid}>
          {/* Brand + about */}
          <div className={`${s.col} ${s.colBrand}`}>
            <div className={s.mark} aria-hidden="true">
              <PpMark className={s.markSvg} />
            </div>
            <p className={s.about}>{footer.brand.about}</p>
          </div>

          {/* Quick links */}
          <nav className={s.col} aria-label={links.heading}>
            <h4 className={s.heading}>{links.heading}</h4>
            <ul className={s.list}>
              {links.items.map((item) => (
                <li key={item.label}>
                  <a className={s.link} href={item.href}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div className={s.col}>
            <h4 className={s.heading}>{contact.heading}</h4>
            <p className={s.contactItem}>{contact.address}</p>
            {contact.emails.map((email) => (
              <a key={email} className={`${s.link} ${s.contactItem}`} href={`mailto:${email}`}>
                {email}
              </a>
            ))}
            <div className={s.social}>
              {contact.social.map((soc) => (
                <a
                  key={soc.label}
                  className={s.socialLink}
                  href={soc.href}
                  aria-label={soc.label}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    {SOCIAL[soc.label]}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className={s.col}>
            <h4 className={s.heading}>{newsletter.heading}</h4>
            <p className={s.about}>{newsletter.text}</p>
            <form className={s.newsletter} onSubmit={onSubscribe}>
              <input
                className={s.newsInput}
                type="email"
                placeholder={newsletter.placeholder}
                aria-label={newsletter.placeholder}
                required
              />
              <button className={s.subscribe} type="submit">
                {subscribed ? newsletter.done : newsletter.submit}
              </button>
            </form>
          </div>
        </div>

        <div className={s.bar}>
          <p className={s.legal}>{footer.legal}</p>
          <div className={s.legalLinks}>
            {footer.legalLinks.map((l) => (
              <a key={l.label} className={s.link} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

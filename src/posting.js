/** Pure helpers for rendering a job posting (tested in tests/unit). */

// Posting text uses list punctuation ("…," / "….") — bullets read cleaner without it.
export const bullet = (text) => text.replace(/[,.]$/, "");

/** mailto link for an application, with the subject prefilled. */
export const applyHref = (apply) => `mailto:${apply.email}?subject=${encodeURIComponent(apply.subject)}`;

export const pad = (number) => String(number).padStart(2, "0");

/**
 * Ways to send an application. A bare mailto only works when the visitor has a desktop mail app,
 * so webmail compose pages come first (recipient and subject prefilled).
 */
export const applyOptions = (apply) => [
  {
    id: "gmail",
    label: "Gmail ile yaz",
    href: `https://mail.google.com/mail/?${new URLSearchParams({ view: "cm", fs: "1", to: apply.email, su: apply.subject })}`,
  },
  {
    id: "outlook",
    label: "Outlook ile yaz",
    href: `https://outlook.live.com/mail/0/deeplink/compose?${new URLSearchParams({ to: apply.email, subject: apply.subject })}`,
  },
  { id: "app", label: "Mail uygulamasıyla aç", href: applyHref(apply) },
];

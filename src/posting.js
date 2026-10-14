/** Pure helpers for rendering a job posting (tested in tests/unit). */

// Posting text uses list punctuation ("…," / "….") — bullets read cleaner without it.
export const bullet = (text) => text.replace(/[,.]$/, "");

/** mailto link for an application, with the subject prefilled. */
export const applyHref = (apply) => `mailto:${apply.email}?subject=${encodeURIComponent(apply.subject)}`;

export const pad = (number) => String(number).padStart(2, "0");

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, Copy, ExternalLink, Mail } from "lucide-react";
import { applyOptions } from "./posting";

const copyResetMs = 2500;

/**
 * "Başvur" button that opens a small menu: Gmail / Outlook compose pages, the visitor's mail app
 * and copying the address. A plain mailto opened an empty mail-app setup for visitors without one.
 */
export function ApplyMenu({ apply, label, align = "start", className = "" }) {
  const [open, setOpen] = useState(false);
  const [copy, setCopy] = useState("idle");
  const root = useRef(null);
  const toggle = useRef(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    const onPointer = (event) => { if (!root.current?.contains(event.target)) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  useEffect(() => {
    if (copy === "idle") return undefined;
    const id = window.setTimeout(() => setCopy("idle"), copyResetMs);
    return () => window.clearTimeout(id);
  }, [copy]);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(apply.email);
      setCopy("done");
    } catch {
      setCopy("failed");
    }
  }

  return (
    <div ref={root} className={`apply-menu is-${align} ${className}`.trim()}>
      <button ref={toggle} type="button" className="button" aria-expanded={open} aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}>
        {label} <ChevronDown size={15} aria-hidden="true" className="apply-menu-chevron" />
      </button>
      <div id={panelId} className="apply-menu-panel" hidden={!open}>
        <p className="apply-menu-address">{apply.email}</p>
        <ul>
          {applyOptions(apply).map((option) => (
            <li key={option.id}>
              <a href={option.href} {...(option.id === "app" ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                onClick={() => setOpen(false)}>
                {option.id === "app" ? <Mail size={15} aria-hidden="true" /> : <ExternalLink size={15} aria-hidden="true" />}
                {option.label}
              </a>
            </li>
          ))}
          <li>
            <button type="button" onClick={copyAddress}>
              {copy === "done" ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
              Adresi kopyala
            </button>
          </li>
        </ul>
        <p className="apply-menu-status" role="status">
          {copy === "done" && "Adres kopyalandı."}
          {copy === "failed" && "Kopyalanamadı; adresi yukarıdan seçip kopyalayın."}
        </p>
      </div>
    </div>
  );
}

"use client";

import { Check, Copy, Mail } from "lucide-react";
import { useState } from "react";
import { buttonClass } from "@/components/ui/button";

type CopyStatus = "idle" | "copied" | "failed";

export function ContactActions({
  email,
  mailHref,
  labels
}: {
  email: string;
  mailHref: string;
  labels: {
    openEmail: string;
    copyEmail: string;
    copied: string;
    copyFailed: string;
  };
}) {
  const [status, setStatus] = useState<CopyStatus>("idle");

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2200);
    } catch {
      setStatus("failed");
      window.setTimeout(() => setStatus("idle"), 2600);
    }
  };

  const copyLabel =
    status === "copied"
      ? labels.copied
      : status === "failed"
        ? labels.copyFailed
        : labels.copyEmail;

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <a href={mailHref} className={buttonClass("primary", "min-h-11")}>
        <Mail className="h-4 w-4" />
        {labels.openEmail}
      </a>
      <button
        type="button"
        onClick={copyEmail}
        className={buttonClass("secondary", "min-h-11")}
        aria-live="polite"
      >
        {status === "copied" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        {copyLabel}
      </button>
    </div>
  );
}

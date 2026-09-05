import { Bell } from "lucide-react";

export function DropAlertsLink({ href }: { href: string | null }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-rust underline decoration-rust/30 underline-offset-4 transition hover:text-espresso focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rust">
      <Bell aria-hidden size={16} className="shrink-0" />
      Get notified about the next bake
    </a>
  );
}

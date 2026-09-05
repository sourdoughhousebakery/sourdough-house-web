import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import { ButtonLink } from "./button-link";
import { DropAlertsLink } from "./drop-alerts-link";
import type { DropScheduleSummary } from "@/lib/hotplate/schedule";

export function DropOrderCallout({ hotplateUrl, alertsUrl, schedule }: { hotplateUrl: string; alertsUrl: string | null; schedule: DropScheduleSummary }) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-espresso/10 pb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="max-w-xl">
        {schedule.pickup ? (
          <p className="flex items-start gap-2 text-sm font-semibold leading-6 text-espresso/85">
            <CalendarDays aria-hidden size={16} className="mt-1 shrink-0" />
            {schedule.pickup}
          </p>
        ) : null}
        {schedule.deadline ? (
          <p className="mt-1 flex items-start gap-2 text-sm font-semibold leading-6 text-espresso/75">
            <Clock aria-hidden size={16} className="mt-1 shrink-0" />
            {schedule.deadline}
          </p>
        ) : null}
        {!schedule.pickup && !schedule.deadline ? <p className="text-sm font-semibold leading-6 text-espresso/75">
          Choose your items and pickup on Hotplate.
        </p> : null}
        <p className="mt-1 text-xs leading-5 text-espresso/60">
          Counts update periodically. Availability is confirmed at checkout.
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-center gap-1">
        <ButtonLink href={hotplateUrl} external className="gap-2 max-sm:w-full">
          Shop this drop on Hotplate
          <ArrowUpRight aria-hidden size={18} />
        </ButtonLink>
        <DropAlertsLink href={alertsUrl} />
      </div>
    </div>
  );
}

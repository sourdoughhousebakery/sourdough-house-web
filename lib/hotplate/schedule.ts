export type PickupWindow = { startAt: number; endAt: number; timeZone: string };
export type HotplateSchedule = {
  pickupWindows: PickupWindow[];
  orderClosesAt: number | null;
  orderTimeZone: string | null;
};
export type DropScheduleSummary = { pickup: string | null; deadline: string | null };

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function timestamp(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : typeof value === "string" && value.trim() ? Date.parse(value) : NaN;
  return Number.isFinite(parsed) && Number.isFinite(new Date(parsed).getTime()) ? parsed : null;
}

function timeZone(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format(0);
    return value;
  } catch {
    return null;
  }
}

export function parseHotplateSchedule(detail: unknown): HotplateSchedule {
  const source = record(detail);
  const windows = Object.values(record(source.timeWindows)).flatMap((raw) => {
    const window = record(raw);
    const startAt = timestamp(window.startTime);
    const endAt = timestamp(window.endTime);
    const zone = timeZone(window.timeZone);
    if (startAt === null || endAt === null || endAt <= startAt || !zone) return [];
    return [{startAt, endAt, timeZone: zone, isDelivery: window.isDelivery}];
  });
  const zones = [...new Set(windows.map(window => window.timeZone))];
  const pickupWindows = source.isPickupEnabled === true
    ? windows.filter(window => window.isDelivery === false).map(({ startAt, endAt, timeZone }) => ({startAt, endAt, timeZone}))
    : [];

  return {
    pickupWindows,
    orderClosesAt: source.orderCutoffType === "Specific Time" ? timestamp(source.orderCutoffTime) : null,
    orderTimeZone: zones.length === 1 ? zones[0] : null
  };
}

function dateLabel(stamp: number, zone: string) {
  return new Intl.DateTimeFormat("en-US", {timeZone:zone,weekday:"short",month:"short",day:"numeric"}).format(stamp);
}

function timeLabel(stamp: number, zone: string, showZone = false) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone:zone,hour:"numeric",minute:"2-digit",...(showZone ? {timeZoneName:"short" as const} : {})
  }).format(stamp);
}

export function summarizeHotplateSchedule(schedule: HotplateSchedule | null | undefined, now = Date.now()): DropScheduleSummary {
  if (!schedule) return {pickup:null,deadline:null};
  const windows = schedule.pickupWindows.filter(window => window.endAt > now).sort((a,b) => a.startAt - b.startAt);
  const first = windows[0];
  let pickup: string | null = null;
  if (first) {
    const day = dateLabel(first.startAt,first.timeZone);
    const endDay = dateLabel(first.endAt,first.timeZone);
    pickup = windows.length > 1
      ? `Pickup from ${day} · choose a window on Hotplate`
      : `Pickup ${day} · ${timeLabel(first.startAt,first.timeZone)}–${day !== endDay ? `${endDay}, ` : ""}${timeLabel(first.endAt,first.timeZone,true)}`;
  }
  const {orderClosesAt,orderTimeZone} = schedule;
  const deadline = orderClosesAt !== null && orderTimeZone
    ? `Orders ${orderClosesAt <= now ? "closed" : "close"} ${dateLabel(orderClosesAt,orderTimeZone)} · ${timeLabel(orderClosesAt,orderTimeZone,true)}`
    : null;
  return {pickup,deadline};
}

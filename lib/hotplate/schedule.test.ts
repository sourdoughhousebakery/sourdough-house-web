import { describe, expect, it } from "vitest";
import { parseHotplateSchedule, summarizeHotplateSchedule } from "./schedule";

const detail = {
  isPickupEnabled: true,
  orderCutoffType: "Specific Time",
  orderCutoffTime: 1789059600000,
  timeWindows: {
    porch: { startTime: 1789221600000, endTime: 1789232400000, isDelivery: false, timeZone: "America/Chicago" }
  }
};
const now = Date.parse("2026-09-05T17:00:00Z");

describe("Hotplate pickup and deadline summaries", () => {
  it("uses the verified pickup window and fixed cutoff in the pickup timezone", () => {
    expect(summarizeHotplateSchedule(parseHotplateSchedule(detail), now)).toEqual({
      pickup: "Pickup Sat, Sep 12 · 9:00 AM–12:00 PM CDT",
      deadline: "Orders close Thu, Sep 10 · 12:00 PM CDT"
    });
  });

  it("does not present a relative cutoff as one fixed deadline", () => {
    const schedule = parseHotplateSchedule({ ...detail, orderCutoffType: "Relative to pickup" });
    expect(summarizeHotplateSchedule(schedule, now).deadline).toBeNull();
  });

  it("does not invent missing dates or timezones", () => {
    for (const invalid of [null, {}, { ...detail, timeWindows: {} }, {
      ...detail, timeWindows: { porch: { ...detail.timeWindows.porch, timeZone: "invalid" } }
    }]) {
      expect(summarizeHotplateSchedule(parseHotplateSchedule(invalid), now)).toEqual({pickup:null, deadline:null});
    }
  });

  it("rejects missing, reversed, and invalid window timestamps", () => {
    for (const startTime of [null, undefined, "", "bad", 1789232400001]) {
      const schedule = parseHotplateSchedule({ ...detail, timeWindows: {porch:{...detail.timeWindows.porch,startTime}} });
      expect(summarizeHotplateSchedule(schedule, now).pickup).toBeNull();
    }
  });

  it("does not label delivery windows as pickup", () => {
    const schedule = parseHotplateSchedule({ ...detail, timeWindows: {delivery:{...detail.timeWindows.porch,isDelivery:true}} });
    expect(summarizeHotplateSchedule(schedule, now).pickup).toBeNull();
  });

  it("respects disabled pickup", () => {
    expect(summarizeHotplateSchedule(parseHotplateSchedule({...detail,isPickupEnabled:false}), now).pickup).toBeNull();
  });

  it("makes multiple pickup windows explicit", () => {
    const schedule = parseHotplateSchedule({...detail,timeWindows:{
      later: {...detail.timeWindows.porch,startTime:1789308000000,endTime:1789318800000},
      first: detail.timeWindows.porch
    }});
    expect(summarizeHotplateSchedule(schedule, now).pickup).toBe("Pickup from Sat, Sep 12 · choose a window on Hotplate");
  });

  it("marks a passed deadline closed and omits expired pickup windows", () => {
    expect(summarizeHotplateSchedule(parseHotplateSchedule(detail), Date.parse("2026-09-13T00:00:00Z"))).toEqual({
      pickup: null,
      deadline: "Orders closed Thu, Sep 10 · 12:00 PM CDT"
    });
  });

  it("uses standard time after daylight saving ends", () => {
    const schedule = parseHotplateSchedule({...detail,timeWindows:{winter:{...detail.timeWindows.porch,
      startTime:Date.parse("2026-12-12T15:00:00Z"),endTime:Date.parse("2026-12-12T18:00:00Z")
    }}});
    expect(summarizeHotplateSchedule(schedule, now).pickup).toBe("Pickup Sat, Dec 12 · 9:00 AM–12:00 PM CST");
  });
});

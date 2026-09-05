export function parseAvailableInventory(value: unknown): number | null {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && !value.trim()) return null;
  const count = Number(value);
  return Number.isFinite(count) ? Math.max(0, Math.floor(count)) : null;
}

export function formatInventoryLabel(available: number | null): string | undefined {
  if (available === null) return undefined;
  return available <= 0 ? "Sold out" : `${available} left`;
}

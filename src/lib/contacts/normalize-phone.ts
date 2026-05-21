export function normalizePhone(value?: string | null) {
  const digits = (value || "").replace(/\D/g, "");

  if (digits.length === 11 && digits.startsWith("1")) {
    return digits;
  }

  if (digits.length === 10) {
    return `1${digits}`;
  }

  return digits;
}

export function phoneMatchKeys(value?: string | null) {
  const normalized = normalizePhone(value);
  const keys = new Set<string>();

  if (normalized) {
    keys.add(normalized);
    keys.add(normalized.slice(-10));
  }

  return keys;
}

export function nowIso() {
  return new Date().toISOString();
}

export function formatDate(input: string) {
  try {
    return new Date(input).toLocaleString();
  } catch {
    return input;
  }
}

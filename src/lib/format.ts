// Whole euros with dot thousands separators, e.g. 42500 -> "€42.500".
export function formatEUR(n: number): string {
  const rounded = Math.round(n);
  const grouped = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `€${rounded < 0 ? "-" : ""}${grouped}`;
}

// Two decimals, comma decimal separator, e.g. 4.25 -> "€4,25".
export function formatEURPrecise(n: number): string {
  const [int, dec] = n.toFixed(2).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `€${grouped},${dec}`;
}

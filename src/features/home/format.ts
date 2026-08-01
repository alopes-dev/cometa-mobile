export function formatKwanza(value: number): string {
  const rounded = Math.round(value);
  const withSeparators = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${withSeparators} Kz`;
}

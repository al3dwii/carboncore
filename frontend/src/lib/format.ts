export const fmtUsd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});
export const fmtKg = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

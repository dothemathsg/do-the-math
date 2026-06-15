export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  years: number
) {
  const monthlyRate = annualRate / 100 / 12;
  const n = years * 12;

  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
    (Math.pow(1 + monthlyRate, n) - 1)
  );
}

export function calculateTotalPayment(monthly: number, years: number) {
  return monthly * years * 12;
}

export function calculateTotalInterest(principal: number, monthly: number, years: number) {
  return monthly * years * 12 - principal;
}

export function formatSGD(amount: number) {
  return new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    maximumFractionDigits: 0,
  }).format(amount);
}
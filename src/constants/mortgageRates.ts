export type MortgageRate = {
  bank: string;
  type: string;
  interestRate: number;
  lockIn: number;
  minLoan: number;
  notes?: string;
};

export const mortgageRates: MortgageRate[] = [
  {
    bank: "DBS",
    type: "Fixed 2Y",
    interestRate: 3.68,
    lockIn: 2,
    minLoan: 200000,
    notes: "Promo rate for new loans",
  },
  {
    bank: "OCBC",
    type: "Fixed 3Y",
    interestRate: 3.75,
    lockIn: 3,
    minLoan: 200000,
    notes: "Includes cashback option",
  },
  {
    bank: "UOB",
    type: "Floating (SORA)",
    interestRate: 3.55,
    lockIn: 2,
    minLoan: 250000,
    notes: "Tracks 3M SORA",
  },
  {
    bank: "Standard Chartered",
    type: "Fixed 2Y",
    interestRate: 3.60,
    lockIn: 2,
    minLoan: 300000,
    notes: "Online application discount",
  },
];
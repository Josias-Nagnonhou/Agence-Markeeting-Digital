export const PAGE_CREATION_PRICE = {
  STRIPE: { amount: 15, currency: "EUR" },
  KKIAPAY: { amount: 10000, currency: "XOF" },
} as const;

export const HOSTING_MONTHLY_PRICE = {
  STRIPE: { amount: 5, currency: "EUR" },
  KKIAPAY: { amount: 3000, currency: "XOF" },
} as const;

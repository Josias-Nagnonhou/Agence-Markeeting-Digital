const FEDAPAY_BASE_URL =
  process.env.FEDAPAY_ENV === "live"
    ? "https://api.fedapay.com/v1"
    : "https://sandbox-api.fedapay.com/v1";

export interface CreateFedaPayTransactionInput {
  amount: number;
  description: string;
  customerEmail?: string;
  customerPhone?: string;
  callbackUrl: string;
}

export async function createFedaPayTransaction(input: CreateFedaPayTransactionInput) {
  const secretKey = process.env.FEDAPAY_SECRET_KEY;

  if (!secretKey) {
    return {
      demo: true,
      paymentUrl: `${input.callbackUrl}?demo=1&provider=fedapay&amount=${input.amount}`,
    };
  }

  const response = await fetch(`${FEDAPAY_BASE_URL}/transactions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description: input.description,
      amount: input.amount,
      currency: { iso: "XOF" },
      callback_url: input.callbackUrl,
      customer: {
        email: input.customerEmail,
        phone_number: input.customerPhone
          ? { number: input.customerPhone, country: "bj" }
          : undefined,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`FedaPay a refusé la transaction (${response.status})`);
  }

  const data = await response.json();
  const transactionId = data?.["v1/transaction"]?.id ?? data?.id;

  const tokenResponse = await fetch(
    `${FEDAPAY_BASE_URL}/transactions/${transactionId}/token`,
    { headers: { Authorization: `Bearer ${secretKey}` } },
  );
  const tokenData = await tokenResponse.json();

  return {
    demo: false,
    paymentUrl: tokenData?.url as string,
  };
}

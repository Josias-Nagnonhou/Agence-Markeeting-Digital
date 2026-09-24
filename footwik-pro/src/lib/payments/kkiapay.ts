const KKIAPAY_BASE_URL = "https://api.kkiapay.me/api/v1";

export interface CreateKkiapayTransactionInput {
  amount: number;
  description: string;
  customerPhone?: string;
  callbackUrl: string;
}

export async function createKkiapayTransaction(input: CreateKkiapayTransactionInput) {
  const privateKey = process.env.KKIAPAY_PRIVATE_KEY;
  const publicKey = process.env.NEXT_PUBLIC_KKIAPAY_PUBLIC_KEY;

  if (!privateKey || !publicKey) {
    return {
      demo: true,
      paymentUrl: `${input.callbackUrl}?demo=1&provider=kkiapay&amount=${input.amount}`,
    };
  }

  const response = await fetch(`${KKIAPAY_BASE_URL}/transactions`, {
    method: "POST",
    headers: {
      "x-api-key": publicKey,
      Authorization: privateKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: input.amount,
      phone: input.customerPhone,
      description: input.description,
      callback_url: input.callbackUrl,
    }),
  });

  if (!response.ok) {
    throw new Error(`KkiaPay a refusé la transaction (${response.status})`);
  }

  const data = await response.json();

  return {
    demo: false,
    paymentUrl: data?.paymentUrl as string,
  };
}

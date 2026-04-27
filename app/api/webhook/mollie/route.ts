import { NextRequest, NextResponse } from "next/server";
import { getMollieClient } from "@/lib/mollie";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    let paymentId: string | null = null;

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const body = await req.text();
      paymentId = new URLSearchParams(body).get("id");
    } else {
      const body = (await req.json()) as { id?: string };
      paymentId = body.id ?? null;
    }

    if (paymentId) {
      const mollieClient = getMollieClient();
      const payment = await mollieClient.payments.get(paymentId);
      console.log("Mollie payment status:", payment.status);

      const metadata = payment.metadata as
        | { type?: string; recurringAmount?: string; customerId?: string }
        | undefined;
      const isRecurringFirstPayment = metadata?.type === "recurring-first-payment";

      if (payment.status === "paid" && isRecurringFirstPayment && payment.customerId) {
        const recurringAmount =
          typeof metadata?.recurringAmount === "string" && metadata.recurringAmount
            ? metadata.recurringAmount
            : payment.amount.value;

        await mollieClient.customerSubscriptions.create({
          customerId: payment.customerId,
          amount: {
            currency: "EUR",
            value: recurringAmount,
          },
          interval: "1 month",
          description: "Maandelijkse donatie Saved Souls Foundation",
        });
      }
    } else {
      console.log("Mollie webhook zonder payment id ontvangen");
    }
  } catch (error) {
    console.error("Mollie webhook fout:", error);
  }

  return new NextResponse("OK", { status: 200 });
}

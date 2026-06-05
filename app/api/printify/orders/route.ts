import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { capturePayPalOrder } from "@/lib/paypal";
import { createPrintifyOrder, sendPrintifyOrderToProduction } from "@/lib/printify";

const shippingSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  country: z.string().length(2),
  region: z.string().optional().default(""),
  address1: z.string().min(1),
  address2: z.string().optional().default(""),
  city: z.string().min(1),
  zip: z.string().min(1),
});

const bodySchema = z.object({
  paypal_order_id: z.string().min(1),
  line_items: z
    .array(
      z.object({
        product_id: z.string().min(1),
        variant_id: z.number().int().positive(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
  shipping_address: shippingSchema,
});

export async function POST(request: NextRequest) {
  try {
    let json: unknown;
    try {
      json = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { paypal_order_id, line_items, shipping_address } = parsed.data;

    const payment = await capturePayPalOrder(paypal_order_id);
    if (!payment.ok) {
      return NextResponse.json({ error: "PayPal payment not confirmed" }, { status: 402 });
    }

    const printifyOrder = await createPrintifyOrder({
      external_id: paypal_order_id,
      line_items,
      address_to: shipping_address,
    });

    if (printifyOrder.id) {
      try {
        await sendPrintifyOrderToProduction(printifyOrder.id);
      } catch (productionErr) {
        console.error("[printify/orders] send_to_production error:", productionErr);
      }
    }

    return NextResponse.json({
      printifyOrderId: printifyOrder.id,
      paypalCaptureId: payment.captureId,
    });
  } catch (err) {
    console.error("[printify/orders] POST error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

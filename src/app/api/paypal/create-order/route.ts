import { NextRequest, NextResponse } from "next/server";
import { generateAccessToken } from "@/lib/paypal";

const PAYPAL_API_URL = process.env.PAYPAL_ENV === "production"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

export async function POST(request: NextRequest) {
  try {
    const bodyText = await request.text();
    if (!bodyText) {
      return NextResponse.json({ error: "Empty request body" }, { status: 400 });
    }
    
    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (e) {
      console.error("JSON parse error on body:", bodyText);
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }
    
    const { amount, currency = "EUR", donorName = "Anonymous", donorEmail = "donor@example.com" } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid donation amount" },
        { status: 400 }
      );
    }

    const accessToken = await generateAccessToken();

    const orderPayload = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
          description: "Donation to Madagascar Turtle Conservation",
          custom_id: `donation_${Date.now()}`,
        },
      ],
      payer: {
        email_address: donorEmail,
        name: {
          given_name: donorName.split(" ")[0] || "Anonymous",
          surname: donorName.split(" ").slice(1).join(" ") || "Donor",
        },
      },
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: "Salamandra Nature",
            shipping_preference: "NO_SHIPPING",
            user_action: "PAY_NOW",
            return_url: "https://example.com/return",
            cancel_url: "https://example.com/cancel",
          },
        },
      },
    };

    const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `donation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetail;
      try {
        errorDetail = JSON.parse(errorText);
      } catch {
        errorDetail = errorText;
      }
      console.error("PayPal create order detailed error:", JSON.stringify(errorDetail, null, 2));
      
      return NextResponse.json(
        { 
          error: "Failed to create PayPal order", 
          details: errorDetail?.details?.[0]?.description || errorDetail?.message || "Check server logs for details"
        },
        { status: response.status }
      );
    }

    const order = await response.json();
    return NextResponse.json({ id: order.id, status: order.status });
  } catch (error) {
    console.error("PayPal create order error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

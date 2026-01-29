import { NextRequest, NextResponse } from "next/server";
import { generateAccessToken } from "@/lib/paypal";

const PAYPAL_API_URL = process.env.PAYPAL_ENV === "production"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const accessToken = await generateAccessToken();

    const response = await fetch(
      `${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorDetail;
      try {
        errorDetail = JSON.parse(errorText);
      } catch {
        errorDetail = errorText;
      }
      console.error("PayPal capture order detailed error:", JSON.stringify(errorDetail, null, 2));

      return NextResponse.json(
        { 
          error: "Failed to capture PayPal order",
          details: errorDetail?.details?.[0]?.description || errorDetail?.message || "Check server logs for details"
        },
        { status: response.status }
      );
    }

    const captureData = await response.json();

    const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0];
    
    return NextResponse.json({
      id: captureData.id,
      status: captureData.status,
      captureId: capture?.id,
      amount: capture?.amount?.value,
      currency: capture?.amount?.currency_code,
      payerEmail: captureData.payer?.email_address,
      payerName: captureData.payer?.name?.given_name 
        ? `${captureData.payer.name.given_name} ${captureData.payer.name.surname || ""}`
        : null,
    });
  } catch (error) {
    console.error("PayPal capture order error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

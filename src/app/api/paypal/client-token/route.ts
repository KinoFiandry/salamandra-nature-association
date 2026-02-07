import { NextRequest, NextResponse } from "next/server";
import { generateClientToken } from "@/lib/paypal";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currency = searchParams.get("currency") || "EUR";
    const intent = searchParams.get("intent") || "CAPTURE";
    
    const clientToken = await generateClientToken(currency, intent);
    return NextResponse.json({ client_token: clientToken });
  } catch (error) {
    console.error("PayPal client token error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate client token" },
      { status: 500 }
    );
  }
}

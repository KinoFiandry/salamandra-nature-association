import { NextResponse } from "next/server";
import { generateClientToken } from "@/lib/paypal";

export async function GET() {
  try {
    const clientToken = await generateClientToken();
    return NextResponse.json({ client_token: clientToken });
  } catch (error) {
    console.error("PayPal client token error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate client token" },
      { status: 500 }
    );
  }
}

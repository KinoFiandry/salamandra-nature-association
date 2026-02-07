"use client";

import { useCallback } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";

function ButtonsWrapper({
  amount,
  currency,
  donorName,
  donorEmail,
  onSuccess,
  onError,
}: {
  amount: number;
  currency: string;
  donorName: string;
  donorEmail: string;
  onSuccess: (data: {
    orderId: string;
    captureId: string;
    amount: string;
    currency: string;
  }) => void;
  onError?: (error: string) => void;
}) {
  const [{ isRejected, isPending }] = usePayPalScriptReducer();

  const handleCreateOrder = useCallback(async () => {
    const res = await fetch("/api/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency, donorName, donorEmail }),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || "Order creation failed");
    }
    const data = await res.json();
    return data.id;
  }, [amount, currency, donorName, donorEmail]);

  const handleApprove = useCallback(
    async (data: { orderID: string }) => {
      try {
        const res = await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: data.orderID }),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Payment capture failed");
        }
        const captureData = await res.json();
        onSuccess({
          orderId: captureData.id,
          captureId: captureData.captureId,
          amount: captureData.amount,
          currency: captureData.currency,
        });
      } catch (err) {
        console.error("Capture order error:", err);
        onError?.(err instanceof Error ? err.message : "Payment failed");
      }
    },
    [onSuccess, onError]
  );

  if (isRejected) {
    return (
      <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
        <p className="font-bold mb-1">Failed to load Payment System</p>
        <p>
          Please check your internet connection or disable any ad-blockers that
          might be preventing the payment from loading.
        </p>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-14 bg-sage-100 rounded-lg" />
        <div className="h-14 bg-sage-100 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-sage-600 mb-2 text-center">
        Secure payment via PayPal. You can pay with your PayPal account or{" "}
        <strong>click &quot;Debit or Credit Card&quot;</strong> to pay directly
        (no PayPal account required).
      </p>
        <PayPalButtons
          style={{
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "donate",
            tagline: false,
          }}
          createOrder={handleCreateOrder}
          onApprove={handleApprove}
          onError={(err) => {
            console.error("PayPal Button Error:", err);
            // This is where the user sees "Something went wrong" in the PayPal UI
            // But we can also show a local error message
            onError?.("The payment window closed or an error occurred. Please try again.");
          }}
          forceReRender={[amount, currency, donorName, donorEmail]}
        />
    </div>
  );
}

interface PayPalDonateButtonProps {
  amount: number;
  currency?: string;
  donorName: string;
  donorEmail: string;
  onSuccess: (data: {
    orderId: string;
    captureId: string;
    amount: string;
    currency: string;
  }) => void;
  onError?: (error: string) => void;
}

export default function PayPalDonateButton({
  amount,
  currency = "EUR",
  donorName,
  donorEmail,
  onSuccess,
  onError,
}: PayPalDonateButtonProps) {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

  if (!clientId) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg text-yellow-700 text-sm">
        PayPal configuration missing. Please check your environment variables.
      </div>
    );
  }

    return (
      <div className="w-full">
          <PayPalScriptProvider
            options={{
              clientId: clientId,
              currency: currency,
              intent: "capture",
            }}
          >
          <ButtonsWrapper
            amount={amount}
            currency={currency}
            donorName={donorName}
            donorEmail={donorEmail}
            onSuccess={onSuccess}
            onError={onError}
          />
        </PayPalScriptProvider>
      </div>
    );
}

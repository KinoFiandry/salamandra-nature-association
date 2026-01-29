"use client";

import { useEffect, useState, useCallback } from "react";
import {
  PayPalScriptProvider,
  PayPalCardFieldsProvider,
  PayPalNameField,
  PayPalNumberField,
  PayPalExpiryField,
  PayPalCVVField,
  usePayPalCardFields,
} from "@paypal/react-paypal-js";

interface PayPalCardFormProps {
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

function CardFieldsContent({
  amount,
  currency,
  onSuccess,
  onError,
}: Omit<PayPalCardFormProps, "donorName" | "donorEmail">) {
  const { cardFields } = usePayPalCardFields();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldsReady, setFieldsReady] = useState(false);

  useEffect(() => {
    if (cardFields?.submit) {
      setFieldsReady(true);
    }
  }, [cardFields]);

  const handleSubmit = async () => {
    console.log("Submit clicked, cardFields ready:", !!cardFields?.submit);
    if (!cardFields?.submit) {
      setError("Payment fields are still loading. Please wait a moment.");
      return;
    }
    
    if (processing) return;

    setProcessing(true);
    setError(null);

    try {
      console.log("Triggering cardFields.submit()...");
      await cardFields.submit();
    } catch (err) {
      console.error("Card submit error:", err);
      const msg = err instanceof Error ? err.message : "Payment failed. Please check your card details.";
      setError(msg);
      onError?.(msg);
      setProcessing(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1.5">
            Cardholder Name
          </label>
          <div className="h-12 border border-sage-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-terracotta-500 focus-within:border-terracotta-500 transition-all">
            <PayPalNameField
              onFocus={() => console.log("Name field focused")}
              style={{
                input: {
                  "font-size": "16px",
                  "font-family": "inherit",
                  color: "#1f2937",
                  padding: "12px",
                },
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-sage-700 mb-1.5">
            Card Number
          </label>
          <div className="h-12 border border-sage-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-terracotta-500 focus-within:border-terracotta-500 transition-all">
            <PayPalNumberField
              style={{
                input: {
                  "font-size": "16px",
                  "font-family": "inherit",
                  color: "#1f2937",
                  padding: "12px",
                },
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1.5">
              Expiry Date
            </label>
            <div className="h-12 border border-sage-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-terracotta-500 focus-within:border-terracotta-500 transition-all">
              <PayPalExpiryField
                style={{
                  input: {
                    "font-size": "16px",
                    "font-family": "inherit",
                    color: "#1f2937",
                    padding: "12px",
                  },
                }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-sage-700 mb-1.5">
              CVV
            </label>
            <div className="h-12 border border-sage-200 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-terracotta-500 focus-within:border-terracotta-500 transition-all">
              <PayPalCVVField
                style={{
                  input: {
                    "font-size": "16px",
                    "font-family": "inherit",
                    color: "#1f2937",
                    padding: "12px",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm animate-shake">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={processing || (!fieldsReady && !error)}
        className="w-full bg-terracotta-500 text-white py-3.5 rounded-lg font-bold hover:bg-terracotta-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </>
        ) : !fieldsReady ? (
          <>Initialising...</>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Donate {currency === "EUR" ? "€" : "$"}
            {amount.toFixed(2)}
          </>
        )}
      </button>

      <p className="text-xs text-sage-500 text-center">
        Your payment is secured by PayPal. Card details are encrypted and never
        stored on our servers.
      </p>
    </div>
  );
}

export default function PayPalDonateButton({
  amount,
  currency = "EUR",
  donorName,
  donorEmail,
  onSuccess,
  onError,
}: PayPalCardFormProps) {
  const [clientToken, setClientToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClientToken() {
      try {
        const response = await fetch("/api/paypal/client-token");
        const data = await response.json();
        if (data.client_token) {
          setClientToken(data.client_token);
        } else {
          throw new Error(data.error || "Failed to load PayPal client token");
        }
      } catch (err) {
        console.error("Client token fetch error:", err);
        setError("Payment system is currently unavailable. Please try again later.");
      }
    }

    fetchClientToken();
  }, []);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const isConfigured = clientId && clientId.length > 20 && !clientId.includes("YOUR_PAYPAL");

  if (!isConfigured) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
        <p className="font-bold mb-1">PayPal configuration missing</p>
        <p>Please ensure <code className="bg-amber-100 px-1">NEXT_PUBLIC_PAYPAL_CLIENT_ID</code> is set correctly in your environment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
        {error}
      </div>
    );
  }

  if (!clientToken) {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-12 bg-sage-100 rounded-lg" />
        <div className="h-12 bg-sage-100 rounded-lg" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-12 bg-sage-100 rounded-lg" />
          <div className="h-12 bg-sage-100 rounded-lg" />
        </div>
        <div className="h-12 bg-sage-200 rounded-lg" />
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: clientId!,
        components: "card-fields",
        dataClientToken: clientToken,
        currency: currency,
        intent: "CAPTURE",
        "data-sdk-integration-source": "react-paypal-js",
      }}
    >
      <PayPalCardFieldsProvider
        createOrder={async () => {
          console.log("createOrder callback triggered");
          const response = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount,
              currency,
              donorName,
              donorEmail,
            }),
          });

          if (!response.ok) {
            const errData = await response.json();
            console.error("Create order failed:", errData);
            throw new Error(errData.details || errData.error || "Failed to create order");
          }

          const data = await response.json();
          console.log("Order created successfully:", data.id);
          return data.id;
        }}
        onApprove={async (data) => {
          console.log("onApprove callback triggered", data);
          const response = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: data.orderID }),
          });

          if (!response.ok) {
            const errData = await response.json();
            console.error("Capture order failed:", errData);
            throw new Error(errData.details || errData.error || "Failed to capture payment");
          }

          const captureData = await response.json();
          console.log("Payment captured successfully:", captureData);
          onSuccess({
            orderId: captureData.id,
            captureId: captureData.captureId,
            amount: captureData.amount,
            currency: captureData.currency,
          });
        }}
        onError={(err) => {
          console.error("PayPal CardFields provider error:", err);
          onError?.(err instanceof Error ? err.message : "Payment failed");
        }}
      >
        <CardFieldsContent
          amount={amount}
          currency={currency}
          onSuccess={onSuccess}
          onError={onError}
        />
      </PayPalCardFieldsProvider>
    </PayPalScriptProvider>
  );
}

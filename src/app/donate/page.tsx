"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useI18n } from "@/lib/i18n";

const PayPalDonateButton = dynamic(() => import("@/components/PayPalDonateButton"), {
  ssr: false,
  loading: () => <div className="h-14 bg-sage-100 rounded-lg animate-pulse" />,
});

import { supabase } from "@/lib/supabase";

const DONATION_AMOUNTS = [10, 25, 50, 100];

export default function DonatePage() {
  const { t, language, setLanguage } = useI18n();
  const [showSuccess, setShowSuccess] = useState(false);
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(25);
  const [customAmount, setCustomAmount] = useState("");
  const [donationData, setDonationData] = useState<{
    amount: string;
    orderId: string;
  } | null>(null);

  const actualAmount =
    customAmount && parseFloat(customAmount) > 0
      ? parseFloat(customAmount)
      : selectedAmount;

  const handlePayPalSuccess = async (data: {
    orderId: string;
    captureId: string;
    amount: string;
    currency: string;
  }) => {
    try {
      await supabase.from("donations").insert([
        {
          amount: parseFloat(data.amount),
          currency: data.currency,
          status: "completed",
          payment_id: data.orderId,
          donor_name: donorName || "Anonymous Donor",
          donor_email: donorEmail || "donor@example.com",
        },
      ]);
      setDonationData({ amount: data.amount, orderId: data.orderId });
      setShowSuccess(true);
    } catch (error) {
      console.error("Error recording donation:", error);
      setDonationData({ amount: data.amount, orderId: data.orderId });
      setShowSuccess(true);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (donorName && donorEmail && actualAmount > 0) {
      setFormSubmitted(true);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 via-terracotta-50 to-sage-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-terracotta-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-terracotta-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-sage-800 mb-4">{t('donate.thanks')}</h1>
          <p className="text-sage-700 mb-6">
            {t('donate.thanksDesc')
              .replace('{amount}', `€${donationData?.amount || actualAmount}`)}
          </p>
          <div className="bg-sage-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-sage-600">
              {t('donate.emailSent').replace('{email}', donorEmail)}
            </p>
          </div>
          <Link
            href="/"
            className="inline-block bg-terracotta-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-terracotta-600 transition-colors"
          >
            {t('donate.returnHome')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-terracotta-50 to-sage-100">
      <header className="bg-white/80 backdrop-blur-sm border-b border-sage-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Salamandra Nature"
                className="h-12 w-auto"
              />
            </Link>
            <div className="flex items-center gap-6">
              <div className="flex bg-sage-100 rounded-full p-1">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    language === 'en'
                      ? 'bg-white text-sage-800 shadow-sm'
                      : 'text-sage-500 hover:text-sage-700'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('fr')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    language === 'fr'
                      ? 'bg-white text-sage-800 shadow-sm'
                      : 'text-sage-500 hover:text-sage-700'
                  }`}
                >
                  FR
                </button>
              </div>
              <Link
                href="/"
                className="text-terracotta-600 hover:text-terracotta-700 font-medium"
              >
                &larr; {t('donate.backHome')}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-sage-800 mb-4">
                {t('donate.title')}
              </h1>
              <p className="text-lg text-sage-700">
                {t('donate.subtitle')}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-semibold text-sage-800 mb-4">
                {t('donate.impactTitle')}
              </h2>
              <ul className="space-y-4">
                {[
                  { amount: "10€", desc: t('donate.impact1') },
                  { amount: "25€", desc: t('donate.impact2') },
                  { amount: "50€", desc: t('donate.impact3') },
                  { amount: "100€", desc: t('donate.impact4') },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-terracotta-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-4 h-4 text-terracotta-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="font-medium text-sage-800">
                        {item.amount}
                      </span>
                      <p className="text-sm text-sage-600">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-sage-700 text-white rounded-xl p-6">
              <h3 className="font-semibold mb-2">{t('donate.secureTitle')}</h3>
              <p className="text-sage-100 text-sm">
                {t('donate.secureDesc')}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-xl h-fit">
            <h2 className="text-2xl font-bold text-sage-800 mb-6 text-center">
              {t('donate.makeDonation')}
            </h2>

            {!formSubmitted ? (
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-2">
                    {t('donate.selectAmount')}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {DONATION_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(amt);
                          setCustomAmount("");
                        }}
                        className={`py-3 rounded-lg font-semibold transition-all ${
                          selectedAmount === amt && !customAmount
                            ? "bg-terracotta-500 text-white shadow-md"
                            : "bg-sage-100 text-sage-700 hover:bg-sage-200"
                        }`}
                      >
                        €{amt}
                      </button>
                    ))}
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs text-sage-500 mb-1">
                      {t('donate.customAmountLabel')}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sage-500 font-medium">
                        €
                      </span>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-2 border border-sage-200 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 outline-none transition-all"
                        placeholder={t('donate.customAmountPlaceholder')}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-sage-700 mb-1"
                  >
                    {t('donate.fullName')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-4 py-2 border border-sage-200 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-sage-700 mb-1"
                  >
                    {t('donate.emailAddress')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-sage-200 rounded-lg focus:ring-2 focus:ring-terracotta-500 focus:border-terracotta-500 outline-none transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="bg-sage-50 rounded-lg p-3 text-center">
                  <p className="text-sage-700">
                    {t('donate.donationAmount')}{" "}
                    <span className="font-bold text-terracotta-600 text-xl">
                      €{actualAmount.toFixed(2)}
                    </span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={actualAmount <= 0}
                  className="w-full bg-sage-800 text-white py-3 rounded-lg font-bold hover:bg-sage-900 transition-colors shadow-lg disabled:opacity-50"
                >
                  {t('donate.continue')}
                </button>
              </form>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-sage-50 rounded-lg p-4 mb-6 text-left">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase text-sage-400">
                      {t('donate.details')}
                    </span>
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="text-xs text-terracotta-600 hover:underline"
                    >
                      {t('donate.edit')}
                    </button>
                  </div>
                  <p className="font-bold text-sage-800">{donorName}</p>
                  <p className="text-sm text-sage-600">{donorEmail}</p>
                  <p className="text-lg font-bold text-terracotta-600 mt-2">
                    €{actualAmount.toFixed(2)}
                  </p>
                </div>

                <PayPalDonateButton
                  amount={actualAmount}
                  currency="EUR"
                  donorName={donorName}
                  donorEmail={donorEmail}
                  onSuccess={handlePayPalSuccess}
                  onError={(err) => console.error("Payment error:", err)}
                />

                <div className="mt-6 flex items-center justify-center gap-3 grayscale opacity-50">
                  <img
                    src="https://www.paypalobjects.com/webstatic/mktg/logo/AM_mc_vs_dc_ae.jpg"
                    alt="Credit Cards"
                    className="h-6 w-auto"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

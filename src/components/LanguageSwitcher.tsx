"use client";

import { useI18n } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex items-center gap-2 bg-emerald-50/50 p-1 rounded-full border border-emerald-100">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
          language === 'en'
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'text-emerald-600 hover:bg-emerald-100'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('fr')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
          language === 'fr'
            ? 'bg-emerald-600 text-white shadow-sm'
            : 'text-emerald-600 hover:bg-emerald-100'
        }`}
      >
        FR
      </button>
    </div>
  );
}

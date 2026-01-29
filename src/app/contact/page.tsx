"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const { t, language } = useI18n();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: submitError } = await supabase
      .from('messages')
      .insert([formData]);

    if (submitError) {
      setError(t('contact.error'));
    } else {
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="relative py-24 bg-sage-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=2000')] bg-cover bg-center" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-6"
          >
            {t('contact.title')}
          </motion.h1>
          <div className="w-24 h-2 bg-terracotta-400 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-20">
        <div className="grid lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-3xl font-bold text-sage-800 mb-8">{t('contact.subtitle')}</h2>
            
            <div className="space-y-10 mt-12">
                {[
                  { icon: MapPin, title: t('contact.address_label'), val: 'Résidence les Villas de Saint Florent, 20232 OLETTA, France' },
                  { icon: Mail, title: t('contact.email_label'), val: 'salamandra.nature2@gmail.com' },
                  { icon: Phone, title: t('contact.phone_label'), val: '+33 6 65 44 29 47' }
                ].map((info, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-14 h-14 bg-sage-50 rounded-2xl flex items-center justify-center text-sage-600 flex-shrink-0 border border-sage-100 shadow-sm">
                    <info.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sage-800 font-bold text-lg mb-1">{info.title}</h4>
                    <p className="text-sage-700/60 text-lg">{info.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-sage-50/50 p-10 md:p-16 rounded-[4rem] border border-sage-100">
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <CheckCircle className="w-10 h-10 text-terracotta-500" />
                </div>
                <h3 className="text-3xl font-bold text-sage-800 mb-6">{t('contact.success')}</h3>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-terracotta-500 text-white px-8 py-4 rounded-2xl font-bold hover:bg-terracotta-600 transition-all"
                >
                  {t('contact.send_another')}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-black text-sage-800 uppercase tracking-widest">{t('contact.name')}</label>
                    <input
                      required
                      type="text"
                      className="w-full bg-white border border-sage-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-terracotta-200 focus:border-terracotta-500 outline-none transition-all text-sage-800"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-black text-sage-800 uppercase tracking-widest">{t('contact.email')}</label>
                    <input
                      required
                      type="email"
                      className="w-full bg-white border border-sage-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-terracotta-200 focus:border-terracotta-500 outline-none transition-all text-sage-800"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black text-sage-800 uppercase tracking-widest">{t('contact.subject')}</label>
                  <input
                    required
                    type="text"
                    className="w-full bg-white border border-sage-200 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-terracotta-200 focus:border-terracotta-500 outline-none transition-all text-sage-800"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black text-sage-800 uppercase tracking-widest">{t('contact.message')}</label>
                  <textarea
                    required
                    rows={5}
                    className="w-full bg-white border border-sage-200 rounded-[2rem] px-6 py-4 focus:ring-4 focus:ring-terracotta-200 focus:border-terracotta-500 outline-none transition-all text-sage-800 resize-none"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                
                {error && <p className="text-red-500 font-bold">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-terracotta-500 text-white px-10 py-5 rounded-[2rem] font-bold text-xl hover:bg-terracotta-600 transition-all shadow-xl shadow-terracotta-900/10 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      {t('contact.sending')}
                    </>
                  ) : (
                    <>
                      {t('contact.send')}
                      <Send className="w-6 h-6" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

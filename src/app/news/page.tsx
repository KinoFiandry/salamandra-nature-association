"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Loader2, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

interface NewsItem {
  id: string;
  title_en: string;
  title_fr: string;
  content_en: string;
  content_fr: string;
  image_url: string;
  created_at: string;
}

export default function NewsPage() {
  const { t, language } = useI18n();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setNews(data);
      setLoading(false);
    }
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="relative py-24 bg-sage-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=2000')] bg-cover bg-center" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-6"
          >
            {t('news.title')}
          </motion.h1>
          <div className="w-24 h-2 bg-terracotta-400 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-terracotta-500">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="font-bold text-lg">Loading News...</p>
          </div>
        ) : (
          <div className="space-y-16">
            {news.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group grid md:grid-cols-2 gap-12 items-center"
              >
                <div className={`overflow-hidden rounded-[3rem] h-[400px] border border-sage-100 ${i % 2 === 1 ? 'md:order-last' : ''}`}>
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=1000'}
                    alt={language === 'en' ? item.title_en : item.title_fr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-3 text-terracotta-500 mb-6 font-bold">
                    <Calendar className="w-5 h-5" />
                    <span>
                      {format(new Date(item.created_at), 'PPP', { locale: language === 'fr' ? fr : enUS })}
                    </span>
                  </div>
                  <h2 className="text-4xl font-bold text-sage-800 mb-6 group-hover:text-terracotta-500 transition-colors">
                    {language === 'en' ? item.title_en : item.title_fr}
                  </h2>
                  <p className="text-sage-700/70 text-xl leading-relaxed mb-10">
                    {language === 'en' ? item.content_en : item.content_fr}
                  </p>
                  <button className="flex items-center gap-3 text-terracotta-500 font-black text-lg group/btn hover:translate-x-2 transition-transform">
                    {language === 'en' ? 'Read Full Story' : 'Lire la suite'}
                    <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

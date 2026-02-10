"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Play, Image as ImageIcon, X } from "lucide-react";

function getEmbedUrl(url: string): string {
  if (!url) return url;
  // Already an embed URL
  if (url.includes('/embed/')) return url;
  // youtube.com/watch?v=ID
  const watchMatch = url.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.+&v=)([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;
  // youtu.be/ID
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;
  // youtube.com/shorts/ID
  const shortsMatch = url.match(/youtube\.com\/shorts\/([^?&]+)/);
  if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  return url;
}

interface MediaItem {
  id: string;
  type: 'video' | 'photo';
  url: string;
  caption_en: string;
  caption_fr: string;
  thumbnail_url: string;
}

export default function MediaPage() {
  const { t, language } = useI18n();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    async function fetchMedia() {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setMedia(data);
      setLoading(false);
    }
    fetchMedia();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="relative py-24 bg-sage-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=2000')] bg-cover bg-center" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-6"
          >
            {t('media.title')}
          </motion.h1>
          <div className="w-24 h-2 bg-terracotta-400 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-terracotta-500">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="font-bold text-lg">Loading Gallery...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {media.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedMedia(item)}
                className="group relative cursor-pointer overflow-hidden rounded-[2rem] aspect-square bg-sage-50 border border-sage-100 shadow-sm hover:shadow-xl transition-all"
              >
                <img
                  src={item.thumbnail_url || item.url}
                  alt={language === 'en' ? item.caption_en : item.caption_fr}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-sage-800/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-terracotta-500 shadow-xl scale-75 group-hover:scale-100 transition-transform">
                    {item.type === 'video' ? <Play className="w-8 h-8 fill-current" /> : <ImageIcon className="w-8 h-8" />}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-sage-950/80 to-transparent translate-y-2 group-hover:translate-y-0 transition-transform">
                  <p className="text-white font-bold line-clamp-2">
                    {language === 'en' ? item.caption_en : item.caption_fr}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedMedia(null)}
          >
            <button className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors">
              <X className="w-10 h-10" />
            </button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-5xl w-full max-h-[80vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedMedia.type === 'video' ? (
                <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-2xl bg-black">
                    <iframe
                      src={getEmbedUrl(selectedMedia.url)}
                      className="w-full h-full"
                      allowFullScreen
                      allow="autoplay; encrypted-media"
                    />
                </div>
              ) : (
                <img
                  src={selectedMedia.url}
                  alt="Gallery content"
                  className="w-full h-full object-contain rounded-3xl shadow-2xl"
                />
              )}
              <div className="mt-8 text-center">
                <p className="text-white text-2xl font-bold">
                  {language === 'en' ? selectedMedia.caption_en : selectedMedia.caption_fr}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

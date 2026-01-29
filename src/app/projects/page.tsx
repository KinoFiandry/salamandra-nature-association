"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Loader2, Tag } from "lucide-react";

interface Project {
  id: string;
  title_en: string;
  title_fr: string;
  description_en: string;
  description_fr: string;
  image_url: string;
  category_en: string;
  category_fr: string;
}

export default function ProjectsPage() {
  const { t, language } = useI18n();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setProjects(data);
      setLoading(false);
    }
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="relative py-24 bg-sage-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=2000')] bg-cover bg-center" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-6"
          >
            {t('projects.title')}
          </motion.h1>
          <div className="w-24 h-2 bg-terracotta-400 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-terracotta-500">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="font-bold text-lg">Loading Projects...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-[3rem] overflow-hidden border border-sage-100 shadow-sm hover:shadow-2xl hover:shadow-sage-800/5 transition-all flex flex-col"
              >
                <div className="h-80 overflow-hidden relative">
                  <img
                    src={project.image_url || 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?q=80&w=1000'}
                    alt={language === 'en' ? project.title_en : project.title_fr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                    <Tag className="w-4 h-4 text-terracotta-500" />
                    <span className="text-xs font-black text-sage-800 uppercase tracking-widest">
                      {language === 'en' ? project.category_en : project.category_fr}
                    </span>
                  </div>
                </div>
                <div className="p-10 flex-grow flex flex-col">
                  <h2 className="text-3xl font-bold text-sage-800 mb-6 group-hover:text-terracotta-500 transition-colors">
                    {language === 'en' ? project.title_en : project.title_fr}
                  </h2>
                  <p className="text-sage-700/70 text-lg leading-relaxed mb-8">
                    {language === 'en' ? project.description_en : project.description_fr}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

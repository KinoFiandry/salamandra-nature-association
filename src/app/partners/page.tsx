"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { ExternalLink, Handshake } from "lucide-react";

interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string;
  type: string;
}

export default function PartnersPage() {
  const { t, language } = useI18n();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .order("name", { ascending: true });

    if (!error && data) {
      setPartners(data);
    }
    setLoading(false);
  };

  const partnerTypes = Array.from(new Set(partners.map(p => p.type)));

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="relative py-24 bg-sage-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1550005816-09246d3c945c?q=80&w=2000')] bg-cover bg-center" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-6"
          >
            {t('partners.title')}
          </motion.h1>
          <div className="w-24 h-2 bg-terracotta-400 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-20">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-sage-800 mb-6">
            {language === 'fr' 
              ? 'Ensemble pour la conservation des tortues' 
              : 'Together for Tortoise Conservation'}
          </h2>
          <p className="text-lg text-sage-700/60 leading-relaxed">
            {language === 'fr'
              ? 'Nous sommes fiers de collaborer avec des organisations nationales et internationales pour protéger la biodiversité unique de Madagascar.'
              : 'We are proud to collaborate with national and international organizations to protect Madagascar\'s unique biodiversity.'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-sage-200 border-t-terracotta-500 rounded-full animate-spin" />
          </div>
        ) : partners.length > 0 ? (
          <div className="space-y-16">
            {partnerTypes.map((type) => (
              <div key={type} className="space-y-8">
                <h3 className="text-xl font-black text-terracotta-500 uppercase tracking-widest border-b border-sage-100 pb-4">
                  {type === 'international' 
                    ? (language === 'fr' ? 'Partenaires Internationaux' : 'International Partners')
                    : (language === 'fr' ? 'Partenaires Locaux' : 'Local Partners')}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {partners.filter(p => p.type === type).map((partner) => (
                    <motion.a
                      key={partner.id}
                      href={partner.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -5 }}
                      className="bg-white p-8 rounded-[2rem] border border-sage-100 shadow-sm flex flex-col items-center justify-center gap-4 group transition-all hover:shadow-xl hover:border-sage-200"
                    >
                      <div className="w-24 h-24 relative grayscale group-hover:grayscale-0 transition-all duration-500">
                        {partner.logo_url ? (
                          <img
                            src={partner.logo_url}
                            alt={partner.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full bg-sage-50 rounded-full flex items-center justify-center text-sage-300">
                            <Handshake className="w-10 h-10" />
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <span className="block font-bold text-sage-800 group-hover:text-terracotta-500 transition-colors">
                          {partner.name}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs text-terracotta-400 font-medium mt-1">
                          Visit Website <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-20 rounded-[2rem] border border-sage-100 text-center">
            <Handshake className="w-16 h-16 text-sage-100 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-sage-800 mb-2">
              {language === 'fr' ? 'Aucun partenaire trouvé' : 'No partners found'}
            </h3>
            <p className="text-sage-700/60">
              {language === 'fr' 
                ? 'De nouveaux partenaires nous rejoignent bientôt.' 
                : 'New partners are joining us soon.'}
            </p>
          </div>
        )}

        <div className="mt-32 bg-sage-800 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <h2 className="text-4xl font-black mb-8 relative z-10">
            {language === 'fr' ? 'Devenir Partenaire' : 'Become a Partner'}
          </h2>
          <p className="text-xl text-sage-100 mb-12 max-w-2xl mx-auto relative z-10 font-light">
            {language === 'fr'
              ? 'Rejoignez notre réseau mondial pour renforcer l\'impact de la conservation à Madagascar.'
              : 'Join our global network to strengthen the impact of conservation in Madagascar.'}
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-sage-800 px-12 py-5 rounded-2xl font-bold text-xl hover:bg-sage-50 transition-all shadow-xl relative z-10"
          >
            {language === 'fr' ? 'Contactez-nous' : 'Get in Touch'}
          </a>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Info, Shield, TreePine, GraduationCap, Leaf, Sun, Sprout, Users } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';

const teamMembers = [
  {
    name: "Pr ALBIGNAC Roland",
    role: { en: "Honorary President", fr: "Président d’honneur" },
    bio: { 
      en: "Honorary Professor at Universities in France and Madagascar, UNDP / UNESCO Expert Consultant.",
      fr: "Professeur honoraire des Universités en France et à Madagascar, Consultant Expert PNUD / UNESCO."
    },
    image: "/images/pr-roland.jpg"
  },
  {
    name: "M. RAZAFINDRAKOTO Andriamampiandry Léon",
    role: { en: "President and Co-founder", fr: "Président et co-fondateur" },
    bio: {
      en: "Director of Dayu Biik, manager of the Thönyë Protected Natural Area in Hienghène, New Caledonia, IUCN Expert for Tortoise and Freshwater Turtle Group, member of the IUCN Economic, Social and Environmental Policy Commission.",
      fr: "Directeur de Dayu Biik, gestionnaire de l’Aire Naturelle Protégée du Thönyë à Hienghène en Nouvelle-Calédonie, Expert UICN Groupe Tortues terrestres et d’eau douce, membre de la Commission de la Politique Économique, Sociale et Environnementale de l’UICN."
    },
    image: "/images/leon.jpg"
  },
  {
    name: "M. GAUTHIER Frank",
    role: { en: "General Secretary", fr: "Secrétaire Général" },
    bio: {
      en: "Environmental Technician at the French Biodiversity Office in Corsica.",
      fr: "Technicien en Environnement à l’Office Français de la Biodiversité en Corse."
    },
    image: "/images/franck-gauthier.jpg"
  },
  {
    name: "Mme GAUTHIER Maude",
    role: { en: "Treasurer", fr: "Trésorière" },
    bio: {
      en: "School teacher in Corsica.",
      fr: "Professeur des écoles en Corse."
    },
    image: "/images/maud-gauthier.jpg"
  },
  {
    name: "MAUGUIN Camille",
    role: { en: "Communications Officer", fr: "Chargée de la Communication" },
    bio: {
      en: "Freelance graphic designer in Nièvre.",
      fr: "Graphiste indépendante dans la Nièvre."
    },
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400"
  },
  {
    name: "Mlle RAHOLISON Anjara Malala",
    role: { en: "Madagascar Representative", fr: "Représentante de Salamandra Nature à Madagascar" },
    bio: {
      en: "Communications Manager at NGO Génération Mada, Advisor to the NGO Y’DAGO.",
      fr: "Responsable Communication ONG Génération Mada, Conseillère de l’ONG Y’DAGO."
    },
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=400"
  }
];

function TeamMemberCard({ member, language, index }: { member: any, language: string, index: number }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-3xl overflow-hidden border border-sage-100 shadow-sm hover:shadow-lg transition-all flex flex-col h-full"
    >
      <div className="h-48 overflow-hidden flex-shrink-0">
        <img 
          src={member.image} 
          alt={member.name}
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
        />
      </div>
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-sage-800 mb-1 line-clamp-2">{member.name}</h3>
        <p className="text-terracotta-600 font-bold text-sm mb-4 min-h-[40px]">
          {member.role[language as 'en' | 'fr']}
        </p>
        <div className="relative">
          <p className={`text-sage-700/70 text-sm leading-relaxed ${!isExpanded ? 'line-clamp-4' : ''}`}>
            {member.bio[language as 'en' | 'fr']}
          </p>
          {member.bio[language as 'en' | 'fr'].length > 150 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="mt-2 text-terracotta-600 font-bold text-xs hover:text-terracotta-700 transition-colors uppercase tracking-wider text-left"
            >
              {isExpanded 
                ? (language === 'fr' ? 'Voir moins' : 'See less') 
                : (language === 'fr' ? 'Voir plus' : 'See more')}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function TeamCarousel({ teamMembers, language }: { teamMembers: any[], language: string }) {
  const [emblaRef] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true
  });

  return (
    <div className="overflow-hidden cursor-grab active:cursor-grabbing pb-8" ref={emblaRef}>
      <div className="flex gap-8">
        {teamMembers.map((member, i) => (
          <div key={member.name} className="flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0 h-full">
            <TeamMemberCard member={member} language={language} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AboutPage() {
  const { t, language } = useI18n();

  const presentation = {
    en: "Founded in 2004, Association Salamandra Nature is a non-profit association active in France and Madagascar. Its main objective is to promote knowledge, nature conservation, and sustainable development, with a particular focus on the preservation of endangered species, Madagascar's tortoise fauna, and natural ecosystems.",
    fr: "Créée en 2004, l’Association Salamandra Nature est une association à but non lucratif active en France et à Madagascar. Son objectif principal est de promouvoir la connaissance, la conservation de la nature et le développement durable, avec un accent particulier sur la préservation des espèces menacées, la faune chélonienne de Madagascar et des écosystèmes naturels."
  };

  const actions = [
    {
      icon: Shield,
      content: {
        en: "Protection of endemic and endangered land tortoises in Southwest Madagascar—Radiated tortoise (Astrochelys radiata, Sokake) and Spider tortoise (Pyxis arachnoides, Sokapila)—fighting against illegal trafficking and conserving populations.",
        fr: "Protection des tortues terrestres endémiques et menacées du Sud-ouest de Madagascar, tortue étoilée, Astrochelys radiata, Sokake et tortue araignée, Pyxis arachnoides, Sokapila— lutte contre leur trafic illégal et conservation des populations."
      }
    },
    {
      icon: TreePine,
      content: {
        en: "Combating deforestation and the degradation of natural habitats.",
        fr: "Lutte contre la déforestation et dégradation des habitats naturels."
      }
    },
    {
      icon: Leaf,
      content: {
        en: "Preservation and enhancement of local biodiversity within the framework of environmental education.",
        fr: "Préservation et valorisation de la biodiversité locale dans le cadre de l’éducation à l’environnement."
      }
    },
    {
      icon: GraduationCap,
      content: {
        en: "Public awareness of conservation and sustainable development in Madagascar and France.",
        fr: "Sensibilisation du public à la conservation et au développement durable à Madagascar et en France."
      }
    },
    {
      icon: Sun,
      content: {
        en: "Promotion of sustainable technologies, such as the popularization of solar cookers among local communities.",
        fr: "Promotion de technologies durables, comme la vulgarisation de cuiseurs solaires auprès de communautés locales."
      }
    },
    {
      icon: Sprout,
      content: {
        en: "Planting of local species in Southwest Madagascar to restore ecosystems.",
        fr: "Plantation d’essences locales dans le Sud-ouest de Madagascar pour restaurer les écosystèmes."
      }
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="relative py-24 bg-sage-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=2000')] bg-cover bg-center" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-6"
          >
            {t('about.title')}
          </motion.h1>
          <div className="w-24 h-2 bg-terracotta-400 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-20">
        <div className="mb-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center text-sage-600">
              <Info className="w-6 h-6" />
            </div>
            <h2 className="text-4xl font-bold text-sage-800">{t('about.presentation')}</h2>
          </div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl text-sage-700/80 leading-relaxed max-w-5xl"
          >
            {presentation[language as 'en' | 'fr']}
          </motion.p>
        </div>

        <div className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center text-sage-600">
              <Sprout className="w-6 h-6" />
            </div>
            <h2 className="text-4xl font-bold text-sage-800">{t('about.actions')}</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {actions.map((action, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 p-8 bg-sage-50/50 rounded-3xl border border-sage-100 hover:shadow-xl hover:shadow-sage-200/50 transition-all group"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-sage-600 shadow-sm border border-sage-100 group-hover:bg-terracotta-500 group-hover:text-white transition-colors">
                    <action.icon className="w-7 h-7" />
                  </div>
                </div>
                <p className="text-lg text-sage-700/80 leading-relaxed pt-2">
                  {action.content[language as 'en' | 'fr']}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

          {/* Team Section */}
          <div className="mb-32">
            <div className="flex items-center gap-4 mb-12">
              <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center text-sage-600">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-4xl font-bold text-sage-800">
                {language === 'fr' ? 'Notre Équipe' : 'Our Team'}
              </h2>
            </div>
            
            <TeamCarousel teamMembers={teamMembers} language={language} />
          </div>

      </div>

      {/* Call to Action */}
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-sage-900 text-white p-16 rounded-[4rem] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000')] bg-cover bg-center" />
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-8">
              {language === 'fr' ? 'Envie de nous rejoindre ?' : 'Want to Join Us?'}
            </h2>
            <p className="text-xl text-sage-100/80 mb-12 leading-relaxed">
              {language === 'fr' 
                ? 'Nous sommes toujours à la recherche de bénévoles et de partenaires passionnés pour nous aider à accroître notre impact à Madagascar.'
                : 'We are always looking for passionate volunteers and partners to help us scale our impact across Madagascar.'}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="/contact" className="bg-terracotta-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-terracotta-600 transition-all shadow-lg">
                {language === 'fr' ? 'Devenir Partenaire' : 'Partner With Us'}
              </a>
              <a href="/contact" className="border-2 border-white text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white hover:text-sage-900 transition-all">
                {language === 'fr' ? 'Bénévolat' : 'Volunteer'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

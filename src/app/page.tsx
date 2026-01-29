"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";
import { Shield, BookOpen, Search, ArrowRight, Heart, Users, ChevronLeft, ChevronRight } from "lucide-react";
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-[2rem] overflow-hidden border border-terracotta-100 shadow-sm hover:shadow-xl transition-all group flex flex-col h-full"
    >
      <div className="h-64 overflow-hidden relative flex-shrink-0">
        <img 
          src={member.image} 
          alt={member.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sage-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-black text-sage-800 mb-1 line-clamp-2">{member.name}</h3>
        <p className="text-terracotta-600 font-bold text-sm mb-4 min-h-[40px]">{member.role[language as 'en' | 'fr']}</p>
        <div className="relative">
          <p className={`text-sage-700/60 text-sm leading-relaxed ${!isExpanded ? 'line-clamp-4' : ''}`}>
            {member.bio[language as 'en' | 'fr']}
          </p>
          {member.bio[language as 'en' | 'fr'].length > 150 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="mt-2 text-terracotta-600 font-bold text-xs hover:text-terracotta-700 transition-colors uppercase tracking-wider"
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative group">
      <div className="overflow-hidden cursor-grab active:cursor-grabbing pb-8" ref={emblaRef}>
        <div className="flex gap-8">
          {teamMembers.map((member, i) => (
            <div key={member.name} className="flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_30%] xl:flex-[0_0_22%] min-w-0 h-full">
              <TeamMemberCard member={member} language={language} index={i} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          className={`w-12 h-12 rounded-full border-2 border-terracotta-200 flex items-center justify-center transition-all ${
            prevBtnEnabled 
              ? 'bg-white text-terracotta-600 hover:bg-terracotta-500 hover:text-white hover:border-terracotta-500 shadow-md' 
              : 'bg-gray-50 text-gray-300 cursor-not-allowed border-gray-100'
          }`}
          onClick={scrollPrev}
          disabled={!prevBtnEnabled}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Pagination Dots */}
        <div className="flex gap-2 mx-4">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === selectedIndex 
                  ? 'bg-terracotta-500 w-8' 
                  : 'bg-terracotta-200 hover:bg-terracotta-300'
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          className={`w-12 h-12 rounded-full border-2 border-terracotta-200 flex items-center justify-center transition-all ${
            nextBtnEnabled 
              ? 'bg-white text-terracotta-600 hover:bg-terracotta-500 hover:text-white hover:border-terracotta-500 shadow-md' 
              : 'bg-gray-50 text-gray-300 cursor-not-allowed border-gray-100'
          }`}
          onClick={scrollNext}
          disabled={!nextBtnEnabled}
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const { t, language } = useI18n();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative h-[90vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              /*src="https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=2000"*/
              src="/images/baobab.jpg"
              alt="Baobab trees Avenue of the Baobabs Madagascar"
              className="w-full h-full object-cover brightness-[0.35]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-terracotta-950/60 via-sage-900/30 to-transparent" />
 
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
              {t('hero.title')}{" "}
              <span className="text-terracotta-400">{t('hero.titleAccent')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-sage-100/90 mb-10 leading-relaxed font-light">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link
                href="/donate"
                className="group bg-terracotta-500 hover:bg-terracotta-400 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-terracotta-900/20 flex items-center justify-center gap-2"
              >
                {t('hero.cta')}
                <Heart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2"
              >
                {t('hero.learnMore')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-sage-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-12"
          >
            {[
              { val: "15+", label: 'impact.years' },
              { val: "5,000+", label: 'impact.turtles' },
              { val: "50+", label: 'impact.communities' },
              { val: "1,000+", label: 'impact.hectares' }
            ].map((stat, i) => (
              <motion.div key={i} variants={item} className="text-center">
                <div className="text-4xl md:text-5xl font-black text-terracotta-400 mb-2">{stat.val}</div>
                <div className="text-sm md:text-base text-sage-200 font-medium uppercase tracking-widest">
                  {t(stat.label)}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-sage-800 mb-6">
              {t('programs.title')}
            </h2>
            <div className="w-24 h-2 bg-terracotta-500 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: Shield,
                title: 'programs.habitat.title',
                desc: 'programs.habitat.desc'
              },
              {
                icon: BookOpen,
                title: 'programs.edu.title',
                desc: 'programs.edu.desc'
              },
              {
                icon: Search,
                title: 'programs.research.title',
                desc: 'programs.research.desc'
              }
            ].map((prog, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-sage-50 p-10 rounded-[3rem] border border-sage-100 hover:shadow-2xl hover:shadow-sage-900/5 transition-all group"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                  <prog.icon className="w-8 h-8 text-sage-600" />
                </div>
                <h3 className="text-2xl font-bold text-sage-800 mb-4">{t(prog.title)}</h3>
                <p className="text-sage-700/70 leading-relaxed text-lg">{t(prog.desc)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured News Preview (Static for now, but uses i18n keys) */}
      <section className="py-24 bg-sage-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black text-sage-800 mb-2">{t('news.title')}</h2>
              <div className="w-12 h-1.5 bg-terracotta-500 rounded-full" />
            </div>
            <Link href="/news" className="text-terracotta-600 font-bold hover:underline flex items-center gap-1">
              {t('nav.news')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
            <div className="grid md:grid-cols-2 gap-8">
              {/* Placeholder News Cards */}
              <div className="group bg-white rounded-[2rem] overflow-hidden border border-sage-100 shadow-sm hover:shadow-xl transition-all">
                <div className="h-64 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?q=80&w=1000" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="News" />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-sage-800 mb-4">Protecting Radiated Tortoise Habitats</h3>
                  <p className="text-sage-700/60 mb-6 line-clamp-2">We have launched a new initiative to protect critical dry forest habitats in the Androy region, ensuring safe zones for endangered tortoise species.</p>
                  <Link href="/news" className="inline-flex items-center gap-2 text-terracotta-600 font-bold group/link">
                    Read More <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
              <div className="group bg-white rounded-[2rem] overflow-hidden border border-sage-100 shadow-sm hover:shadow-xl transition-all">
                <div className="h-64 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1518467166778-b88f373ffec7?q=80&w=1000" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="News" />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-sage-800 mb-4">Community Workshop in Toliara</h3>
                  <p className="text-sage-700/60 mb-6 line-clamp-2">Local leaders gathered in Toliara to discuss sustainable conservation practices and land management for turtle protection.</p>
                  <Link href="/news" className="inline-flex items-center gap-2 text-terracotta-600 font-bold group/link">
                    Read More <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-32 bg-terracotta-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 bg-terracotta-100 px-6 py-2 rounded-full mb-6">
              <Users className="w-5 h-5 text-terracotta-700" />
              <span className="text-terracotta-800 font-bold text-sm uppercase tracking-widest">
                {language === 'fr' ? 'Notre Équipe' : 'Our Team'}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-sage-800 mb-6">
              {language === 'fr' ? 'Les Membres de l\'Association' : 'Meet the Team'}
            </h2>
            <p className="text-xl text-sage-700/60 max-w-2xl mx-auto">
              {language === 'fr' 
                ? 'Des passionnés dédiés à la protection des tortues terrestres de Madagascar.'
                : 'Passionate individuals dedicated to protecting Madagascar\'s land tortoises.'}
            </p>
          </div>

          <TeamCarousel teamMembers={teamMembers} language={language} />
        </div>
      </section>

      {/* Donation CTA */}
      <section className="py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-sage-600 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-sage-900/20"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
            <h2 className="text-4xl md:text-5xl font-black mb-8 relative z-10">{t('cta.title')}</h2>
            <p className="text-xl text-sage-50 mb-12 max-w-2xl mx-auto relative z-10 leading-relaxed font-light">
              {t('cta.desc')}
            </p>
            <Link
              href="/donate"
              className="inline-block bg-terracotta-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-terracotta-400 transition-all shadow-xl hover:-translate-y-1 relative z-10"
            >
              {t('cta.button')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sage-950 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <img 
                  src="/images/logo.png" 
                  alt="Salamandra Nature" 
                  className="h-20 w-auto"
                />
              </div>
              <p className="text-sage-200/60 text-lg max-w-md leading-relaxed">
                {t('footer.desc')}
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-8 uppercase tracking-widest">{t('footer.links')}</h4>
              <ul className="space-y-4">
                {['home', 'about', 'projects', 'news', 'contact', 'admin'].map((link) => (
                  <li key={link}>
                    <Link href={link === 'home' ? '/' : `/${link}`} className="text-sage-200/60 hover:text-terracotta-400 transition-colors">
                      {t(`nav.${link}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-8 uppercase tracking-widest">{t('footer.contact')}</h4>
              <div className="text-sage-200/60 space-y-4 leading-relaxed">
                <p>Résidence les Villas de Saint Florent, 20232 OLETTA, France</p>
                <p>salamandra.nature2@gmail.com</p>
                <p>+33 6 65 44 29 47</p>
              </div>
            </div>
          </div>
          <div className="border-t border-sage-900 mt-20 pt-10 text-center text-sage-200/40 text-sm">
            &copy; {new Date().getFullYear()} Salamandra Nature - Madagascar.
          </div>
        </div>
      </footer>
    </div>
  );
}

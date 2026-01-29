"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fr';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    en: {
      'nav.home': 'Home',
      'nav.about': 'About Us',
      'nav.projects': 'Projects',
      'nav.news': 'News',
      'nav.media': 'Media',
      'nav.events': 'Events',
      'nav.partners': 'Partners',
        'nav.contact': 'Contact',
        'nav.admin': 'Admin',
        'nav.donate': 'Donate Now',
      'hero.title': 'Protecting Madagascar\'s',
      'hero.titleAccent': 'Land Turtles',
      'hero.subtitle': 'Join us in our mission to conserve endangered land turtle species and preserve their dry forest habitats in southern Madagascar.',
      'hero.cta': 'Support Our Cause',
      'hero.learnMore': 'Learn More',
      'impact.title': 'Our Impact',
      'impact.years': 'Years of Conservation',
      'impact.turtles': 'Turtles Protected',
      'impact.communities': 'Local Communities',
      'impact.hectares': 'Hectares Protected',
      'programs.title': 'Our Programs',
      'programs.habitat.title': 'Habitat Protection',
      'programs.habitat.desc': 'Preserving critical dry forests and scrublands essential for land turtle survival in southern Madagascar.',
      'programs.edu.title': 'Community Education',
      'programs.edu.desc': 'Engaging local communities through awareness programs and sustainable livelihood alternatives.',
      'programs.research.title': 'Research & Monitoring',
      'programs.research.desc': 'Conducting scientific research to better understand and protect endangered land turtle populations.',
      'cta.title': 'Every Donation Makes a Difference',
      'cta.desc': 'Your support helps us protect endangered land turtles, preserve their habitats, and educate communities. Join us in making a lasting impact.',
      'cta.button': 'Make a Donation Today',
        'footer.desc': 'Salamandra Nature - Dedicated to protecting Madagascar\'s endangered land tortoises since 2004.',
      'footer.links': 'Quick Links',
      'footer.contact': 'Contact',
      'footer.follow': 'Follow Us',
        'contact.title': 'Contact Us',
        'contact.subtitle': 'Have questions or want to volunteer? Send us a message.',
        'contact.name': 'Full Name',
        'contact.email': 'Email Address',
        'contact.subject': 'Subject',
        'contact.message': 'Message',
        'contact.send': 'Send Message',
        'contact.sending': 'Sending...',
        'contact.success': 'Message sent successfully!',
        'contact.error': 'Failed to send message. Please try again.',
        'contact.send_another': 'Send Another Message',
        'contact.address_label': 'Address',
        'contact.email_label': 'Email',
        'contact.phone_label': 'Phone',
        'about.title': 'About Us',
      'about.presentation': 'Overview',
      'about.actions': 'Our Actions',
      'news.title': 'Latest News',
      'projects.title': 'Our Conservation Projects',
      'media.title': 'Photo & Video Gallery',
      'events.title': 'Events Calendar',
      'events.search': 'Search Events',
      'partners.title': 'Our Partners',
      'admin.dashboard': 'Admin Dashboard'
    },
    fr: {
      'nav.home': 'Accueil',
      'nav.about': 'À Propos',
      'nav.projects': 'Projets',
      'nav.news': 'Actualités',
      'nav.media': 'Médias',
      'nav.events': 'Événements',
      'nav.partners': 'Partenaires',
        'nav.contact': 'Contact',
        'nav.admin': 'Admin',
        'nav.donate': 'Faire un Don',
      'hero.title': 'Protéger les',
      'hero.titleAccent': 'Tortues Terrestres de Madagascar',
      'hero.subtitle': 'Rejoignez-nous dans notre mission de conservation des espèces de tortues terrestres menacées et de préservation de leurs habitats de forêt sèche dans le sud de Madagascar.',
      'hero.cta': 'Soutenir notre Cause',
      'hero.learnMore': 'En savoir plus',
      'impact.title': 'Notre Impact',
      'impact.years': 'Années de Conservation',
      'impact.turtles': 'Tortues Protégées',
      'impact.communities': 'Communautés Locales',
      'impact.hectares': 'Hectares Protégés',
      'programs.title': 'Nos Programmes',
      'programs.habitat.title': 'Protection de l\'Habitat',
      'programs.habitat.desc': 'Préservation des forêts sèches et des broussailles critiques essentielles à la survie des tortues terrestres dans le sud de Madagascar.',
      'programs.edu.title': 'Éducation Communautaire',
      'programs.edu.desc': 'Impliquer les communautés locales par des programmes de sensibilisation et des alternatives de subsistance durables.',
      'programs.research.title': 'Recherche & Suivi',
      'programs.research.desc': 'Mener des recherches scientifiques pour mieux comprendre et protéger les populations de tortues terrestres menacées.',
      'cta.title': 'Chaque Don Fait la Différence',
      'cta.desc': 'Votre soutien nous aide à protéger les tortues terrestres menacées, préserver leurs habitats et éduquer les communautés.',
      'cta.button': 'Faire un Don Aujourd\'hui',
        'footer.desc': 'Salamandra Nature - Dévouée à la protection des tortues terrestres menacées de Madagascar depuis 2004.',
      'footer.links': 'Liens Rapides',
      'footer.contact': 'Contact',
        'footer.follow': 'Suivez-nous',
        'contact.title': 'Contactez-nous',
        'contact.subtitle': 'Vous avez des questions ou souhaitez devenir bénévole ? Envoyez-nous un message.',
        'contact.name': 'Nom complet',
        'contact.email': 'Adresse e-mail',
        'contact.subject': 'Sujet',
        'contact.message': 'Message',
        'contact.send': 'Envoyer le message',
        'contact.sending': 'Envoi en cours...',
        'contact.success': 'Message envoyé avec succès !',
        'contact.error': 'Échec de l\'envoi du message. Veuillez réessayer.',
        'contact.send_another': 'Envoyer un autre message',
        'contact.address_label': 'Adresse',
        'contact.email_label': 'Email',
        'contact.phone_label': 'Téléphone',
        'about.title': 'À Propos',
      'about.presentation': 'Présentation Générale',
      'about.actions': 'Nos Actions',
      'news.title': 'Dernières Actualités',
      'projects.title': 'Nos Projets de Conservation',
      'media.title': 'Galerie Photo & Vidéo',
      'events.title': 'Calendrier des Événements',
      'events.search': 'Rechercher des Événements',
      'partners.title': 'Nos Partenaires',
      'admin.dashboard': 'Tableau de Bord Admin'
    }
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'fr')) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

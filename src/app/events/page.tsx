"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar as CalendarIcon, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { fr, enUS } from "date-fns/locale";

interface Event {
  id: string;
  title_en: string;
  title_fr: string;
  description_en: string;
  description_fr: string;
  date: string;
  location_en: string;
  location_fr: string;
}

export default function EventsPage() {
  const { t, language } = useI18n();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, selectedDate, searchQuery, language]);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (!error && data) {
      setEvents(data);
    }
    setLoading(false);
  };

  const filterEvents = () => {
    let filtered = events;

    if (selectedDate) {
      const selectedDateString = format(selectedDate, "yyyy-MM-dd");
      filtered = filtered.filter(event => event.date === selectedDateString);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event[`title_${language}` as keyof Event]?.toString().toLowerCase().includes(query) ||
        event[`description_${language}` as keyof Event]?.toString().toLowerCase().includes(query) ||
        event[`location_${language}` as keyof Event]?.toString().toLowerCase().includes(query)
      );
    }

    setFilteredEvents(filtered);
  };

  const dateLocale = language === 'fr' ? fr : enUS;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="relative py-24 bg-sage-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2000')] bg-cover bg-center" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-black mb-6"
          >
            {t('events.title')}
          </motion.h1>
          <div className="w-24 h-2 bg-terracotta-400 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid lg:grid-cols-[400px_1fr] gap-12">
          {/* Sidebar: Calendar & Search */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-sage-100">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-terracotta-400" />
                <Input
                  placeholder={t('events.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-sage-100 focus:ring-terracotta-400"
                />
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-xl border-0"
                locale={dateLocale}
              />
              <button 
                onClick={() => setSelectedDate(undefined)}
                className="w-full mt-4 text-sm text-terracotta-500 font-medium hover:underline"
              >
                {language === 'fr' ? 'Effacer la date' : 'Clear date'}
              </button>
            </div>
          </div>

          {/* Main Content: Event List */}
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-sage-800">
                {selectedDate 
                  ? format(selectedDate, "PPPP", { locale: dateLocale })
                  : (language === 'fr' ? 'Tous les événements' : 'All Events')}
              </h2>
              <span className="text-terracotta-500 font-medium">
                {filteredEvents.length} {language === 'fr' ? 'événement(s) trouvé(s)' : 'event(s) found'}
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-sage-200 border-t-terracotta-500 rounded-full animate-spin" />
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="grid gap-6">
                {filteredEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-8 rounded-[2rem] shadow-sm border border-sage-100 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                      <div className="w-20 h-20 bg-sage-50 rounded-2xl flex flex-col items-center justify-center text-terracotta-500 border border-sage-100 shrink-0">
                        <span className="text-2xl font-black">{format(new Date(event.date), "dd")}</span>
                        <span className="text-xs font-bold uppercase">{format(new Date(event.date), "MMM")}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-terracotta-500 text-sm font-bold mb-2">
                          <MapPin className="w-4 h-4" />
                          {event[`location_${language}` as keyof Event]}
                        </div>
                        <h3 className="text-2xl font-bold text-sage-800 mb-2">
                          {event[`title_${language}` as keyof Event]}
                        </h3>
                        <p className="text-sage-700/60 leading-relaxed">
                          {event[`description_${language}` as keyof Event]}
                        </p>
                      </div>
                      <button className="bg-sage-50 text-terracotta-500 px-6 py-3 rounded-xl font-bold group-hover:bg-terracotta-500 group-hover:text-white transition-all self-start md:self-center">
                        Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-20 rounded-[2rem] border border-sage-100 text-center">
                <CalendarIcon className="w-16 h-16 text-sage-100 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-sage-800 mb-2">
                  {language === 'fr' ? 'Aucun événement trouvé' : 'No events found'}
                </h3>
                <p className="text-sage-700/60">
                  {language === 'fr' 
                    ? 'Essayez de changer la date ou la recherche.' 
                    : 'Try changing the date or your search query.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

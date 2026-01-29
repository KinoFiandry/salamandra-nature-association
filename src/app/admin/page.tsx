"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
    Calendar as CalendarIcon, 
    Video, 
    Handshake, 
    Plus, 
    Trash2, 
    Edit3, 
    Save, 
    X,
    FileText,
    LogOut,
    ImageIcon,
    Upload,
    Users,
    History,
    Activity,
    Receipt
  } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const router = useRouter();
  const { t, language } = useI18n();
  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [visitorCount, setVisitorCount] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Form states
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title_en: "",
    title_fr: "",
    description_en: "",
    description_fr: "",
    date: "",
    location_en: "",
    location_fr: ""
  });

  const [showVideoForm, setShowVideoForm] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title_en: "",
    title_fr: "",
    url: "",
    thumbnail_url: "",
    category: "conservation"
  });

  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: "",
    logo_url: "",
    website_url: "",
    type: "international"
  });

  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    caption_en: "",
    caption_fr: "",
    url: ""
  });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const [eventsRes, videosRes, partnersRes, photosRes, visitsRes, historyRes, logsRes, donationsRes] = await Promise.all([
      supabase.from("events").select("*").order("date", { ascending: true }),
      supabase.from("videos").select("*").order("created_at", { ascending: false }),
      supabase.from("partners").select("*").order("name", { ascending: true }),
      supabase.from("media").select("*").eq("type", "photo").order("created_at", { ascending: false }),
      supabase.from("site_visits").select("*", { count: 'exact', head: true }),
      supabase.from("update_history").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("system_logs").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("donations").select("*").order("created_at", { ascending: false })
    ]);

    if (eventsRes.data) setEvents(eventsRes.data);
    if (videosRes.data) setVideos(videosRes.data);
    if (partnersRes.data) setPartners(partnersRes.data);
    if (photosRes.data) setPhotos(photosRes.data);
    if (visitsRes.count !== null) setVisitorCount(visitsRes.count);
    if (historyRes.data) setHistory(historyRes.data);
    if (logsRes.data) setLogs(logsRes.data);
    if (donationsRes.data) setDonations(donationsRes.data);
    setLoading(false);
  };

  const logAdminAction = async (action: string, details?: string) => {
    const username = localStorage.getItem("admin_user") || "Unknown Admin";
    await supabase.from("update_history").insert([{
      admin_user: username,
      action,
      details
    }]);
  };

  useEffect(() => {
    const authenticated = localStorage.getItem("admin_authenticated");
    if (!authenticated) {
      router.push("/admin/login");
      return;
    }
    setIsAuthenticated(true);
    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-terracotta-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleAddEvent = async () => {
    const { error } = await supabase.from("events").insert([newEvent]);
    if (error) {
      toast.error("Error adding event");
    } else {
      await logAdminAction("Added Event", `Created event: ${newEvent.title_en}`);
      toast.success("Event added successfully");
      setShowEventForm(false);
      setNewEvent({ title_en: "", title_fr: "", description_en: "", description_fr: "", date: "", location_en: "", location_fr: "" });
      fetchData();
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm("Are you sure?")) {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) toast.error("Error deleting event");
      else {
        await logAdminAction("Deleted Event", `Deleted event ID: ${id}`);
        fetchData();
      }
    }
  };

  const handleAddVideo = async () => {
    const { error } = await supabase.from("videos").insert([newVideo]);
    if (error) toast.error("Error adding video");
    else {
      await logAdminAction("Added Video", `Added video: ${newVideo.title_en}`);
      toast.success("Video added successfully");
      setShowVideoForm(false);
      setNewVideo({ title_en: "", title_fr: "", url: "", thumbnail_url: "", category: "conservation" });
      fetchData();
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (confirm("Are you sure?")) {
      const { error } = await supabase.from("videos").delete().eq("id", id);
      if (error) toast.error("Error deleting video");
      else {
        await logAdminAction("Deleted Video", `Deleted video ID: ${id}`);
        fetchData();
      }
    }
  };

  const handleAddPartner = async () => {
    const { error } = await supabase.from("partners").insert([newPartner]);
    if (error) toast.error("Error adding partner");
    else {
      await logAdminAction("Added Partner", `Added partner: ${newPartner.name}`);
      toast.success("Partner added successfully");
      setShowPartnerForm(false);
      setNewPartner({ name: "", logo_url: "", website_url: "", type: "international" });
      fetchData();
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (confirm("Are you sure?")) {
      const { error } = await supabase.from("partners").delete().eq("id", id);
      if (error) toast.error("Error deleting partner");
      else {
        await logAdminAction("Deleted Partner", `Deleted partner ID: ${id}`);
        fetchData();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddPhoto = async () => {
    if (!selectedFile) {
      toast.error("Please select a photo to upload");
      return;
    }

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

        const { error: dbError } = await supabase.from("media").insert([{
          type: "photo",
          url: publicUrl,
          caption_en: newPhoto.caption_en,
          caption_fr: newPhoto.caption_fr
        }]);

        if (dbError) throw dbError;

        await logAdminAction("Added Photo", `Uploaded new photo: ${newPhoto.caption_en || 'No caption'}`);
        toast.success("Photo uploaded successfully");
      setShowPhotoForm(false);
      setNewPhoto({ caption_en: "", caption_fr: "", url: "" });
      setSelectedFile(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Error uploading photo");
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (id: string, url: string) => {
    if (confirm("Are you sure?")) {
      try {
        const pathMatch = url.match(/photos\/(.+)$/);
        if (pathMatch) {
          await supabase.storage.from('photos').remove([pathMatch[1]]);
        }
        const { error } = await supabase.from("media").delete().eq("id", id);
        if (error) throw error;
        await logAdminAction("Deleted Photo", `Deleted photo ID: ${id}`);
        fetchData();
      } catch {
        toast.error("Error deleting photo");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-sage-800 text-white py-12 px-4 shadow-xl">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img src="/images/logo.png" alt="Salamandra Nature" className="h-14 w-auto" />
              <div>
                <h1 className="text-3xl font-black">{t('admin.dashboard')}</h1>
                <p className="text-sage-300 font-medium">Manage NGO Website Content</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                <Users className="w-5 h-5 text-terracotta-400" />
                <div className="flex flex-col">
                  <span className="text-xs text-sage-300 font-bold uppercase tracking-wider leading-none">Total Visitors</span>
                  <span className="text-xl font-black leading-none">{visitorCount.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" /> Logout
                </Button>
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => window.location.href = "/"}>
                  Go to Website
                </Button>
              </div>
            </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-white p-1 rounded-2xl border border-sage-100 shadow-sm h-16 w-full md:w-auto overflow-x-auto flex-nowrap">
              <TabsTrigger value="events" className="rounded-xl px-8 h-full data-[state=active]:bg-terracotta-500 data-[state=active]:text-white font-bold transition-all whitespace-nowrap">
                <CalendarIcon className="w-4 h-4 mr-2" /> Events
              </TabsTrigger>
              <TabsTrigger value="videos" className="rounded-xl px-8 h-full data-[state=active]:bg-terracotta-500 data-[state=active]:text-white font-bold transition-all whitespace-nowrap">
                <Video className="w-4 h-4 mr-2" /> Videos
              </TabsTrigger>
              <TabsTrigger value="photos" className="rounded-xl px-8 h-full data-[state=active]:bg-terracotta-500 data-[state=active]:text-white font-bold transition-all whitespace-nowrap">
                <ImageIcon className="w-4 h-4 mr-2" /> Photos
              </TabsTrigger>
              <TabsTrigger value="partners" className="rounded-xl px-8 h-full data-[state=active]:bg-terracotta-500 data-[state=active]:text-white font-bold transition-all whitespace-nowrap">
                <Handshake className="w-4 h-4 mr-2" /> Partners
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-xl px-8 h-full data-[state=active]:bg-terracotta-500 data-[state=active]:text-white font-bold transition-all whitespace-nowrap">
                <History className="w-4 h-4 mr-2" /> History
              </TabsTrigger>
              <TabsTrigger value="logs" className="rounded-xl px-8 h-full data-[state=active]:bg-terracotta-500 data-[state=active]:text-white font-bold transition-all whitespace-nowrap">
                <Activity className="w-4 h-4 mr-2" /> Logs
              </TabsTrigger>
              <TabsTrigger value="donations" className="rounded-xl px-8 h-full data-[state=active]:bg-terracotta-500 data-[state=active]:text-white font-bold transition-all whitespace-nowrap">
                <Receipt className="w-4 h-4 mr-2" /> Donations
              </TabsTrigger>
            </TabsList>

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-sage-800">Manage Events</h2>
              <Button onClick={() => setShowEventForm(true)} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold">
                <Plus className="w-4 h-4 mr-2" /> Add Event
              </Button>
            </div>

            <div className="grid gap-4">
              {events.map(event => (
                <div key={event.id} className="bg-white p-6 rounded-2xl border border-sage-100 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="font-bold text-lg text-sage-800">{event.title_en} / {event.title_fr}</h3>
                    <div className="text-terracotta-500 text-sm font-medium flex items-center gap-4 mt-1">
                      <span>{event.date}</span>
                      <span>{event.location_en}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-terracotta-400 hover:text-terracotta-500">
                      <Edit3 className="w-5 h-5" />
                    </Button>
                    <Button onClick={() => handleDeleteEvent(event.id)} variant="ghost" size="icon" className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-sage-800">Manage Videos</h2>
              <Button onClick={() => setShowVideoForm(true)} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold">
                <Plus className="w-4 h-4 mr-2" /> Add Video
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map(video => (
                <div key={video.id} className="bg-white rounded-[2rem] border border-sage-100 shadow-sm overflow-hidden group">
                  <div className="aspect-video bg-slate-200 relative">
                    {video.thumbnail_url && <img src={video.thumbnail_url} alt={video.title_en} className="w-full h-full object-cover" />}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteVideo(video.id)}>
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-sage-800 line-clamp-1">{video.title_en}</h3>
                    <p className="text-xs text-terracotta-500 font-bold uppercase tracking-wider mt-2">{video.category}</p>
                  </div>
                </div>
              ))}
            </div>
            </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-sage-800">Manage Photos</h2>
              <Button onClick={() => setShowPhotoForm(true)} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold">
                <Plus className="w-4 h-4 mr-2" /> Add Photo
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {photos.map(photo => (
                <div key={photo.id} className="bg-white rounded-[2rem] border border-sage-100 shadow-sm overflow-hidden group">
                  <div className="aspect-square bg-slate-200 relative">
                    <img src={photo.url} alt={photo.caption_en || "Photo"} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="destructive" size="icon" onClick={() => handleDeletePhoto(photo.id, photo.url)}>
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  {(photo.caption_en || photo.caption_fr) && (
                    <div className="p-4">
                      <p className="text-sm text-sage-800 line-clamp-2">{photo.caption_en || photo.caption_fr}</p>
                    </div>
                  )}
                </div>
              ))}
              {photos.length === 0 && (
                <div className="col-span-full text-center py-12 text-terracotta-400">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No photos yet. Add your first photo!</p>
                </div>
              )}
            </div>
          </TabsContent>

            <TabsContent value="partners" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-sage-800">Manage Partners</h2>
              <Button onClick={() => setShowPartnerForm(true)} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold">
                <Plus className="w-4 h-4 mr-2" /> Add Partner
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {partners.map(partner => (
                <div key={partner.id} className="bg-white p-6 rounded-[2rem] border border-sage-100 shadow-sm relative group text-center">
                  <button 
                    onClick={() => handleDeletePartner(partner.id)}
                    className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="w-16 h-16 mx-auto mb-4 bg-sage-50 rounded-xl flex items-center justify-center">
                    {partner.logo_url ? <img src={partner.logo_url} alt={partner.name} className="w-full h-full object-contain" /> : <Handshake className="w-8 h-8 text-sage-200" />}
                  </div>
                  <h3 className="font-bold text-sage-800 text-sm">{partner.name}</h3>
                </div>
              ))}
            </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-sage-800">Update History</h2>
                <Button variant="outline" onClick={fetchData} className="rounded-xl font-bold">Refresh</Button>
              </div>
              <div className="bg-white rounded-2xl border border-sage-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-sage-50 border-b border-sage-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black text-sage-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-black text-sage-600 uppercase tracking-wider">Admin</th>
                      <th className="px-6 py-4 text-xs font-black text-sage-600 uppercase tracking-wider">Action</th>
                      <th className="px-6 py-4 text-xs font-black text-sage-600 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sage-50">
                    {history.map((item) => (
                      <tr key={item.id} className="hover:bg-sage-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-sage-500 font-medium">
                          {new Date(item.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-sage-800">{item.admin_user}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full bg-sage-100 text-sage-700 text-xs font-bold">
                            {item.action}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-sage-600 italic">{item.details}</td>
                      </tr>
                    ))}
                    {history.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-sage-400 font-medium">
                          No history records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-sage-800">System Logs</h2>
                <Button variant="outline" onClick={fetchData} className="rounded-xl font-bold">Refresh</Button>
              </div>
              <div className="bg-white rounded-2xl border border-sage-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-sage-50 border-b border-sage-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black text-sage-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-black text-sage-600 uppercase tracking-wider">Level</th>
                      <th className="px-6 py-4 text-xs font-black text-sage-600 uppercase tracking-wider">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sage-50">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-sage-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-sage-500 font-medium">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            log.level === 'error' ? 'bg-red-100 text-red-700' : 
                            log.level === 'warning' ? 'bg-amber-100 text-amber-700' : 
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {log.level.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-sage-800 font-medium">{log.message}</td>
                      </tr>
                    ))}
                    {logs.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-sage-400 font-medium">
                          No system logs found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="donations" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-sage-800">Donation Receipts</h2>
                <div className="flex gap-3">
                  <div className="bg-terracotta-50 px-4 py-2 rounded-xl border border-terracotta-100">
                    <span className="text-xs text-terracotta-600 font-bold uppercase block leading-none mb-1">Total Received</span>
                    <span className="text-xl font-black text-terracotta-700">
                      ${donations.reduce((acc, d) => acc + (d.status === 'completed' ? Number(d.amount) : 0), 0).toLocaleString()}
                    </span>
                  </div>
                  <Button variant="outline" onClick={fetchData} className="rounded-xl font-bold">Refresh</Button>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-sage-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-sage-50 border-b border-sage-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-black text-sage-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-black text-sage-600 uppercase tracking-wider">Donor</th>
                      <th className="px-6 py-4 text-xs font-black text-sage-600 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-xs font-black text-sage-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sage-50">
                    {donations.map((donation) => (
                      <tr key={donation.id} className="hover:bg-sage-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-sage-500 font-medium">
                          {new Date(donation.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-sage-800">{donation.donor_name || 'Anonymous'}</span>
                            <span className="text-xs text-sage-400">{donation.donor_email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-black text-sage-800">
                          {donation.currency.toUpperCase()} {Number(donation.amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            donation.status === 'completed' ? 'bg-green-100 text-green-700' : 
                            donation.status === 'failed' ? 'bg-red-100 text-red-700' : 
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {donation.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {donations.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-sage-400 font-medium">
                          No donation records yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
      </div>

      {/* Forms (Modals-like) */}
      <AnimatePresence>
        {showEventForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-sage-950/60 backdrop-blur-sm" onClick={() => setShowEventForm(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
              <div className="bg-sage-800 p-8 text-white flex justify-between items-center">
                <h2 className="text-2xl font-black">Add New Event</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowEventForm(false)} className="text-white/60 hover:text-white">
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Title (EN)</label>
                    <Input value={newEvent.title_en} onChange={e => setNewEvent({...newEvent, title_en: e.target.value})} placeholder="Event title in English" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Title (FR)</label>
                    <Input value={newEvent.title_fr} onChange={e => setNewEvent({...newEvent, title_fr: e.target.value})} placeholder="Titre de l'événement en Français" className="rounded-xl" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Date</label>
                    <Input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Location (EN)</label>
                    <Input value={newEvent.location_en} onChange={e => setNewEvent({...newEvent, location_en: e.target.value})} placeholder="Location in English" className="rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-sage-800">Description (EN)</label>
                  <Textarea value={newEvent.description_en} onChange={e => setNewEvent({...newEvent, description_en: e.target.value})} placeholder="Detailed description in English" className="rounded-xl min-h-[100px]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-sage-800">Description (FR)</label>
                  <Textarea value={newEvent.description_fr} onChange={e => setNewEvent({...newEvent, description_fr: e.target.value})} placeholder="Description détaillée en Français" className="rounded-xl min-h-[100px]" />
                </div>
              </div>
              <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-sage-100">
                <Button variant="ghost" onClick={() => setShowEventForm(false)} className="rounded-xl font-bold">Cancel</Button>
                <Button onClick={handleAddEvent} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold px-8">Save Event</Button>
              </div>
            </motion.div>
          </div>
        )}

        {showVideoForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-sage-950/60 backdrop-blur-sm" onClick={() => setShowVideoForm(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
              <div className="bg-sage-800 p-8 text-white flex justify-between items-center">
                <h2 className="text-2xl font-black">Add New Video</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowVideoForm(false)} className="text-white/60 hover:text-white">
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-sage-800">Title (EN)</label>
                  <Input value={newVideo.title_en} onChange={e => setNewVideo({...newVideo, title_en: e.target.value})} placeholder="Video title" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-sage-800">Video URL (YouTube/Vimeo)</label>
                  <Input value={newVideo.url} onChange={e => setNewVideo({...newVideo, url: e.target.value})} placeholder="https://youtube.com/watch?v=..." className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-sage-800">Thumbnail URL</label>
                  <Input value={newVideo.thumbnail_url} onChange={e => setNewVideo({...newVideo, thumbnail_url: e.target.value})} placeholder="Image URL for preview" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-sage-800">Category</label>
                  <select 
                    value={newVideo.category} 
                    onChange={e => setNewVideo({...newVideo, category: e.target.value})}
                    className="w-full h-11 rounded-xl border border-sage-100 bg-white px-3 text-sm focus:ring-2 focus:ring-terracotta-400 outline-none"
                  >
                    <option value="conservation">Conservation</option>
                    <option value="educational">Educational</option>
                    <option value="fieldwork">Fieldwork</option>
                  </select>
                </div>
              </div>
              <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-sage-100">
                <Button variant="ghost" onClick={() => setShowVideoForm(false)} className="rounded-xl font-bold">Cancel</Button>
                <Button onClick={handleAddVideo} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold px-8">Save Video</Button>
              </div>
            </motion.div>
          </div>
        )}

        {showPartnerForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-sage-950/60 backdrop-blur-sm" onClick={() => setShowPartnerForm(false)} />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
                <div className="bg-sage-800 p-8 text-white flex justify-between items-center">
                  <h2 className="text-2xl font-black">Add New Partner</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowPartnerForm(false)} className="text-white/60 hover:text-white">
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Partner Name</label>
                    <Input value={newPartner.name} onChange={e => setNewPartner({...newPartner, name: e.target.value})} placeholder="Organization Name" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Website URL</label>
                    <Input value={newPartner.website_url} onChange={e => setNewPartner({...newPartner, website_url: e.target.value})} placeholder="https://..." className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Logo URL</label>
                    <Input value={newPartner.logo_url} onChange={e => setNewPartner({...newPartner, logo_url: e.target.value})} placeholder="Image URL for logo" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Type</label>
                    <select 
                      value={newPartner.type} 
                      onChange={e => setNewPartner({...newPartner, type: e.target.value})}
                      className="w-full h-11 rounded-xl border border-sage-100 bg-white px-3 text-sm focus:ring-2 focus:ring-terracotta-400 outline-none"
                    >
                      <option value="international">International</option>
                      <option value="local">Local</option>
                      <option value="governmental">Governmental</option>
                    </select>
                  </div>
                </div>
                <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-sage-100">
                  <Button variant="ghost" onClick={() => setShowPartnerForm(false)} className="rounded-xl font-bold">Cancel</Button>
                  <Button onClick={handleAddPartner} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold px-8">Save Partner</Button>
                </div>
              </motion.div>
            </div>
          )}

          {showPhotoForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-sage-950/60 backdrop-blur-sm" onClick={() => setShowPhotoForm(false)} />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
                <div className="bg-sage-800 p-8 text-white flex justify-between items-center">
                  <h2 className="text-2xl font-black">Add New Photo</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowPhotoForm(false)} className="text-white/60 hover:text-white">
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Photo File</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label
                        htmlFor="photo-upload"
                        className="flex items-center justify-center gap-3 w-full h-32 border-2 border-dashed border-sage-200 rounded-xl cursor-pointer hover:border-terracotta-400 hover:bg-sage-50 transition-colors"
                      >
                        {selectedFile ? (
                          <div className="text-center">
                            <ImageIcon className="w-8 h-8 mx-auto text-terracotta-500 mb-2" />
                            <p className="text-sm text-sage-800 font-medium">{selectedFile.name}</p>
                            <p className="text-xs text-terracotta-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload className="w-8 h-8 mx-auto text-terracotta-400 mb-2" />
                            <p className="text-sm text-terracotta-500 font-medium">Click to upload photo</p>
                            <p className="text-xs text-terracotta-400">JPG, PNG, GIF up to 10MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Caption (EN)</label>
                    <Input value={newPhoto.caption_en} onChange={e => setNewPhoto({...newPhoto, caption_en: e.target.value})} placeholder="Photo description in English" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Caption (FR)</label>
                    <Input value={newPhoto.caption_fr} onChange={e => setNewPhoto({...newPhoto, caption_fr: e.target.value})} placeholder="Description en Français" className="rounded-xl" />
                  </div>
                </div>
                <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-sage-100">
                  <Button variant="ghost" onClick={() => { setShowPhotoForm(false); setSelectedFile(null); }} className="rounded-xl font-bold">Cancel</Button>
                  <Button onClick={handleAddPhoto} disabled={uploading || !selectedFile} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold px-8 disabled:opacity-50">
                    {uploading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Uploading...
                      </span>
                    ) : "Upload Photo"}
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
    LayoutDashboard, 
      CalendarDays, 
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
      Receipt,
        Newspaper,
        FolderOpen
      } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DragDropImageUpload from "@/components/DragDropImageUpload";

export default function AdminDashboard() {
  const router = useRouter();
  const { t, language } = useI18n();
  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [photos, setPhotos] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [visitorCount, setVisitorCount] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // News state
    const [news, setNews] = useState<any[]>([]);
    const [showNewsForm, setShowNewsForm] = useState(false);
    const [editingNews, setEditingNews] = useState<any>(null);
    const [newNews, setNewNews] = useState({
      title_en: "",
      title_fr: "",
      content_en: "",
      content_fr: "",
      image_url: ""
      });

      // Projects state
      const [projects, setProjects] = useState<any[]>([]);
      const [showProjectForm, setShowProjectForm] = useState(false);
      const [editingProject, setEditingProject] = useState<any>(null);
      const [newProject, setNewProject] = useState({
        title_en: "",
        title_fr: "",
        description_en: "",
        description_fr: "",
        image_url: "",
        category_en: "",
        category_fr: ""
      });

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
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [newVideo, setNewVideo] = useState({
    title_en: "",
    title_fr: "",
    url: "",
    thumbnail_url: "",
    category: "conservation"
  });

  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any>(null);
  const [newPartner, setNewPartner] = useState({
    name: "",
    logo_url: "",
    website_url: "",
    type: "international"
  });

  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<any>(null);
  const [newPhoto, setNewPhoto] = useState({
    caption_en: "",
    caption_fr: "",
    url: ""
  });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [showMemberForm, setShowMemberForm] = useState(false);
    const [editingMember, setEditingMember] = useState<any>(null);
    const [newMember, setNewMember] = useState({
      name: "",
      role_en: "",
      role_fr: "",
      bio_en: "",
      bio_fr: "",
      photo_url: "",
      display_order: 0
    });
  const [memberPhotoFile, setMemberPhotoFile] = useState<File | null>(null);
  const [uploadingMember, setUploadingMember] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [eventsRes, videosRes, partnersRes, photosRes, visitsRes, historyRes, logsRes, donationsRes, membersRes, newsRes, projectsRes] = await Promise.all([
            supabase.from("events").select("*").order("date", { ascending: true }),
            supabase.from("videos").select("*").order("created_at", { ascending: false }),
            supabase.from("partners").select("*").order("name", { ascending: true }),
            supabase.from("media").select("*").eq("type", "photo").order("created_at", { ascending: false }),
            supabase.from("unique_visitors_count").select("*").single(),
            supabase.from("update_history").select("*").order("created_at", { ascending: false }).limit(50),
            supabase.from("system_logs").select("*").order("created_at", { ascending: false }).limit(50),
            supabase.from("donations").select("*").order("created_at", { ascending: false }),
            supabase.from("group_members").select("*").order("display_order", { ascending: true }),
            supabase.from("news").select("*").order("created_at", { ascending: false }),
            supabase.from("projects").select("*").order("created_at", { ascending: false })
          ]);

      if (eventsRes.data) setEvents(eventsRes.data);
      if (videosRes.data) setVideos(videosRes.data);
      if (partnersRes.data) setPartners(partnersRes.data);
      if (photosRes.data) setPhotos(photosRes.data);
      if (visitsRes.data) setVisitorCount(visitsRes.data.count);
      if (historyRes.data) setHistory(historyRes.data);
      if (logsRes.data) setLogs(logsRes.data);
      if (donationsRes.data) setDonations(donationsRes.data);
        if (membersRes.data) setMembers(membersRes.data);
          if (newsRes.data) setNews(newsRes.data);
          if (projectsRes.data) setProjects(projectsRes.data);

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

    const resetVideoForm = () => {
      setNewVideo({ title_en: "", title_fr: "", url: "", thumbnail_url: "", category: "conservation" });
      setEditingVideo(null);
      setShowVideoForm(false);
    };

    const handleOpenEditVideo = (video: any) => {
      setEditingVideo(video);
      setNewVideo({
        title_en: video.title_en,
        title_fr: video.title_fr || "",
        url: video.url,
        thumbnail_url: video.thumbnail_url || "",
        category: video.category || "conservation"
      });
      setShowVideoForm(true);
    };

    const handleSaveVideo = async () => {
      if (!newVideo.title_en.trim() || !newVideo.url.trim()) {
        toast.error("Title and URL are required");
        return;
      }
      try {
        if (editingVideo) {
          const { error } = await supabase.from("videos").update(newVideo).eq("id", editingVideo.id);
          if (error) throw error;
          // Sync to media table
          await supabase.from("media").update({
            url: newVideo.url,
            caption_en: newVideo.title_en,
            caption_fr: newVideo.title_fr,
            thumbnail_url: newVideo.thumbnail_url || "",
          }).eq("id", editingVideo.id);
          await logAdminAction("Updated Video", `Updated video: ${newVideo.title_en}`);
          toast.success("Video updated successfully");
        } else {
          const { data, error } = await supabase.from("videos").insert([newVideo]).select().single();
          if (error) throw error;
          // Also insert into media table with same id
          await supabase.from("media").insert([{
            id: data.id,
            type: "video",
            url: newVideo.url,
            caption_en: newVideo.title_en,
            caption_fr: newVideo.title_fr,
            thumbnail_url: newVideo.thumbnail_url || "",
          }]);
          await logAdminAction("Added Video", `Added video: ${newVideo.title_en}`);
          toast.success("Video added successfully");
        }
        resetVideoForm();
        fetchData();
      } catch (error: any) {
        toast.error(error.message || "Error saving video");
      }
    };

    const handleDeleteVideo = async (id: string) => {
      if (confirm("Are you sure?")) {
        const { error } = await supabase.from("videos").delete().eq("id", id);
        if (error) { toast.error("Error deleting video"); return; }
        // Also delete from media table
        await supabase.from("media").delete().eq("id", id);
        await logAdminAction("Deleted Video", `Deleted video ID: ${id}`);
        fetchData();
      }
    };

    const resetPartnerForm = () => {
      setNewPartner({ name: "", logo_url: "", website_url: "", type: "international" });
      setEditingPartner(null);
      setShowPartnerForm(false);
    };

    const handleOpenEditPartner = (partner: any) => {
      setEditingPartner(partner);
      setNewPartner({
        name: partner.name,
        logo_url: partner.logo_url || "",
        website_url: partner.website_url || "",
        type: partner.type || "international"
      });
      setShowPartnerForm(true);
    };

    const handleSavePartner = async () => {
      if (!newPartner.name.trim()) {
        toast.error("Partner name is required");
        return;
      }
      try {
        if (editingPartner) {
          const { error } = await supabase.from("partners").update(newPartner).eq("id", editingPartner.id);
          if (error) throw error;
          await logAdminAction("Updated Partner", `Updated partner: ${newPartner.name}`);
          toast.success("Partner updated successfully");
        } else {
          const { error } = await supabase.from("partners").insert([newPartner]);
          if (error) throw error;
          await logAdminAction("Added Partner", `Added partner: ${newPartner.name}`);
          toast.success("Partner added successfully");
        }
        resetPartnerForm();
        fetchData();
      } catch (error: any) {
        toast.error(error.message || "Error saving partner");
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

    const resetPhotoForm = () => {
      setNewPhoto({ caption_en: "", caption_fr: "", url: "" });
      setSelectedFile(null);
      setEditingPhoto(null);
      setShowPhotoForm(false);
    };

    const handleOpenEditPhoto = (photo: any) => {
      setEditingPhoto(photo);
      setNewPhoto({
        caption_en: photo.caption_en || "",
        caption_fr: photo.caption_fr || "",
        url: photo.url || ""
      });
      setSelectedFile(null);
      setShowPhotoForm(true);
    };

    const handleSavePhoto = async () => {
      if (!editingPhoto && !selectedFile) {
        toast.error("Please select a photo to upload");
        return;
      }

      setUploading(true);
      try {
        let photoUrl = editingPhoto?.url || "";

        if (selectedFile) {
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

          photoUrl = publicUrl;
        }

        if (editingPhoto) {
          const { error: dbError } = await supabase.from("media").update({
            url: photoUrl,
            caption_en: newPhoto.caption_en,
            caption_fr: newPhoto.caption_fr
          }).eq("id", editingPhoto.id);
          if (dbError) throw dbError;
          await logAdminAction("Updated Photo", `Updated photo: ${newPhoto.caption_en || editingPhoto.id}`);
          toast.success("Photo updated successfully");
        } else {
          const { error: dbError } = await supabase.from("media").insert([{
            type: "photo",
            url: photoUrl,
            caption_en: newPhoto.caption_en,
            caption_fr: newPhoto.caption_fr
          }]);
          if (dbError) throw dbError;
          await logAdminAction("Added Photo", `Uploaded new photo: ${newPhoto.caption_en || 'No caption'}`);
          toast.success("Photo uploaded successfully");
        }

        resetPhotoForm();
        fetchData();
      } catch (error: any) {
        toast.error(error.message || "Error saving photo");
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

  const resetMemberForm = () => {
    setNewMember({ name: "", role_en: "", role_fr: "", bio_en: "", bio_fr: "", photo_url: "", display_order: 0 });
    setMemberPhotoFile(null);
    setEditingMember(null);
    setShowMemberForm(false);
  };

  const handleOpenEditMember = (member: any) => {
    setEditingMember(member);
    setNewMember({
      name: member.name,
      role_en: member.role_en,
      role_fr: member.role_fr,
      bio_en: member.bio_en,
      bio_fr: member.bio_fr,
      photo_url: member.photo_url || "",
      display_order: member.display_order
    });
    setMemberPhotoFile(null);
    setShowMemberForm(true);
  };

  const uploadMemberPhoto = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `members/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('member-photos')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('member-photos')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSaveMember = async () => {
    if (!newMember.name.trim()) {
      toast.error(t('admin.members.name') + " is required");
      return;
    }

    setUploadingMember(true);
    try {
      let photo_url = editingMember?.photo_url || newMember.photo_url || "";

      if (memberPhotoFile) {
        // Delete old photo if editing and replacing
        if (editingMember?.photo_url) {
          const pathMatch = editingMember.photo_url.match(/member-photos\/(.+)$/);
          if (pathMatch) {
            await supabase.storage.from('member-photos').remove([pathMatch[1]]);
          }
        }
        photo_url = await uploadMemberPhoto(memberPhotoFile);
      }

      if (editingMember) {
        const { error } = await supabase.from("group_members").update({
            ...newMember,
            photo_url
          }).eq("id", editingMember.id);
        if (error) throw error;
        await logAdminAction("Updated Member", `Updated member: ${newMember.name}`);
        toast.success(t('admin.members.edit') + " - OK");
      } else {
        const { error } = await supabase.from("group_members").insert([{
          ...newMember,
          photo_url
        }]);
        if (error) throw error;
        await logAdminAction("Added Member", `Added member: ${newMember.name}`);
        toast.success(t('admin.members.add') + " - OK");
      }

      resetMemberForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Error saving member");
    } finally {
      setUploadingMember(false);
    }
  };

    const handleDeleteMember = async (id: string, photoUrl: string) => {
      if (confirm(t('admin.members.deleteConfirm'))) {
        try {
          if (photoUrl) {
            const pathMatch = photoUrl.match(/member-photos\/(.+)$/);
            if (pathMatch) {
              await supabase.storage.from('member-photos').remove([pathMatch[1]]);
            }
          }
          const { error } = await supabase.from("group_members").delete().eq("id", id);
          if (error) throw error;
          await logAdminAction("Deleted Member", `Deleted member ID: ${id}`);
          fetchData();
        } catch {
          toast.error("Error deleting member");
        }
      }
    };

    // News CRUD
    const resetNewsForm = () => {
      setNewNews({ title_en: "", title_fr: "", content_en: "", content_fr: "", image_url: "" });
      setEditingNews(null);
      setShowNewsForm(false);
    };

    const handleOpenEditNews = (item: any) => {
      setEditingNews(item);
      setNewNews({
        title_en: item.title_en,
        title_fr: item.title_fr,
        content_en: item.content_en,
        content_fr: item.content_fr,
        image_url: item.image_url || ""
      });
      setShowNewsForm(true);
    };

    const handleSaveNews = async () => {
      if (!newNews.title_en.trim()) {
        toast.error(t('admin.news.titleEn') + " is required");
        return;
      }
      try {
        if (editingNews) {
          const { error } = await supabase.from("news").update(newNews).eq("id", editingNews.id);
          if (error) throw error;
          await logAdminAction("Updated News", `Updated article: ${newNews.title_en}`);
          toast.success(t('admin.news.edit') + " - OK");
        } else {
          const { error } = await supabase.from("news").insert([newNews]);
          if (error) throw error;
          await logAdminAction("Added News", `Added article: ${newNews.title_en}`);
          toast.success(t('admin.news.add') + " - OK");
        }
        resetNewsForm();
        fetchData();
      } catch (error: any) {
        toast.error(error.message || "Error saving article");
      }
    };

      const handleDeleteNews = async (id: string) => {
        if (confirm(t('admin.news.deleteConfirm'))) {
          try {
            const { error } = await supabase.from("news").delete().eq("id", id);
            if (error) throw error;
            await logAdminAction("Deleted News", `Deleted article ID: ${id}`);
            fetchData();
          } catch {
            toast.error("Error deleting article");
          }
        }
      };

      // Projects CRUD
      const resetProjectForm = () => {
        setNewProject({ title_en: "", title_fr: "", description_en: "", description_fr: "", image_url: "", category_en: "", category_fr: "" });
        setEditingProject(null);
        setShowProjectForm(false);
      };

      const handleOpenEditProject = (item: any) => {
        setEditingProject(item);
        setNewProject({
          title_en: item.title_en,
          title_fr: item.title_fr,
          description_en: item.description_en,
          description_fr: item.description_fr,
          image_url: item.image_url || "",
          category_en: item.category_en || "",
          category_fr: item.category_fr || ""
        });
        setShowProjectForm(true);
      };

      const handleSaveProject = async () => {
        if (!newProject.title_en.trim()) {
          toast.error(t('admin.projects.titleEn') + " is required");
          return;
        }
        try {
          if (editingProject) {
            const { error } = await supabase.from("projects").update(newProject).eq("id", editingProject.id);
            if (error) throw error;
            await logAdminAction("Updated Project", `Updated project: ${newProject.title_en}`);
            toast.success(t('admin.projects.edit') + " - OK");
          } else {
            const { error } = await supabase.from("projects").insert([newProject]);
            if (error) throw error;
            await logAdminAction("Added Project", `Added project: ${newProject.title_en}`);
            toast.success(t('admin.projects.add') + " - OK");
          }
          resetProjectForm();
          fetchData();
        } catch (error: any) {
          toast.error(error.message || "Error saving project");
        }
      };

      const handleDeleteProject = async (id: string) => {
        if (confirm(t('admin.projects.deleteConfirm'))) {
          try {
            const { error } = await supabase.from("projects").delete().eq("id", id);
            if (error) throw error;
            await logAdminAction("Deleted Project", `Deleted project ID: ${id}`);
            fetchData();
          } catch {
            toast.error("Error deleting project");
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
                <p className="text-sage-300 font-medium">{t('admin.subtitle')}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl border border-white/10">
                <Users className="w-5 h-5 text-terracotta-400" />
                <div className="flex flex-col">
                  <span className="text-xs text-sage-300 font-bold uppercase tracking-wider leading-none">{t('admin.totalVisitors')}</span>
                  <span className="text-xl font-black leading-none">{visitorCount.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" /> {t('admin.logout')}
                </Button>
                <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20" onClick={() => window.location.href = "/"}>
                  {t('admin.goToWebsite')}
                </Button>
              </div>
            </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-white p-1 rounded-2xl border border-sage-100 shadow-sm h-16 w-full md:w-auto overflow-x-auto flex-nowrap">
              <TabsTrigger value="events" className="rounded-xl px-8 h-full data-[state=active]:bg-terracotta-500 data-[state=active]:text-white font-bold transition-all whitespace-nowrap">
                    <CalendarDays className="w-5 h-5 mr-2" /> {t('admin.tabs.events')}
                </TabsTrigger>
                  <TabsTrigger value="news" className="rounded-xl px-8 h-full data-[state=active]:bg-terracotta-500 data-[state=active]:text-white font-bold transition-all whitespace-nowrap">
                    <Newspaper className="w-4 h-4 mr-2" /> {t('admin.tabs.news')}
                  </TabsTrigger>
                  <TabsTrigger value="projects" className="rounded-xl px-8 h-full data-[state=active]:bg-terracotta-500 data-[state=active]:text-white font-bold transition-all whitespace-nowrap">
                    <FolderOpen className="w-4 h-4 mr-2" /> {t('admin.tabs.projects')}
                  </TabsTrigger>
              <TabsTrigger value="videos" className="rounded-xl px-8 h-full data-[state=active]:bg-terracotta-500 data-[state=active]:text-white font-bold transition-all whitespace-nowrap">
                <Video className="w-4 h-4 mr-2" /> {t('admin.tabs.videos')}
              </TabsTrigger>
              <TabsTrigger value="photos" className="rounded-xl px-8 h-full data-[state=active]:bg-terracotta-500 data-[state=active]:text-white font-bold transition-all whitespace-nowrap">
                <ImageIcon className="w-4 h-4 mr-2" /> {t('admin.tabs.photos')}
              </TabsTrigger>
              <TabsTrigger value="partners" className="rounded-xl px-8 h-full data-[state=active]:bg-terracotta-500 data-[state=active]:text-white font-bold transition-all whitespace-nowrap">
                <Handshake className="w-4 h-4 mr-2" /> {t('nav.partners')}
              </TabsTrigger>
              <TabsTrigger value="members" className="rounded-xl px-8 h-full data-[state=active]:bg-terracotta-500 data-[state=active]:text-white font-bold transition-all whitespace-nowrap">
                <Users className="w-4 h-4 mr-2" /> {t('admin.members')}
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-xl px-8 h-full data-[state=active]:bg-terracotta-500 data-[state=active]:text-white font-bold transition-all whitespace-nowrap">
                <History className="w-4 h-4 mr-2" /> {t('admin.tabs.history')}
              </TabsTrigger>
              <TabsTrigger value="logs" className="rounded-xl px-8 h-full data-[state=active]:bg-terracotta-500 data-[state=active]:text-white font-bold transition-all whitespace-nowrap">
                <Activity className="w-4 h-4 mr-2" /> {t('admin.tabs.logs')}
              </TabsTrigger>
              <TabsTrigger value="donations" className="rounded-xl px-8 h-full data-[state=active]:bg-terracotta-500 data-[state=active]:text-white font-bold transition-all whitespace-nowrap">
                <Receipt className="w-4 h-4 mr-2" /> {t('admin.tabs.donations')}
              </TabsTrigger>
            </TabsList>

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-sage-800">{t('admin.events.manage')}</h2>
                <Button onClick={() => setShowEventForm(true)} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold">
                  <Plus className="w-4 h-4 mr-2" /> {t('admin.events.add')}
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

            <TabsContent value="news" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-sage-800">{t('admin.news.manage')}</h2>
                <Button onClick={() => { resetNewsForm(); setShowNewsForm(true); }} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold">
                  <Plus className="w-4 h-4 mr-2" /> {t('admin.news.add')}
                </Button>
              </div>

              <div className="grid gap-4">
                {news.map(item => (
                  <div key={item.id} className="bg-white p-6 rounded-2xl border border-sage-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow">
                    {item.image_url && (
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-sage-100 flex-shrink-0">
                        <img src={item.image_url} alt={item.title_en} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-lg text-sage-800 truncate">{item.title_en}</h3>
                      <p className="text-terracotta-500 text-sm font-medium">{item.title_fr}</p>
                      <p className="text-sage-500 text-xs mt-1 line-clamp-1">{item.content_en}</p>
                    </div>
                    <div className="flex-shrink-0 text-xs text-sage-400 font-bold">
                      {new Date(item.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button onClick={() => handleOpenEditNews(item)} variant="ghost" size="icon" className="text-terracotta-400 hover:text-terracotta-500">
                        <Edit3 className="w-5 h-5" />
                      </Button>
                      <Button onClick={() => handleDeleteNews(item.id)} variant="ghost" size="icon" className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ))}
                {news.length === 0 && (
                  <div className="text-center py-12 text-sage-400">
                    <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{t('admin.news.empty')}</p>
                  </div>
                )}
              </div>
              </TabsContent>

              <TabsContent value="projects" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-sage-800">{t('admin.projects.manage')}</h2>
                  <Button onClick={() => { resetProjectForm(); setShowProjectForm(true); }} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold">
                    <Plus className="w-4 h-4 mr-2" /> {t('admin.projects.add')}
                  </Button>
                </div>

                <div className="grid gap-4">
                  {projects.map(item => (
                    <div key={item.id} className="bg-white p-6 rounded-2xl border border-sage-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow">
                      {item.image_url && (
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-sage-100 flex-shrink-0">
                          <img src={item.image_url} alt={item.title_en} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-grow min-w-0">
                        <h3 className="font-bold text-lg text-sage-800 truncate">{item.title_en}</h3>
                        <p className="text-terracotta-500 text-sm font-medium">{item.title_fr}</p>
                        <p className="text-sage-500 text-xs mt-1 line-clamp-1">{item.description_en}</p>
                        {item.category_en && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-sage-100 text-sage-700 text-xs font-bold rounded-full">{item.category_en}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button onClick={() => handleOpenEditProject(item)} variant="ghost" size="icon" className="text-terracotta-400 hover:text-terracotta-500">
                          <Edit3 className="w-5 h-5" />
                        </Button>
                        <Button onClick={() => handleDeleteProject(item.id)} variant="ghost" size="icon" className="text-red-400 hover:text-red-600">
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="text-center py-12 text-sage-400">
                      <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>{t('admin.projects.empty')}</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="videos" className="space-y-6">
              <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-sage-800">{t('admin.videos.manage')}</h2>
                  <Button onClick={() => { resetVideoForm(); setShowVideoForm(true); }} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold">
                    <Plus className="w-4 h-4 mr-2" /> {t('admin.videos.add')}
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map(video => (
                  <div key={video.id} className="bg-white rounded-[2rem] border border-sage-100 shadow-sm overflow-hidden group">
                    <div className="aspect-video bg-slate-200 relative">
                      {video.thumbnail_url && <img src={video.thumbnail_url} alt={video.title_en} className="w-full h-full object-cover" />}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleOpenEditVideo(video)} className="bg-white/90 hover:bg-white">
                          <Edit3 className="w-5 h-5 text-terracotta-500" />
                        </Button>
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
                {videos.length === 0 && (
                  <div className="col-span-full text-center py-12 text-sage-400">
                    <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No videos yet. Add your first video!</p>
                  </div>
                )}
              </div>
              </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-sage-800">Manage Photos</h2>
              <Button onClick={() => { resetPhotoForm(); setShowPhotoForm(true); }} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold">
                <Plus className="w-4 h-4 mr-2" /> Add Photo
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {photos.map(photo => (
                <div key={photo.id} className="bg-white rounded-[2rem] border border-sage-100 shadow-sm overflow-hidden group">
                  <div className="aspect-square bg-slate-200 relative">
                    <img src={photo.url} alt={photo.caption_en || "Photo"} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleOpenEditPhoto(photo)} className="bg-white/90 hover:bg-white">
                        <Edit3 className="w-5 h-5 text-terracotta-500" />
                      </Button>
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
              <Button onClick={() => { resetPartnerForm(); setShowPartnerForm(true); }} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold">
                <Plus className="w-4 h-4 mr-2" /> Add Partner
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {partners.map(partner => (
                <div key={partner.id} className="bg-white p-6 rounded-[2rem] border border-sage-100 shadow-sm relative group text-center">
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button onClick={() => handleOpenEditPartner(partner)} className="text-terracotta-400 hover:text-terracotta-600">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeletePartner(partner.id)} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="w-16 h-16 mx-auto mb-4 bg-sage-50 rounded-xl flex items-center justify-center">
                    {partner.logo_url ? <img src={partner.logo_url} alt={partner.name} className="w-full h-full object-contain" /> : <Handshake className="w-8 h-8 text-sage-200" />}
                  </div>
                  <h3 className="font-bold text-sage-800 text-sm">{partner.name}</h3>
                  <p className="text-xs text-sage-400 mt-1">{partner.type}</p>
                </div>
              ))}
              {partners.length === 0 && (
                <div className="col-span-full text-center py-12 text-sage-400">
                  <Handshake className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No partners yet. Add your first partner!</p>
                </div>
              )}
            </div>
              </TabsContent>

            <TabsContent value="members" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-sage-800">{t('admin.members.manage')}</h2>
                <Button onClick={() => { resetMemberForm(); setShowMemberForm(true); }} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold">
                  <Plus className="w-4 h-4 mr-2" /> {t('admin.members.add')}
                </Button>
              </div>

              <div className="grid gap-4">
                {members.map(member => (
                  <div key={member.id} className="bg-white p-6 rounded-2xl border border-sage-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-sage-100 flex-shrink-0">
                      {member.photo_url ? (
                        <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="w-8 h-8 text-sage-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-lg text-sage-800 truncate">{member.name}</h3>
                      <p className="text-terracotta-500 text-sm font-medium">
                        {language === 'fr' ? member.role_fr : member.role_en}
                      </p>
                      <p className="text-sage-500 text-xs mt-1 line-clamp-1">
                        {language === 'fr' ? member.bio_fr : member.bio_en}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-xs text-sage-400 font-bold">
                      #{member.display_order}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button onClick={() => handleOpenEditMember(member)} variant="ghost" size="icon" className="text-terracotta-400 hover:text-terracotta-500">
                        <Edit3 className="w-5 h-5" />
                      </Button>
                      <Button onClick={() => handleDeleteMember(member.id, member.photo_url)} variant="ghost" size="icon" className="text-red-400 hover:text-red-600">
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                ))}
                {members.length === 0 && (
                  <div className="text-center py-12 text-sage-400">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{t('admin.members.empty')}</p>
                  </div>
                )}
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-sage-950/60 backdrop-blur-sm" onClick={resetVideoForm} />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
              <div className="bg-sage-800 p-8 text-white flex justify-between items-center">
                <h2 className="text-2xl font-black">{editingVideo ? "Edit Video" : "Add New Video"}</h2>
                <Button variant="ghost" size="icon" onClick={resetVideoForm} className="text-white/60 hover:text-white">
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Title (EN)</label>
                    <Input value={newVideo.title_en} onChange={e => setNewVideo({...newVideo, title_en: e.target.value})} placeholder="Video title" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">Title (FR)</label>
                    <Input value={newVideo.title_fr} onChange={e => setNewVideo({...newVideo, title_fr: e.target.value})} placeholder="Titre de la vidéo" className="rounded-xl" />
                  </div>
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
                <Button variant="ghost" onClick={resetVideoForm} className="rounded-xl font-bold">Cancel</Button>
                <Button onClick={handleSaveVideo} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold px-8">{editingVideo ? "Update Video" : "Save Video"}</Button>
              </div>
            </motion.div>
          </div>
        )}

        {showPartnerForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-sage-950/60 backdrop-blur-sm" onClick={resetPartnerForm} />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
                <div className="bg-sage-800 p-8 text-white flex justify-between items-center">
                  <h2 className="text-2xl font-black">{editingPartner ? "Edit Partner" : "Add New Partner"}</h2>
                  <Button variant="ghost" size="icon" onClick={resetPartnerForm} className="text-white/60 hover:text-white">
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
                  <DragDropImageUpload
                      value={newPartner.logo_url}
                      onChange={(url) => setNewPartner({...newPartner, logo_url: url})}
                      bucket="photos"
                      folder="partners"
                      label="Partner Logo"
                    />
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
                  <Button variant="ghost" onClick={resetPartnerForm} className="rounded-xl font-bold">Cancel</Button>
                  <Button onClick={handleSavePartner} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold px-8">{editingPartner ? "Update Partner" : "Save Partner"}</Button>
                </div>
              </motion.div>
            </div>
          )}

          {showPhotoForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-sage-950/60 backdrop-blur-sm" onClick={resetPhotoForm} />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
                <div className="bg-sage-800 p-8 text-white flex justify-between items-center">
                  <h2 className="text-2xl font-black">{editingPhoto ? "Edit Photo" : "Add New Photo"}</h2>
                  <Button variant="ghost" size="icon" onClick={resetPhotoForm} className="text-white/60 hover:text-white">
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-sage-800">Photo File</label>
                      {editingPhoto && editingPhoto.url && !selectedFile && (
                        <div className="mb-2 rounded-xl overflow-hidden border border-sage-200">
                          <img src={editingPhoto.url} alt="Current" className="w-full h-40 object-cover" />
                          <p className="text-xs text-sage-400 p-2 text-center">Current photo (drop a new file to replace)</p>
                        </div>
                      )}
                      <div
                        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setSelectedFile(f); }}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => document.getElementById('photo-upload')?.click()}
                        className="flex items-center justify-center gap-3 w-full h-32 border-2 border-dashed border-sage-200 rounded-xl cursor-pointer hover:border-terracotta-400 hover:bg-sage-50 transition-colors"
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="photo-upload"
                        />
                          {selectedFile ? (
                            <div className="text-center">
                              <ImageIcon className="w-8 h-8 mx-auto text-terracotta-500 mb-2" />
                              <p className="text-sm text-sage-800 font-medium">{selectedFile.name}</p>
                              <p className="text-xs text-terracotta-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload className="w-8 h-8 mx-auto text-terracotta-400 mb-2" />
                              <p className="text-sm text-terracotta-500 font-medium">Drag & drop or click to upload</p>
                              <p className="text-xs text-terracotta-400">JPG, PNG, GIF up to 10MB</p>
                            </div>
                          )}
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
                  <Button variant="ghost" onClick={resetPhotoForm} className="rounded-xl font-bold">Cancel</Button>
                  <Button onClick={handleSavePhoto} disabled={uploading || (!editingPhoto && !selectedFile)} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold px-8 disabled:opacity-50">
                    {uploading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Uploading...
                      </span>
                    ) : editingPhoto ? "Update Photo" : "Upload Photo"}
                  </Button>
                </div>
              </motion.div>
            </div>
          )}

            {showMemberForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-sage-950/60 backdrop-blur-sm" onClick={resetMemberForm} />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
                <div className="bg-sage-800 p-8 text-white flex justify-between items-center">
                  <h2 className="text-2xl font-black">{editingMember ? t('admin.members.edit') : t('admin.members.add')}</h2>
                  <Button variant="ghost" size="icon" onClick={resetMemberForm} className="text-white/60 hover:text-white">
                    <X className="w-6 h-6" />
                  </Button>
                </div>
                <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">{t('admin.members.photo')}</label>
                    <div className="flex items-center gap-6">
                      {(memberPhotoFile || editingMember?.photo_url) && (
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-sage-100 flex-shrink-0">
                          <img
                            src={memberPhotoFile ? URL.createObjectURL(memberPhotoFile) : editingMember?.photo_url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                        <div className="flex-grow">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && setMemberPhotoFile(e.target.files[0])}
                            className="hidden"
                            id="member-photo-upload"
                          />
                          <div
                            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setMemberPhotoFile(f); }}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => document.getElementById('member-photo-upload')?.click()}
                            className="flex items-center justify-center gap-3 w-full h-24 border-2 border-dashed border-sage-200 rounded-xl cursor-pointer hover:border-terracotta-400 hover:bg-sage-50 transition-colors"
                          >
                            <div className="text-center">
                              <Upload className="w-6 h-6 mx-auto text-terracotta-400 mb-1" />
                              <p className="text-sm text-terracotta-500 font-medium">{t('admin.members.uploadPhoto')}</p>
                              <p className="text-xs text-sage-400">Drag & drop or click</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-sage-800">{t('admin.members.photoUrl')}</label>
                      <Input value={newMember.photo_url} onChange={e => setNewMember({...newMember, photo_url: e.target.value})} placeholder="/images/photo.jpg or https://..." className="rounded-xl" />
                      <p className="text-xs text-sage-400">{t('admin.members.photoUrlHint')}</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-sage-800">{t('admin.members.name')}</label>
                      <Input value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} placeholder="Full name" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-sage-800">{t('admin.members.order')}</label>
                      <Input type="number" value={newMember.display_order} onChange={e => setNewMember({...newMember, display_order: parseInt(e.target.value) || 0})} className="rounded-xl" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-sage-800">{t('admin.members.roleEn')}</label>
                      <Input value={newMember.role_en} onChange={e => setNewMember({...newMember, role_en: e.target.value})} placeholder="Role in English" className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-sage-800">{t('admin.members.roleFr')}</label>
                      <Input value={newMember.role_fr} onChange={e => setNewMember({...newMember, role_fr: e.target.value})} placeholder="Rôle en Français" className="rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">{t('admin.members.bioEn')}</label>
                    <Textarea value={newMember.bio_en} onChange={e => setNewMember({...newMember, bio_en: e.target.value})} placeholder="Short bio in English" className="rounded-xl min-h-[80px]" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-sage-800">{t('admin.members.bioFr')}</label>
                    <Textarea value={newMember.bio_fr} onChange={e => setNewMember({...newMember, bio_fr: e.target.value})} placeholder="Courte bio en Français" className="rounded-xl min-h-[80px]" />
                  </div>
                </div>
                <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-sage-100">
                  <Button variant="ghost" onClick={resetMemberForm} className="rounded-xl font-bold">{t('admin.members.cancel')}</Button>
                  <Button onClick={handleSaveMember} disabled={uploadingMember} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold px-8 disabled:opacity-50">
                    {uploadingMember ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Saving...
                      </span>
                    ) : t('admin.members.save')}
                  </Button>
                </div>
              </motion.div>
            </div>
            )}

            {showNewsForm && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-sage-950/60 backdrop-blur-sm" onClick={resetNewsForm} />
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
                  <div className="bg-sage-800 p-8 text-white flex justify-between items-center">
                    <h2 className="text-2xl font-black">{editingNews ? t('admin.news.edit') : t('admin.news.add')}</h2>
                    <Button variant="ghost" size="icon" onClick={resetNewsForm} className="text-white/60 hover:text-white">
                      <X className="w-6 h-6" />
                    </Button>
                  </div>
                  <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-sage-800">{t('admin.news.titleEn')}</label>
                        <Input value={newNews.title_en} onChange={e => setNewNews({...newNews, title_en: e.target.value})} placeholder={t('admin.news.placeholderTitleEn')} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-sage-800">{t('admin.news.titleFr')}</label>
                        <Input value={newNews.title_fr} onChange={e => setNewNews({...newNews, title_fr: e.target.value})} placeholder={t('admin.news.placeholderTitleFr')} className="rounded-xl" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-sage-800">{t('admin.news.contentEn')}</label>
                      <Textarea value={newNews.content_en} onChange={e => setNewNews({...newNews, content_en: e.target.value})} placeholder={t('admin.news.placeholderContentEn')} className="rounded-xl min-h-[120px]" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-sage-800">{t('admin.news.contentFr')}</label>
                      <Textarea value={newNews.content_fr} onChange={e => setNewNews({...newNews, content_fr: e.target.value})} placeholder={t('admin.news.placeholderContentFr')} className="rounded-xl min-h-[120px]" />
                    </div>
                    <DragDropImageUpload
                        value={newNews.image_url}
                        onChange={(url) => setNewNews({...newNews, image_url: url})}
                        bucket="photos"
                        folder="news"
                        label={t('admin.news.imageUrl')}
                      />
                  </div>
                  <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-sage-100">
                    <Button variant="ghost" onClick={resetNewsForm} className="rounded-xl font-bold">{t('admin.cancel')}</Button>
                    <Button onClick={handleSaveNews} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold px-8">
                      {t('admin.news.save')}
                    </Button>
                  </div>
                </motion.div>
              </div>
              )}

              {showProjectForm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-sage-950/60 backdrop-blur-sm" onClick={resetProjectForm} />
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
                    <div className="bg-sage-800 p-8 text-white flex justify-between items-center">
                      <h2 className="text-2xl font-black">{editingProject ? t('admin.projects.edit') : t('admin.projects.add')}</h2>
                      <Button variant="ghost" size="icon" onClick={resetProjectForm} className="text-white/60 hover:text-white">
                        <X className="w-6 h-6" />
                      </Button>
                    </div>
                    <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-sage-800">{t('admin.projects.titleEn')}</label>
                          <Input value={newProject.title_en} onChange={e => setNewProject({...newProject, title_en: e.target.value})} placeholder="Project title in English" className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-sage-800">{t('admin.projects.titleFr')}</label>
                          <Input value={newProject.title_fr} onChange={e => setNewProject({...newProject, title_fr: e.target.value})} placeholder="Titre du projet en Français" className="rounded-xl" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-sage-800">{t('admin.projects.descEn')}</label>
                        <Textarea value={newProject.description_en} onChange={e => setNewProject({...newProject, description_en: e.target.value})} placeholder="Description in English" className="rounded-xl min-h-[120px]" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-sage-800">{t('admin.projects.descFr')}</label>
                        <Textarea value={newProject.description_fr} onChange={e => setNewProject({...newProject, description_fr: e.target.value})} placeholder="Description en Français" className="rounded-xl min-h-[120px]" />
                      </div>
                      <DragDropImageUpload
                          value={newProject.image_url}
                          onChange={(url) => setNewProject({...newProject, image_url: url})}
                          bucket="photos"
                          folder="projects"
                          label={t('admin.projects.imageUrl')}
                        />
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-sage-800">{t('admin.projects.categoryEn')}</label>
                          <Input value={newProject.category_en} onChange={e => setNewProject({...newProject, category_en: e.target.value})} placeholder="Conservation" className="rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-sage-800">{t('admin.projects.categoryFr')}</label>
                          <Input value={newProject.category_fr} onChange={e => setNewProject({...newProject, category_fr: e.target.value})} placeholder="Conservation" className="rounded-xl" />
                        </div>
                      </div>
                    </div>
                    <div className="p-8 bg-slate-50 flex justify-end gap-4 border-t border-sage-100">
                      <Button variant="ghost" onClick={resetProjectForm} className="rounded-xl font-bold">{t('admin.cancel')}</Button>
                      <Button onClick={handleSaveProject} className="bg-terracotta-500 hover:bg-sage-600 rounded-xl font-bold px-8">
                        {t('admin.projects.save')}
                      </Button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
    </div>
  );
}

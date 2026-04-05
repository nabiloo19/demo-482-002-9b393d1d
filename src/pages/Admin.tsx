import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Trash2, Plus, LogOut, ArrowLeft, Pencil, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ThemeFormData {
  theme: string;
  excerpt: string;
  translation: string;
  frequency: number;
  x: number;
  y: number;
  color_variant: string;
}

interface ThemeRow {
  id: string;
  theme: string;
  excerpt: string | null;
  translation: string | null;
  frequency: number;
  x: number;
  y: number;
  color_variant: string;
  banner_url: string | null;
  audio_url: string | null;
  video_url: string | null;
  created_at: string;
}

const COLOR_VARIANTS = [
  { value: "honey", label: "Honey", hsl: "38 85% 52%" },
  { value: "amber", label: "Amber", hsl: "35 80% 55%" },
  { value: "saffron", label: "Saffron", hsl: "45 90% 50%" },
  { value: "sand", label: "Sand", hsl: "32 60% 58%" },
  { value: "gold", label: "Gold", hsl: "40 75% 60%" },
] as const;

const REAL_MADRID = {
  motto: "¡Hala Madrid y nada más!",
  moments: [
    { title: "Ramos 92:48", desc: "The header that shook Lisbon. Stoppage time. La Décima was born.", icon: "💥" },
    { title: "Zidane's Volley", desc: "Glasgow 2002. Left foot. Champions League final. The most beautiful goal ever scored.", icon: "🎯" },
    { title: "La Décima", desc: "Ten European Cups. Decades of waiting. One night in Lisbon changed everything.", icon: "🏆" },
    { title: "Cristiano: SIUUUU!", desc: "450 goals. The man who made the impossible routine. The greatest scorer in club history.", icon: "⚡" },
    { title: "Di Stéfano's Legacy", desc: "The man who built the myth. Five consecutive European Cups. The original galáctico.", icon: "👑" },
    { title: "Manita at Camp Nou", desc: "5-0. November 2010. The night Barcelona had no answers. Pure Mourinho masterclass.", icon: "🔥" },
  ],
  stats: [
    { label: "Champions League", value: "15" },
    { label: "La Liga", value: "36" },
    { label: "Copa del Rey", value: "20" },
    { label: "Ballon d'Or Winners", value: "12" },
  ],
  quotes: [
    { text: "Madrid never dies.", author: "Everyone who's watched them in the 90th minute" },
    { text: "If you can't buy them, beat them. If you can't beat them, buy them.", author: "The Bernabéu philosophy" },
    { text: "I'm not a defender, I'm a goalscorer who plays at the back.", author: "Sergio Ramos, probably" },
  ],
};

const randomPos = () => Math.floor(15 + Math.random() * 70);
const randomColor = () => COLOR_VARIANTS[Math.floor(Math.random() * COLOR_VARIANTS.length)].value;

const Admin = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [themes, setThemes] = useState<ThemeRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ThemeFormData>({
    theme: "",
    excerpt: "",
    translation: "",
    frequency: 10,
    x: randomPos(),
    y: randomPos(),
    color_variant: randomColor(),
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [translationFile, setTranslationFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [submissions, setSubmissions] = useState<{ id: string; name: string; email: string; message: string; created_at: string }[]>([]);
  const [activeTab, setActiveTab] = useState<"themes" | "submissions">("themes");
  const [deleteSubmissionId, setDeleteSubmissionId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchThemes();
      fetchSubmissions();
    }
  }, [session]);

  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setSubmissions(data);
  };

  const handleDeleteSubmission = async (id: string) => {
    const { error } = await supabase.from("submissions").delete().eq("id", id);
    if (!error) fetchSubmissions();
    setDeleteSubmissionId(null);
  };

  const fetchThemes = async () => {
    const { data, error } = await supabase
      .from("themes")
      .select("*")
      .order("frequency", { ascending: false });
    if (!error && data) setThemes(data as ThemeRow[]);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    }
    setAuthLoading(false);
  };

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("theme-media").upload(path, file);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      return null;
    }
    const { data } = supabase.storage.from("theme-media").getPublicUrl(path);
    return data.publicUrl;
  };

  const resetForm = () => {
    setFormData({ theme: "", excerpt: "", translation: "", frequency: 10, x: randomPos(), y: randomPos(), color_variant: randomColor() });
    setBannerFile(null);
    setAudioFile(null);
    setVideoFile(null);
    setTranslationFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (t: ThemeRow) => {
    setEditingId(t.id);
    setFormData({
      theme: t.theme,
      excerpt: t.excerpt || "",
      translation: t.translation || "",
      frequency: t.frequency,
      x: t.x,
      y: t.y,
      color_variant: t.color_variant,
    });
    setBannerFile(null);
    setAudioFile(null);
    setVideoFile(null);
    setTranslationFile(null);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.theme.trim()) {
      toast({ title: "Theme name is required", variant: "destructive" });
      return;
    }
    setSaving(true);

    let banner_url: string | null = null;
    let audio_url: string | null = null;
    let video_url: string | null = null;

    if (bannerFile) {
      banner_url = await uploadFile(bannerFile, "banners");
      if (!banner_url) { setSaving(false); return; }
    }
    if (audioFile) {
      audio_url = await uploadFile(audioFile, "audio");
      if (!audio_url) { setSaving(false); return; }
    }
    if (videoFile) {
      video_url = await uploadFile(videoFile, "videos");
      if (!video_url) { setSaving(false); return; }
    }

    // Read translation file content if provided
    let translationText = formData.translation;
    if (translationFile) {
      translationText = await translationFile.text();
    }

    const payload: any = {
      theme: formData.theme.trim(),
      excerpt: formData.excerpt.trim() || null,
      translation: translationText.trim() || null,
      frequency: Math.min(100, Math.max(1, formData.frequency)),
      x: formData.x,
      y: formData.y,
      color_variant: formData.color_variant,
    };
    if (banner_url) payload.banner_url = banner_url;
    if (audio_url) payload.audio_url = audio_url;
    if (video_url) payload.video_url = video_url;

    let error;
    if (editingId) {
      ({ error } = await supabase.from("themes").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("themes").insert(payload));
    }

    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: editingId ? "Theme updated!" : "Theme added!" });
      resetForm();
      fetchThemes();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("themes").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    } else {
      fetchThemes();
    }
    setDeleteConfirmId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="grain-overlay" />
        <div className="w-full max-w-sm bg-card/90 backdrop-blur-xl rounded-2xl p-8 shadow-overlay relative z-10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-6 font-body text-sm"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="font-heading text-2xl text-foreground mb-1">Admin</h1>
          <p className="font-body text-sm text-muted-foreground mb-6">
            Sign in to manage themes
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border/50 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/30 transition"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border/50 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/30 transition"
            />
            <button
              type="submit"
              disabled={authLoading}
              className="w-full px-5 py-3 bg-primary text-primary-foreground font-body text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {authLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="grain-overlay" />
      <div className="relative z-10">
        <div className="flex items-center justify-between px-6 py-5 md:px-10 border-b border-border/30 bg-card/40 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors font-body text-sm"
            >
              <ArrowLeft size={16} /> Home
            </button>
            <h1 className="font-heading text-xl text-foreground">Admin</h1>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex gap-1 mb-8 bg-card/60 rounded-lg p-1 w-fit">
            <button
              onClick={() => setActiveTab("themes")}
              className={`px-4 py-2 rounded-md font-body text-sm transition-colors ${activeTab === "themes" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Themes
            </button>
            <button
              onClick={() => setActiveTab("submissions")}
              className={`px-4 py-2 rounded-md font-body text-sm transition-colors flex items-center gap-2 ${activeTab === "submissions" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Mail size={14} />
              Submissions
              {submissions.length > 0 && (
                <span className="bg-accent/20 text-accent text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                  {submissions.length}
                </span>
              )}
            </button>
          </div>

          {activeTab === "themes" && <>
            {!showForm && (
              <button
                onClick={() => { resetForm(); setShowForm(true); }}
                className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground font-body text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors mb-8"
              >
                <Plus size={16} /> Add New Theme
              </button>
            )}

            {showForm && (
              <form onSubmit={handleSave} className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-soft mb-8 space-y-5">
                <h2 className="font-heading text-lg text-foreground">
                  {editingId ? "Edit Theme" : "New Theme"}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Theme Name *</label>
                    <input
                      type="text"
                      value={formData.theme}
                      onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                      placeholder="e.g. The Coffee Ritual"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border/50 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/30 transition"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Color Variant</label>
                    <select
                      value={formData.color_variant}
                      onChange={(e) => setFormData({ ...formData, color_variant: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border/50 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition"
                    >
                      {COLOR_VARIANTS.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                    Frequency (1-100)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={1}
                      max={100}
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: Number(e.target.value) })}
                      className="flex-1 accent-accent"
                    />
                    <span className="font-body text-sm text-foreground w-10 text-center tabular-nums">{formData.frequency}</span>
                  </div>
                </div>

                <div>
                  <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Excerpt</label>
                  <textarea
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="A poetic description of this theme..."
                    className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border/50 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/30 transition resize-none"
                  />
                </div>

                <div>
                  <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Translation / Subtitle File (.txt)</label>
                  <label className="flex items-center gap-2 px-4 py-3 rounded-lg bg-background/50 border border-border/50 cursor-pointer hover:bg-background/70 transition font-body text-sm text-muted-foreground">
                    <Upload size={16} />
                    {translationFile ? translationFile.name : formData.translation ? "File already uploaded ✓" : "Choose .txt file..."}
                    <input type="file" accept=".txt,.srt" onChange={(e) => setTranslationFile(e.target.files?.[0] || null)} className="hidden" />
                  </label>
                  <p className="font-body text-[10px] text-muted-foreground/60 mt-1">
                    Format each line as: <code className="bg-background/80 px-1 rounded">00:00:05 - 00:00:12 | Your subtitle text here</code>
                  </p>
                  {formData.translation && !translationFile && (
                    <details className="mt-2">
                      <summary className="font-body text-[10px] text-accent cursor-pointer">Preview current subtitles</summary>
                      <pre className="mt-1 p-3 rounded-lg bg-background/50 border border-border/30 font-body text-[11px] text-muted-foreground overflow-x-auto max-h-32 overflow-y-auto whitespace-pre-wrap">{formData.translation}</pre>
                    </details>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Banner Image</label>
                    <label className="flex items-center gap-2 px-4 py-3 rounded-lg bg-background/50 border border-border/50 cursor-pointer hover:bg-background/70 transition font-body text-sm text-muted-foreground">
                      <Upload size={16} />
                      {bannerFile ? bannerFile.name : "Choose image..."}
                      <input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} className="hidden" />
                    </label>
                  </div>
                  <div>
                    <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Audio File</label>
                    <label className="flex items-center gap-2 px-4 py-3 rounded-lg bg-background/50 border border-border/50 cursor-pointer hover:bg-background/70 transition font-body text-sm text-muted-foreground">
                      <Upload size={16} />
                      {audioFile ? audioFile.name : "Choose audio..."}
                      <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} className="hidden" />
                    </label>
                  </div>
                  <div>
                    <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Video File</label>
                    <label className="flex items-center gap-2 px-4 py-3 rounded-lg bg-background/50 border border-border/50 cursor-pointer hover:bg-background/70 transition font-body text-sm text-muted-foreground">
                      <Upload size={16} />
                      {videoFile ? videoFile.name : "Choose video..."}
                      <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-primary text-primary-foreground font-body text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {saving ? "Saving..." : editingId ? "Update Theme" : "Save Theme"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-secondary text-secondary-foreground font-body text-sm font-medium rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {themes.length === 0 && (
                <p className="font-body text-sm text-muted-foreground text-center py-12">
                  No themes yet. Add your first theme above.
                </p>
              )}
              {themes.map((t) => {
                const colorInfo = COLOR_VARIANTS.find((c) => c.value === t.color_variant);
                return (
                  <div key={t.id} className="flex items-center gap-4 bg-card/80 backdrop-blur-sm rounded-xl p-4 shadow-soft">
                    {t.banner_url && (
                      <img src={t.banner_url} alt={t.theme} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading text-lg text-foreground">{t.theme}</h3>
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ background: colorInfo ? `hsl(${colorInfo.hsl})` : "hsl(35, 80%, 55%)" }}
                        />
                        <span className="font-body text-xs text-muted-foreground">
                          freq: {t.frequency}
                        </span>
                      </div>
                      {t.excerpt && (
                        <p className="font-body text-xs text-muted-foreground truncate mt-0.5">{t.excerpt}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1">
                        {t.audio_url && <span className="font-body text-[10px] uppercase tracking-wider text-accent">♫ Audio</span>}
                        {t.video_url && <span className="font-body text-[10px] uppercase tracking-wider text-accent">▶ Video</span>}
                        {t.translation && <span className="font-body text-[10px] uppercase tracking-wider text-accent">📝 Subtitles</span>}
                      </div>
                    </div>
                    <button onClick={() => startEdit(t)} className="p-2 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0" aria-label="Edit theme">
                      <Pencil size={16} />
                    </button>
                    {deleteConfirmId === t.id ? (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => handleDelete(t.id)} className="px-3 py-1 bg-destructive text-destructive-foreground font-body text-xs rounded-lg hover:bg-destructive/90 transition-colors">Confirm</button>
                        <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1 bg-secondary text-secondary-foreground font-body text-xs rounded-lg hover:bg-secondary/80 transition-colors">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirmId(t.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0" aria-label="Delete theme">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Real Madrid Full Theme */}
            <div className="mt-16 border-t border-border/20 pt-8 space-y-6">
              <div className="text-center">
                <p className="font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">The Beautiful Game</p>
                <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-1">⚽ La Sala VIP</h2>
                <p className="font-heading italic text-accent text-lg">{REAL_MADRID.motto}</p>
              </div>

              {/* Stats bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {REAL_MADRID.stats.map((s) => (
                  <div key={s.label} className="bg-card/80 rounded-xl p-4 text-center border border-border/30">
                    <p className="font-heading text-3xl text-accent">{s.value}</p>
                    <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Iconic Moments */}
              <div>
                <h3 className="font-heading text-lg text-foreground mb-3">Iconic Moments</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {REAL_MADRID.moments.map((m) => (
                    <div key={m.title} className="bg-card/60 backdrop-blur-sm rounded-xl p-5 border border-border/30 hover:border-accent/30 transition-colors group">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{m.icon}</span>
                        <div>
                          <h4 className="font-heading text-base text-foreground group-hover:text-accent transition-colors">{m.title}</h4>
                          <p className="font-body text-xs text-muted-foreground mt-1 leading-relaxed">{m.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quotes */}
              <div>
                <h3 className="font-heading text-lg text-foreground mb-3">From the Stands</h3>
                <div className="space-y-3">
                  {REAL_MADRID.quotes.map((q, i) => (
                    <div key={i} className="bg-background/50 rounded-xl p-5 border-l-2 border-accent/50">
                      <blockquote className="font-heading italic text-base text-foreground/80">"{q.text}"</blockquote>
                      <p className="font-body text-[10px] uppercase tracking-widest text-muted-foreground mt-2">{q.author}</p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="font-body text-xs text-muted-foreground/40 text-center pt-4">
                Hasta el final, vamos Real ✦
              </p>
            </div>
          </>}

          {activeTab === "submissions" && (
            <div className="space-y-3">
              {submissions.length === 0 && (
                <p className="font-body text-sm text-muted-foreground text-center py-12">No submissions yet.</p>
              )}
              {submissions.map((s) => (
                <div key={s.id} className="bg-card/80 backdrop-blur-sm rounded-xl p-5 shadow-soft space-y-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-heading text-base text-foreground">{s.name}</h3>
                        <span className="font-body text-xs text-muted-foreground">{s.email}</span>
                      </div>
                      <p className="font-body text-sm text-muted-foreground/80 mt-2 whitespace-pre-wrap leading-relaxed">{s.message}</p>
                      <p className="font-body text-[10px] text-muted-foreground/50 mt-2 uppercase tracking-wider">
                        {new Date(s.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {deleteSubmissionId === s.id ? (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => handleDeleteSubmission(s.id)} className="px-3 py-1 bg-destructive text-destructive-foreground font-body text-xs rounded-lg hover:bg-destructive/90 transition-colors">Confirm</button>
                        <button onClick={() => setDeleteSubmissionId(null)} className="px-3 py-1 bg-secondary text-secondary-foreground font-body text-xs rounded-lg hover:bg-secondary/80 transition-colors">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteSubmissionId(s.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0" aria-label="Delete submission">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
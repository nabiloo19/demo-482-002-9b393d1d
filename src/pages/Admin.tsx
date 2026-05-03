import { useState, useEffect, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Trash2, Plus, LogOut, ArrowLeft, Pencil, Mail, Film } from "lucide-react";
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

interface SnippetRow {
  id: string;
  theme_id: string;
  video_url: string | null;
  audio_url: string | null;
  caption: string | null;
  translation: string | null;
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
  stats: [
    { label: "Champions League", value: "15" },
    { label: "La Liga", value: "36" },
    { label: "Copa del Rey", value: "20" },
    { label: "Ballon d'Or Winners", value: "12" },
  ],
};

const randomPos = () => Math.floor(15 + Math.random() * 70);
const randomColor = () => COLOR_VARIANTS[Math.floor(Math.random() * COLOR_VARIANTS.length)].value;

const adminThemeStyle = {
  "--background": "44 70% 95%",
  "--foreground": "221 48% 18%",
  "--card": "0 0% 100%",
  "--card-foreground": "221 48% 18%",
  "--popover": "0 0% 100%",
  "--popover-foreground": "221 48% 18%",
  "--primary": "45 95% 54%",
  "--primary-foreground": "221 48% 16%",
  "--secondary": "221 48% 18%",
  "--secondary-foreground": "44 70% 95%",
  "--muted": "44 40% 88%",
  "--muted-foreground": "221 20% 36%",
  "--accent": "45 95% 54%",
  "--accent-foreground": "221 48% 16%",
  "--border": "44 32% 78%",
  "--input": "44 32% 78%",
  "--ring": "45 95% 54%",
  backgroundColor: "hsl(44 70% 95%)",
  backgroundImage:
    "radial-gradient(circle at 12% 16%, hsl(45 95% 54% / 0.24), transparent 24%), radial-gradient(circle at 88% 10%, hsl(221 48% 18% / 0.12), transparent 26%), linear-gradient(180deg, hsl(0 0% 100%), hsl(45 58% 93%))",
} as CSSProperties;

/* ── Extracted form component ── */
const ThemeForm = ({
  formData, setFormData, editingId, saving,
  bannerFile, setBannerFile, audioFile, setAudioFile,
  videoFile, setVideoFile, translationFile, setTranslationFile,
  onSubmit, onCancel,
}: {
  formData: ThemeFormData;
  setFormData: (d: ThemeFormData) => void;
  editingId: string | null;
  saving: boolean;
  bannerFile: File | null; setBannerFile: (f: File | null) => void;
  audioFile: File | null; setAudioFile: (f: File | null) => void;
  videoFile: File | null; setVideoFile: (f: File | null) => void;
  translationFile: File | null; setTranslationFile: (f: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}) => (
  <form onSubmit={onSubmit} className="mb-4 space-y-5 rounded-[1.75rem] border border-border/60 bg-card/92 p-6 md:p-8 shadow-overlay backdrop-blur-xl">
    <h2 className="font-heading text-lg text-foreground">
      {editingId ? "Edit Theme" : "New Theme"}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Theme Name *</label>
        <input type="text" value={formData.theme} onChange={(e) => setFormData({ ...formData, theme: e.target.value })} placeholder="e.g. The Coffee Ritual" required className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border/50 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/30 transition" />
      </div>
      <div>
        <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Color Variant</label>
        <select value={formData.color_variant} onChange={(e) => setFormData({ ...formData, color_variant: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border/50 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition">
          {COLOR_VARIANTS.map((c) => (<option key={c.value} value={c.value}>{c.label}</option>))}
        </select>
      </div>
    </div>
    <div>
      <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Frequency (1-100)</label>
      <div className="flex items-center gap-4">
        <input type="range" min={1} max={100} value={formData.frequency} onChange={(e) => setFormData({ ...formData, frequency: Number(e.target.value) })} className="flex-1 accent-accent" />
        <span className="font-body text-sm text-foreground w-10 text-center tabular-nums">{formData.frequency}</span>
      </div>
    </div>
    <div>
      <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Excerpt</label>
      <textarea rows={3} value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} placeholder="A poetic description of this theme..." className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border/50 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/30 transition resize-none" />
    </div>
    <div>
      <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Translation / Subtitle File (.txt)</label>
      <label className="flex items-center gap-2 px-4 py-3 rounded-lg bg-background/50 border border-border/50 cursor-pointer hover:bg-background/70 transition font-body text-sm text-muted-foreground">
        <Upload size={16} />
        {translationFile ? translationFile.name : formData.translation ? "File already uploaded ✓" : "Choose .txt file..."}
        <input type="file" accept=".txt,.srt" onChange={(e) => setTranslationFile(e.target.files?.[0] || null)} className="hidden" />
      </label>
      <p className="font-body text-[10px] text-muted-foreground/60 mt-1">Format: <code className="bg-background/80 px-1 rounded">00:00:05 - 00:00:12 | Subtitle text</code></p>
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
          <Upload size={16} />{bannerFile ? bannerFile.name : "Choose image..."}
          <input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} className="hidden" />
        </label>
      </div>
      <div>
        <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Audio File</label>
        <label className="flex items-center gap-2 px-4 py-3 rounded-lg bg-background/50 border border-border/50 cursor-pointer hover:bg-background/70 transition font-body text-sm text-muted-foreground">
          <Upload size={16} />{audioFile ? audioFile.name : "Choose audio..."}
          <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files?.[0] || null)} className="hidden" />
        </label>
      </div>
      <div>
        <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Video File</label>
        <label className="flex items-center gap-2 px-4 py-3 rounded-lg bg-background/50 border border-border/50 cursor-pointer hover:bg-background/70 transition font-body text-sm text-muted-foreground">
          <Upload size={16} />{videoFile ? videoFile.name : "Choose video..."}
          <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="hidden" />
        </label>
      </div>
    </div>
    <div className="flex gap-3 pt-2">
      <button type="submit" disabled={saving} className="px-6 py-3 bg-primary text-primary-foreground font-body text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
        {saving ? "Saving..." : editingId ? "Update Theme" : "Save Theme"}
      </button>
      <button type="button" onClick={onCancel} className="px-6 py-3 bg-secondary text-secondary-foreground font-body text-sm font-medium rounded-lg hover:bg-secondary/80 transition-colors">
        Cancel
      </button>
    </div>
  </form>
);

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
    theme: "", excerpt: "", translation: "", frequency: 10,
    x: randomPos(), y: randomPos(), color_variant: randomColor(),
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [translationFile, setTranslationFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [submissions, setSubmissions] = useState<{ id: string; name: string; email: string; message: string; created_at: string }[]>([]);
  const [activeTab, setActiveTab] = useState<"themes" | "snippets" | "submissions">("themes");
  const [deleteSubmissionId, setDeleteSubmissionId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Snippet state
  const [snippets, setSnippets] = useState<SnippetRow[]>([]);
  const [snippetThemeId, setSnippetThemeId] = useState<string>("");
  const [snippetCaption, setSnippetCaption] = useState("");
  const [snippetVideoFile, setSnippetVideoFile] = useState<File | null>(null);
  const [snippetAudioFile, setSnippetAudioFile] = useState<File | null>(null);
  const [snippetTranslationFile, setSnippetTranslationFile] = useState<File | null>(null);
  const [snippetSaving, setSnippetSaving] = useState(false);
  const [deleteSnippetId, setDeleteSnippetId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { if (session) { fetchThemes(); fetchSubmissions(); fetchSnippets(); } }, [session]);

  const fetchSubmissions = async () => {
    const { data, error } = await supabase.from("submissions").select("*").order("created_at", { ascending: false });
    if (!error && data) setSubmissions(data);
  };

  const fetchSnippets = async () => {
    const { data, error } = await supabase.from("snippets").select("*").order("created_at", { ascending: false });
    if (!error && data) setSnippets(data as SnippetRow[]);
  };

  const handleSaveSnippet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!snippetThemeId) { toast({ title: "Pick a theme for this snippet", variant: "destructive" }); return; }
    if (!snippetVideoFile && !snippetAudioFile) { toast({ title: "Add a video or audio clip", variant: "destructive" }); return; }
    setSnippetSaving(true);

    let video_url: string | null = null;
    let audio_url: string | null = null;
    let translation: string | null = null;

    if (snippetVideoFile) { video_url = await uploadFile(snippetVideoFile, "snippets/videos"); if (!video_url) { setSnippetSaving(false); return; } }
    if (snippetAudioFile) { audio_url = await uploadFile(snippetAudioFile, "snippets/audio"); if (!audio_url) { setSnippetSaving(false); return; } }
    if (snippetTranslationFile) { translation = await snippetTranslationFile.text(); }

    const { error } = await supabase.from("snippets").insert({
      theme_id: snippetThemeId,
      video_url, audio_url, translation,
      caption: snippetCaption.trim() || null,
    });
    if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); }
    else {
      toast({ title: "Snippet added!" });
      setSnippetCaption(""); setSnippetVideoFile(null); setSnippetAudioFile(null); setSnippetTranslationFile(null);
      fetchSnippets();
    }
    setSnippetSaving(false);
  };

  const handleDeleteSnippet = async (id: string) => {
    const { error } = await supabase.from("snippets").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else fetchSnippets();
    setDeleteSnippetId(null);
  };

  const handleDeleteSubmission = async (id: string) => {
    const { error } = await supabase.from("submissions").delete().eq("id", id);
    if (!error) fetchSubmissions();
    setDeleteSubmissionId(null);
  };

  const fetchThemes = async () => {
    const { data, error } = await supabase.from("themes").select("*").order("frequency", { ascending: false });
    if (!error && data) setThemes(data as ThemeRow[]);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast({ title: "Login failed", description: error.message, variant: "destructive" });
    setAuthLoading(false);
  };

  const [resetSending, setResetSending] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Enter your email first", variant: "destructive" });
      return;
    }
    setResetSending(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setResetSending(false);
    if (error) {
      toast({ title: "Couldn't send reset email", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your inbox", description: "We sent you a password reset link." });
    }
  };

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("theme-media").upload(path, file);
    if (error) { toast({ title: "Upload failed", description: error.message, variant: "destructive" }); return null; }
    const { data } = supabase.storage.from("theme-media").getPublicUrl(path);
    return data.publicUrl;
  };

  const resetForm = () => {
    setFormData({ theme: "", excerpt: "", translation: "", frequency: 10, x: randomPos(), y: randomPos(), color_variant: randomColor() });
    setBannerFile(null); setAudioFile(null); setVideoFile(null); setTranslationFile(null);
    setEditingId(null); setShowForm(false);
  };

  const startEdit = (t: ThemeRow) => {
    setEditingId(t.id);
    setFormData({ theme: t.theme, excerpt: t.excerpt || "", translation: t.translation || "", frequency: t.frequency, x: t.x, y: t.y, color_variant: t.color_variant });
    setBannerFile(null); setAudioFile(null); setVideoFile(null); setTranslationFile(null);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.theme.trim()) { toast({ title: "Theme name is required", variant: "destructive" }); return; }
    setSaving(true);

    let banner_url: string | null = null;
    let audio_url: string | null = null;
    let video_url: string | null = null;

    if (bannerFile) { banner_url = await uploadFile(bannerFile, "banners"); if (!banner_url) { setSaving(false); return; } }
    if (audioFile) { audio_url = await uploadFile(audioFile, "audio"); if (!audio_url) { setSaving(false); return; } }
    if (videoFile) { video_url = await uploadFile(videoFile, "videos"); if (!video_url) { setSaving(false); return; } }

    let translationText = formData.translation;
    if (translationFile) { translationText = await translationFile.text(); }

    const payload: any = {
      theme: formData.theme.trim(), excerpt: formData.excerpt.trim() || null,
      translation: translationText.trim() || null,
      frequency: Math.min(100, Math.max(1, formData.frequency)),
      x: formData.x, y: formData.y, color_variant: formData.color_variant,
    };
    if (banner_url) payload.banner_url = banner_url;
    if (audio_url) payload.audio_url = audio_url;
    if (video_url) payload.video_url = video_url;

    let error;
    if (editingId) { ({ error } = await supabase.from("themes").update(payload).eq("id", editingId)); }
    else { ({ error } = await supabase.from("themes").insert(payload)); }

    if (error) { toast({ title: "Save failed", description: error.message, variant: "destructive" }); }
    else { toast({ title: editingId ? "Theme updated!" : "Theme added!" }); resetForm(); fetchThemes(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("themes").delete().eq("id", id);
    if (error) toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    else fetchThemes();
    setDeleteConfirmId(null);
  };

  const formProps = {
    formData, setFormData, editingId, saving,
    bannerFile, setBannerFile, audioFile, setAudioFile,
    videoFile, setVideoFile, translationFile, setTranslationFile,
    onSubmit: handleSave, onCancel: resetForm,
  };

  if (loading) {
    return (<div className="min-h-screen flex items-center justify-center" style={adminThemeStyle}><p className="font-body text-muted-foreground">Loading...</p></div>);
  }

  if (!session) {
    return (
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4" style={adminThemeStyle}>
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-56" style={{ backgroundImage: "linear-gradient(180deg, hsl(221 48% 18% / 0.12), transparent)" }} />
          <div className="absolute -left-16 top-24 h-64 w-64 rounded-full blur-3xl" style={{ background: "hsl(45 95% 54% / 0.22)" }} />
          <div className="absolute right-[-5rem] top-8 h-72 w-72 rounded-full blur-3xl" style={{ background: "hsl(221 48% 18% / 0.12)" }} />
        </div>
        <div className="grain-overlay" />
        <div className="w-full max-w-md bg-card/92 backdrop-blur-xl rounded-[2rem] p-8 shadow-overlay relative z-10 border border-border/60">
          <p className="font-body text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-3">Madrid-coded admin</p>
          <button onClick={() => navigate("/")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-6 font-body text-sm">
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-border/60 bg-secondary text-secondary-foreground shadow-soft">⚽</div>
            <div>
              <h1 className="font-heading text-2xl text-foreground mb-1">Real Madrid Control Room</h1>
              <p className="font-body text-sm text-muted-foreground">White, gold, and calm arrogance.</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border/60 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/40 transition" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border/60 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/40 transition" />
            <button type="submit" disabled={authLoading} className="w-full px-5 py-3 bg-primary text-primary-foreground font-body text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50">
              {authLoading ? "Signing in..." : "Enter the Bernabéu"}
            </button>
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetSending}
              className="w-full text-center font-body text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              {resetSending ? "Sending reset link..." : "Forgot your password?"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden" style={adminThemeStyle}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-64" style={{ backgroundImage: "linear-gradient(180deg, hsl(221 48% 18% / 0.08), transparent)" }} />
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full blur-3xl" style={{ background: "hsl(45 95% 54% / 0.18)" }} />
        <div className="absolute right-[-6rem] top-10 h-80 w-80 rounded-full blur-3xl" style={{ background: "hsl(221 48% 18% / 0.14)" }} />
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(45 95% 54% / 0.8), transparent)" }} />
      </div>
      <div className="grain-overlay" />
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-border/60 bg-card/72 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/")} className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors font-body text-sm">
                <ArrowLeft size={16} /> Home
              </button>
              <div className="hidden h-10 w-px bg-border/80 md:block" />
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border/60 bg-secondary text-secondary-foreground shadow-soft">⚽</div>
                <div>
                  <p className="font-body text-[10px] uppercase tracking-[0.35em] text-muted-foreground">Admin aesthetic</p>
                  <h1 className="font-heading text-xl md:text-2xl text-foreground">Real Madrid Control Room</h1>
                </div>
              </div>
            </div>
            <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm">
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 py-8 md:px-10">
          {/* Hero stats */}
          <section className="mb-8 grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
            <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/90 p-8 shadow-overlay">
              <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(135deg, hsl(221 48% 18% / 0.08), transparent 45%), radial-gradient(circle at top right, hsl(45 95% 54% / 0.18), transparent 36%)" }} />
              <div className="relative z-10">
                <p className="font-body text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-3">White. Gold. Heritage.</p>
                <h2 className="font-heading text-4xl md:text-5xl leading-none text-foreground mb-4">
                  Madridista<br /><span className="italic text-accent">Control Room</span>
                </h2>
                <p className="max-w-xl font-body text-sm md:text-base leading-relaxed text-muted-foreground">{REAL_MADRID.motto}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1 font-body text-[10px] uppercase tracking-[0.25em] text-foreground">Ramos 92:48</span>
                  <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1 font-body text-[10px] uppercase tracking-[0.25em] text-foreground">La Décima</span>
                  <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1 font-body text-[10px] uppercase tracking-[0.25em] text-foreground">Hala Madrid</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {REAL_MADRID.stats.map((s) => (
                <div key={s.label} className="rounded-[1.5rem] border border-border/60 bg-card/92 p-5 text-center shadow-soft">
                  <p className="font-heading text-4xl text-accent">{s.value}</p>
                  <p className="mt-2 font-body text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 rounded-full border border-border/60 bg-card/80 p-1.5 shadow-soft w-fit">
            <button onClick={() => setActiveTab("themes")} className={`px-4 py-2 rounded-full font-body text-xs uppercase tracking-[0.25em] transition-colors ${activeTab === "themes" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              Themes
            </button>
            <button onClick={() => setActiveTab("snippets")} className={`px-4 py-2 rounded-full font-body text-xs uppercase tracking-[0.25em] transition-colors flex items-center gap-2 ${activeTab === "snippets" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <Film size={14} /> Snippets
              {snippets.length > 0 && <span className="rounded-full bg-accent/20 px-1.5 py-0.5 text-[10px] font-medium text-accent">{snippets.length}</span>}
            </button>
            <button onClick={() => setActiveTab("submissions")} className={`px-4 py-2 rounded-full font-body text-xs uppercase tracking-[0.25em] transition-colors flex items-center gap-2 ${activeTab === "submissions" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <Mail size={14} /> Submissions
              {submissions.length > 0 && <span className="rounded-full bg-accent/20 px-1.5 py-0.5 text-[10px] font-medium text-accent">{submissions.length}</span>}
            </button>
          </div>

          {activeTab === "themes" && <>
            {/* Add new button + form at top only when creating new */}
            {!showForm && (
              <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground font-body text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors mb-8">
                <Plus size={16} /> Add New Theme
              </button>
            )}
            {showForm && !editingId && <ThemeForm {...formProps} />}

            {/* Theme list with inline editing */}
            <div className="space-y-3">
              {themes.length === 0 && <p className="font-body text-sm text-muted-foreground text-center py-12">No themes yet. Add your first theme above.</p>}
              {themes.map((t) => {
                const colorInfo = COLOR_VARIANTS.find((c) => c.value === t.color_variant);
                const isEditing = editingId === t.id && showForm;
                return (
                  <div key={t.id}>
                    <div className={`flex items-center gap-4 rounded-[1.5rem] border bg-card/92 p-4 shadow-soft backdrop-blur-xl ${isEditing ? "border-accent/60" : "border-border/50"}`}>
                      {t.banner_url && <img src={t.banner_url} alt={t.theme} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading text-lg text-foreground">{t.theme}</h3>
                          <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: colorInfo ? `hsl(${colorInfo.hsl})` : "hsl(35, 80%, 55%)" }} />
                          <span className="font-body text-xs text-muted-foreground">freq: {t.frequency}</span>
                        </div>
                        {t.excerpt && <p className="font-body text-xs text-muted-foreground truncate mt-0.5">{t.excerpt}</p>}
                        <div className="flex items-center gap-3 mt-1">
                          {t.audio_url && <span className="font-body text-[10px] uppercase tracking-wider text-accent">♫ Audio</span>}
                          {t.video_url && <span className="font-body text-[10px] uppercase tracking-wider text-accent">▶ Video</span>}
                          {t.translation && <span className="font-body text-[10px] uppercase tracking-wider text-accent">📝 Subtitles</span>}
                        </div>
                      </div>
                      <button onClick={() => startEdit(t)} className="p-2 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0" aria-label="Edit theme"><Pencil size={16} /></button>
                      {deleteConfirmId === t.id ? (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => handleDelete(t.id)} className="px-3 py-1 bg-destructive text-destructive-foreground font-body text-xs rounded-lg hover:bg-destructive/90 transition-colors">Confirm</button>
                          <button onClick={() => setDeleteConfirmId(null)} className="px-3 py-1 bg-secondary text-secondary-foreground font-body text-xs rounded-lg hover:bg-secondary/80 transition-colors">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirmId(t.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0" aria-label="Delete theme"><Trash2 size={16} /></button>
                      )}
                    </div>
                    {/* Inline edit form appears right below the theme */}
                    {isEditing && <div className="mt-2"><ThemeForm {...formProps} /></div>}
                  </div>
                );
              })}
            </div>
          </>}

          {activeTab === "snippets" && (
            <div className="space-y-6">
              {/* Upload form */}
              <form onSubmit={handleSaveSnippet} className="space-y-5 rounded-[1.75rem] border border-border/60 bg-card/92 p-6 md:p-8 shadow-overlay backdrop-blur-xl">
                <div>
                  <h2 className="font-heading text-lg text-foreground">Add a memory snippet</h2>
                  <p className="font-body text-xs text-muted-foreground mt-1">Short audio-visual clips (1–3 min). Bubbles play one at random; the refresh button shuffles to a new one.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Theme *</label>
                    <select value={snippetThemeId} onChange={(e) => setSnippetThemeId(e.target.value)} required className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border/50 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition">
                      <option value="">— Pick a theme —</option>
                      {themes.map((t) => (<option key={t.id} value={t.id}>{t.theme}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Caption (optional)</label>
                    <input type="text" value={snippetCaption} onChange={(e) => setSnippetCaption(e.target.value)} placeholder="e.g. Grandmother's morning ritual" className="w-full px-4 py-3 rounded-lg bg-background/50 border border-border/50 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring/30 transition" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Video Clip</label>
                    <label className="flex items-center gap-2 px-4 py-3 rounded-lg bg-background/50 border border-border/50 cursor-pointer hover:bg-background/70 transition font-body text-sm text-muted-foreground">
                      <Upload size={16} />{snippetVideoFile ? snippetVideoFile.name : "Choose video..."}
                      <input type="file" accept="video/*" onChange={(e) => setSnippetVideoFile(e.target.files?.[0] || null)} className="hidden" />
                    </label>
                  </div>
                  <div>
                    <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Audio Clip</label>
                    <label className="flex items-center gap-2 px-4 py-3 rounded-lg bg-background/50 border border-border/50 cursor-pointer hover:bg-background/70 transition font-body text-sm text-muted-foreground">
                      <Upload size={16} />{snippetAudioFile ? snippetAudioFile.name : "Choose audio..."}
                      <input type="file" accept="audio/*" onChange={(e) => setSnippetAudioFile(e.target.files?.[0] || null)} className="hidden" />
                    </label>
                  </div>
                  <div>
                    <label className="font-body text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Subtitles (.txt)</label>
                    <label className="flex items-center gap-2 px-4 py-3 rounded-lg bg-background/50 border border-border/50 cursor-pointer hover:bg-background/70 transition font-body text-sm text-muted-foreground">
                      <Upload size={16} />{snippetTranslationFile ? snippetTranslationFile.name : "Choose .txt..."}
                      <input type="file" accept=".txt,.srt" onChange={(e) => setSnippetTranslationFile(e.target.files?.[0] || null)} className="hidden" />
                    </label>
                  </div>
                </div>
                <button type="submit" disabled={snippetSaving} className="px-6 py-3 bg-primary text-primary-foreground font-body text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
                  {snippetSaving ? "Uploading..." : "Add Snippet"}
                </button>
              </form>

              {/* Snippet list grouped by theme */}
              <div className="space-y-3">
                {snippets.length === 0 && <p className="font-body text-sm text-muted-foreground text-center py-12">No snippets yet. Add your first short clip above.</p>}
                {themes.map((t) => {
                  const themeSnips = snippets.filter((s) => s.theme_id === t.id);
                  if (themeSnips.length === 0) return null;
                   return (
                     <div key={t.id} className="rounded-[1.5rem] border border-border/50 bg-card/92 p-5 shadow-soft backdrop-blur-xl">
                       <div className="flex items-center justify-end mb-3">
                         <span className="font-body text-[10px] uppercase tracking-wider text-muted-foreground">{themeSnips.length} snippet{themeSnips.length === 1 ? "" : "s"}</span>
                       </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {themeSnips.map((s) => (
                          <div key={s.id} className="flex items-center gap-3 rounded-lg border border-border/40 bg-background/50 p-3">
                            <div className="flex-1 min-w-0">
                              {s.caption && <p className="font-body text-sm text-foreground truncate">{s.caption}</p>}
                              <div className="flex items-center gap-2 mt-1">
                                {s.video_url && <span className="font-body text-[10px] uppercase tracking-wider text-accent">▶ Video</span>}
                                {s.audio_url && <span className="font-body text-[10px] uppercase tracking-wider text-accent">♫ Audio</span>}
                                {s.translation && <span className="font-body text-[10px] uppercase tracking-wider text-accent">📝 Subs</span>}
                              </div>
                            </div>
                            {deleteSnippetId === s.id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => handleDeleteSnippet(s.id)} className="px-2 py-1 bg-destructive text-destructive-foreground font-body text-xs rounded hover:bg-destructive/90 transition-colors">OK</button>
                                <button onClick={() => setDeleteSnippetId(null)} className="px-2 py-1 bg-secondary text-secondary-foreground font-body text-xs rounded hover:bg-secondary/80 transition-colors">No</button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteSnippetId(s.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors" aria-label="Delete snippet"><Trash2 size={14} /></button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "submissions" && (
            <div className="space-y-3">
              {submissions.length === 0 && <p className="font-body text-sm text-muted-foreground text-center py-12">No submissions yet.</p>}
              {submissions.map((s) => (
                <div key={s.id} className="rounded-[1.5rem] border border-border/50 bg-card/92 p-5 shadow-soft backdrop-blur-xl space-y-2">
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
                      <button onClick={() => setDeleteSubmissionId(s.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0" aria-label="Delete submission"><Trash2 size={16} /></button>
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
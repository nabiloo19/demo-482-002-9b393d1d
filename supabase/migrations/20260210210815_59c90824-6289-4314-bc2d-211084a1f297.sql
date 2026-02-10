
-- Themes table for storing bubble/story data
CREATE TABLE public.themes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  theme TEXT NOT NULL,
  excerpt TEXT,
  frequency INTEGER NOT NULL DEFAULT 10,
  x FLOAT NOT NULL DEFAULT 50,
  y FLOAT NOT NULL DEFAULT 50,
  color_variant TEXT NOT NULL DEFAULT 'cream',
  banner_url TEXT,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;

-- Public read (landing page needs to display themes)
CREATE POLICY "Themes are publicly readable"
ON public.themes FOR SELECT
USING (true);

-- Authenticated users can manage themes
CREATE POLICY "Authenticated users can insert themes"
ON public.themes FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update themes"
ON public.themes FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete themes"
ON public.themes FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Storage bucket for banner images and audio files
INSERT INTO storage.buckets (id, name, public) VALUES ('theme-media', 'theme-media', true);

-- Storage policies
CREATE POLICY "Theme media is publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'theme-media');

CREATE POLICY "Authenticated users can upload theme media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'theme-media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update theme media"
ON storage.objects FOR UPDATE
USING (bucket_id = 'theme-media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete theme media"
ON storage.objects FOR DELETE
USING (bucket_id = 'theme-media' AND auth.uid() IS NOT NULL);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_themes_updated_at
BEFORE UPDATE ON public.themes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

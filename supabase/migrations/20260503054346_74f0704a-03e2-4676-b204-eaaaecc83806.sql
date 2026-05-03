-- Create snippets table for short audio-visual memories tagged by theme
CREATE TABLE public.snippets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  theme_id UUID NOT NULL REFERENCES public.themes(id) ON DELETE CASCADE,
  video_url TEXT,
  audio_url TEXT,
  caption TEXT,
  translation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_snippets_theme_id ON public.snippets(theme_id);

ALTER TABLE public.snippets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Snippets are publicly readable"
ON public.snippets FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert snippets"
ON public.snippets FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update snippets"
ON public.snippets FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete snippets"
ON public.snippets FOR DELETE
USING (auth.uid() IS NOT NULL);

CREATE TRIGGER update_snippets_updated_at
BEFORE UPDATE ON public.snippets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
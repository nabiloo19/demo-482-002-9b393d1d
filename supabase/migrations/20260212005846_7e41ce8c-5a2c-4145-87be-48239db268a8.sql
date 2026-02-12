
CREATE TABLE public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert submissions"
  ON public.submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read submissions"
  ON public.submissions FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete submissions"
  ON public.submissions FOR DELETE
  USING (auth.uid() IS NOT NULL);

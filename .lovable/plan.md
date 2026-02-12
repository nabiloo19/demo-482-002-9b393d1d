

## Save Story Submissions to Database

### What will happen
- A new `submissions` table will be created in the database to store story submissions
- The "Submit Your Story" form will save entries to this table and show a success message: "Thank you! We will contact you soon."
- A new "Submissions" tab will be added to the `/admin` panel so you can view all submissions

### How it works

1. **Create `submissions` table** with columns: id, name, email, message, created_at. Public insert allowed (anyone can submit), but only authenticated admins can read/delete.

2. **Update ParticipateSection** -- wire up the form with state, validation (using zod), and submit logic. On success, show a friendly success message replacing the form briefly, then reset.

3. **Update Admin page** -- add a "Submissions" tab alongside the existing theme manager, listing all submissions with name, email, message, and timestamp. Include a delete button for cleanup.

### Technical Details

**Database migration:**
```sql
CREATE TABLE public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit
CREATE POLICY "Anyone can insert submissions"
  ON public.submissions FOR INSERT
  WITH CHECK (true);

-- Only authenticated users can read
CREATE POLICY "Authenticated users can read submissions"
  ON public.submissions FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Only authenticated users can delete
CREATE POLICY "Authenticated users can delete submissions"
  ON public.submissions FOR DELETE
  USING (auth.uid() IS NOT NULL);
```

**ParticipateSection changes:**
- Add form state (name, email, message) with zod validation
- On submit, insert into `submissions` table
- Show success state with "Thank you! We will contact you soon." message
- Input length limits: name (100), email (255), message (2000)

**Admin page changes:**
- Add a tab/section below or alongside themes to list submissions
- Show name, email, message preview, and date
- Delete button with confirmation (matching existing pattern)

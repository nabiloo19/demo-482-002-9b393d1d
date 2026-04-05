

## Plan: Multi-Feature Update

This covers 7 changes across Admin, Landing Page, and database.

---

### 1. Expand Color Variants to 5 Yellow Shades

**Admin form**: Replace the 3-option color variant dropdown with 5 yellow-family options: Honey, Amber, Saffron, Sand, Gold. Update `randomColor()` to pick from these 5.

**Landing page CSS**: Replace the 3 bubble glow classes (`bubble-glow-amber`, `bubble-glow-rose`, `bubble-glow-gold`) with 5 yellow-toned glow classes matching the new variant names. Remove the purple/rose tones entirely.

**BubbleMap / Index.tsx**: Update `getGlowClass()` to map the 5 new variants to their respective CSS classes.

**Theme list in Admin**: Update the color dot display to use the new variant names.

---

### 2. Add Translation/Subtitle Field for Video

**Database**: Add a `translation` text column to the `themes` table (nullable).

**Admin form**: Add a "Translation / Subtitle" textarea field below the excerpt field.

**StoryOverlay**: When a video is present and `translation` exists, render it as a subtitle overlay that scrolls/fades in sync with the video using a simple timed display approach (split text into segments, show each one as the video progresses using `onTimeUpdate`).

**Data types**: Add `translation?: string` to `ThemeBubble` interface and map it from `DbTheme`.

---

### 3. Frequency Control with Cap

**Admin form**: Add back a frequency number input with `min=1` and `max=100`. Display a slider or input clamped to this range.

**Landing page**: The bubble sizing already works proportionally (`freq / maxFreq`), so no changes needed there. The max=100 cap in the admin prevents absurd values.

---

### 4. Real Madrid Easter Egg Theme (Admin Only)

Add a small fun section at the bottom of the Admin dashboard (visible only to logged-in admins) with a decorative card showing Real Madrid phrases: "Y nada más", "Ramos header 92:48", "La Décima", "Hala Madrid". This is purely decorative, does not create database entries, and won't affect the landing page.

---

### 5. Remove Light/Dark Toggle, Lock to Dark Mode

**Header.tsx**: Remove the Sun/Moon toggle button and the `isDark` state. On mount, always set `document.documentElement.classList.add("dark")` and `localStorage.setItem("theme", "dark")`.

**index.css**: Keep both light/dark CSS variable blocks (no harm), but the app will always render in dark mode.

---

### 6. Add Podcast Link to Footer and SlideMenu

**Footer.tsx**: Add a new link "The Podcast" pointing to `https://yiepodcast.web.app` with `target="_blank"`.

**SlideMenu.tsx**: Add a nav item "The Podcast" as an external link to the same URL, styled to match existing nav items.

---

### 7. Humanize Landing Page Copy, Remove Em Dashes

Update text in these components to remove all em dashes (`—`) and rewrite copy to feel warmer and more conversational:

- **AboutSection.tsx**: Rewrite the 3 paragraphs and blockquote to be more personal, remove em dashes.
- **ParticipateSection.tsx**: Soften the copy, remove em dashes from the description.
- **ContactSection.tsx**: Already clean, minor tone adjustment if needed.
- **Index.tsx**: Update the Archive section subtitle text.
- **data/themes.ts**: Update all `excerpt` strings to remove em dashes and humanize phrasing.

---

### Files Modified

| File | Changes |
|------|---------|
| `src/pages/Admin.tsx` | 5 color variants, frequency input (1-100), translation field, Real Madrid card |
| `src/components/Header.tsx` | Remove theme toggle, force dark mode |
| `src/components/Footer.tsx` | Add podcast link |
| `src/components/SlideMenu.tsx` | Add podcast link |
| `src/components/AboutSection.tsx` | Humanize copy, remove em dashes |
| `src/components/ParticipateSection.tsx` | Remove em dashes |
| `src/components/StoryOverlay.tsx` | Show translation as video subtitle |
| `src/index.css` | Replace 3 bubble glow classes with 5 yellow-toned ones |
| `src/pages/Index.tsx` | Update `getGlowClass` for 5 variants, update archive subtitle |
| `src/components/BubbleMap.tsx` | Update `getGlowClass` for 5 variants |
| `src/data/themes.ts` | Update colorVariant type to 5 options, humanize excerpts |
| **DB migration** | Add `translation` text column to `themes` table |


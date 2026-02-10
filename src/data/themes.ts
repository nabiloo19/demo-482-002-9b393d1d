export interface ThemeBubble {
  id: string;
  theme: string;
  frequency: number;
  x: number;
  y: number;
  colorVariant: "blush" | "cream" | "sand";
  excerpt?: string;
  bannerUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
}

export const themes: ThemeBubble[] = [
  {
    id: "family",
    theme: "Family",
    frequency: 45,
    x: 48,
    y: 45,
    colorVariant: "cream",
    excerpt:
      "The bonds that held us together across continents and time zones. Stories of mothers who packed entire kitchens into suitcases, and fathers who carried their homeland in lullabies.",
  },
  {
    id: "nostalgia-1",
    theme: "Nostalgia",
    frequency: 28,
    x: 31,
    y: 30,
    colorVariant: "blush",
    excerpt:
      "The scent of bakhoor on a Thursday evening. The sound of the adhan echoing through narrow alleyways. Memories that travel with you, no matter how far you go.",
  },
  {
    id: "resilience-1",
    theme: "Resilience",
    frequency: 26,
    x: 70,
    y: 36,
    colorVariant: "sand",
    excerpt:
      "How we rebuilt our lives, one small act at a time. The strength found in community, in shared meals, and in the quiet determination to keep going.",
  },
  {
    id: "lost-places",
    theme: "Lost Places",
    frequency: 24,
    x: 62,
    y: 64,
    colorVariant: "cream",
    excerpt:
      "The houses we left behind, the streets we walked as children. Places that exist now only in our memories and in the stories we tell our children.",
  },
  {
    id: "history",
    theme: "History",
    frequency: 19,
    x: 78,
    y: 52,
    colorVariant: "sand",
    excerpt:
      "Ancient trade routes, medieval architecture, and a civilization that gave the world coffee. Our history is our identity.",
  },
  {
    id: "departure",
    theme: "The Departure",
    frequency: 18,
    x: 24,
    y: 53,
    colorVariant: "blush",
    excerpt:
      "The last look through an airplane window. The moment the familiar became foreign, and the foreign became our new reality.",
  },
  {
    id: "nostalgia-2",
    theme: "Nostalgia",
    frequency: 17,
    x: 22,
    y: 40,
    colorVariant: "blush",
    excerpt:
      "Fragments of a life left behind. The taste of honey-soaked bint al-sahn, the warmth of a grandmother's embrace.",
  },
  {
    id: "coffee-ritual",
    theme: "The Coffee Ritual",
    frequency: 16,
    x: 40,
    y: 62,
    colorVariant: "sand",
    excerpt:
      "Qahwa Yemeniya — more than a drink, it's a ceremony. The grinding, the brewing, the sharing. A ritual that anchors us to home.",
  },
  {
    id: "resilience-2",
    theme: "Resilience",
    frequency: 16,
    x: 38,
    y: 56,
    colorVariant: "cream",
    excerpt:
      "In every setback, a new beginning. The Yemeni spirit of perseverance, woven into every story of exile.",
  },
  {
    id: "resilience-3",
    theme: "Resilience",
    frequency: 17,
    x: 52,
    y: 72,
    colorVariant: "blush",
    excerpt:
      "The quiet courage of starting over. Learning new languages, navigating new customs, while holding on to who we are.",
  },
  {
    id: "childhood",
    theme: "Childhood Games",
    frequency: 13,
    x: 82,
    y: 56,
    colorVariant: "blush",
    excerpt:
      "Running through dusty streets, the laughter echoing off stone walls. Games played under open skies, where imagination was our only limit.",
  },
  {
    id: "family-2",
    theme: "Family",
    frequency: 12,
    x: 84,
    y: 37,
    colorVariant: "cream",
    excerpt:
      "Across borders and time zones, the threads of family remain unbroken. Video calls that replace dinner tables.",
  },
  {
    id: "admonition",
    theme: "Admonition",
    frequency: 10,
    x: 58,
    y: 22,
    colorVariant: "cream",
    excerpt:
      "The words of elders, passed down through generations. Warnings, wisdom, and whispers of a world we must not forget.",
  },
  // Small decorative bubbles
  { id: "dec1", theme: "", frequency: 5, x: 17, y: 35, colorVariant: "blush" },
  { id: "dec2", theme: "", frequency: 4, x: 35, y: 20, colorVariant: "sand" },
  { id: "dec3", theme: "", frequency: 3, x: 63, y: 14, colorVariant: "blush" },
  { id: "dec4", theme: "", frequency: 5, x: 14, y: 57, colorVariant: "sand" },
  { id: "dec5", theme: "", frequency: 3, x: 45, y: 80, colorVariant: "cream" },
  { id: "dec6", theme: "", frequency: 3, x: 90, y: 44, colorVariant: "cream" },
  { id: "dec7", theme: "", frequency: 4, x: 76, y: 67, colorVariant: "sand" },
  { id: "dec8", theme: "", frequency: 2, x: 27, y: 68, colorVariant: "blush" },
  { id: "dec9", theme: "", frequency: 3, x: 72, y: 22, colorVariant: "sand" },
  { id: "dec10", theme: "", frequency: 4, x: 88, y: 60, colorVariant: "cream" },
  { id: "dec11", theme: "", frequency: 3, x: 38, y: 36, colorVariant: "cream" },
  { id: "dec12", theme: "", frequency: 2, x: 68, y: 48, colorVariant: "blush" },
];

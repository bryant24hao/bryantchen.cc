// sample-data.jsx — sample photos, hardcoded palettes, fonts, layouts,
// and the small visual constants used across the prototype.
//
// All data is fake (Unsplash URLs + hand-picked palettes) so the
// prototype renders the same "color extraction" result every time.

const CW = {
  bg:        '#FAFAF7',  // user-spec slightly warmer-than-brand cream
  bgWarm:    '#F0EEE9',  // brand cream (used inside cards / chrome)
  ink:       '#1A1A1A',
  inkSoft:   'rgba(26,26,26,0.72)',
  secondary: '#8a8a8e',
  hairline:  'rgba(26,26,26,0.10)',
  hairlineSoft: 'rgba(26,26,26,0.06)',
  hint:      '#FEF4A8',
  dawn:      '#F4B89D',
  dusk:      '#5C6E8A',
  // Type
  display: '"Cormorant Garamond", "EB Garamond", Georgia, serif',
  serif:   'Georgia, "Cormorant Garamond", serif',
  sans:    '-apple-system, "SF Pro Text", "Helvetica Neue", system-ui, sans-serif',
  mono:    '"Courier Prime", "Courier New", monospace',
};

// 6 photos, each with hardcoded 6-color palette + EXIF-ish metadata.
// Palettes are ordered by perceived dominance (first = most striking).
const PHOTOS = [
  {
    id: 'tulip',
    title: 'Tulips',
    url: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900&q=80',
    palette: ['#E8556B', '#F4B89D', '#3F5C3D', '#1F2A1A', '#F2E9D8', '#9B3247'],
    place: 'Keukenhof',
    time:  '4:12 PM · Apr 2026',
    emoji: '🌷',
    caption: 'in full bloom',
  },
  {
    id: 'willow',
    title: 'Willow',
    url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=900&q=80',
    palette: ['#5C6E8A', '#A8B8C4', '#3D4A5C', '#D8DDE2', '#1F2530', '#7A8B9E'],
    place: 'West Lake · 杭州',
    time:  '7:48 AM · Mar 2026',
    emoji: '🌿',
    caption: '微风过处，柳色青青',
  },
  {
    id: 'sunset',
    title: 'Sunset',
    url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=900&q=80',
    palette: ['#F08A4B', '#E94F37', '#1B2845', '#F4D58D', '#7B3F00', '#C13525'],
    place: 'Joshua Tree, CA',
    time:  '7:21 PM · Feb 2026',
    emoji: '🌅',
    caption: 'a photo, a color, a day',
  },
  {
    id: 'coffee',
    title: 'Coffee',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&q=80',
    palette: ['#5C3A21', '#C4A079', '#1F140C', '#E8DCC4', '#8B5E3C', '#3A2418'],
    place: 'Blue Bottle · SF',
    time:  '8:54 AM · Apr 2026',
    emoji: '☕',
    caption: 'Saturday slow morning',
  },
  {
    id: 'ocean',
    title: 'Ocean',
    url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=900&q=80',
    palette: ['#1E5F74', '#86C5D8', '#0B3142', '#E8F1F2', '#5BA9C0', '#0F4759'],
    place: 'Big Sur, CA',
    time:  '5:33 PM · Mar 2026',
    emoji: '🌊',
    caption: 'long drive, blue everywhere',
  },
  {
    id: 'autumn',
    title: 'Autumn',
    url: 'https://images.unsplash.com/photo-1507783548227-544c3b8fc065?w=900&q=80',
    palette: ['#C8612E', '#F0A55B', '#5C2E0F', '#FBE7C0', '#9C4A1B', '#2E1A0A'],
    place: 'Kyoto · 哲学の道',
    time:  '3:02 PM · Nov 2025',
    emoji: '🍂',
    caption: '秋深く 隣は何を する人ぞ',
  },
];

// 8 caption fonts. Use stable web-font fallbacks (Google Fonts loaded
// in the host page).
const FONTS = [
  { id: 'typewriter', name: 'Typewriter', cssFamily: '"Courier Prime", "Courier New", monospace', weight: 400, sample: 'a slow morning' },
  { id: 'editorial',  name: 'Editorial',  cssFamily: '"Cormorant Garamond", Georgia, serif', weight: 500, italic: true, sample: 'turn a photo into a color' },
  { id: 'modern',     name: 'Modern Sans', cssFamily: '"Inter", -apple-system, sans-serif', weight: 500, sample: 'a quiet afternoon' },
  { id: 'handwriting', name: 'Handwritten', cssFamily: '"Caveat", cursive', weight: 600, sample: 'kept that color' },
  { id: 'shufa',      name: '中文书法',     cssFamily: '"Ma Shan Zheng", "Songti SC", serif', weight: 400, sample: '朝色夕拾' },
  { id: 'pixel',      name: 'Pixel',      cssFamily: '"VT323", "Courier New", monospace', weight: 400, sample: 'press start' },
  { id: 'display',    name: 'Display',    cssFamily: '"Playfair Display", Georgia, serif', weight: 500, italic: true, sample: 'a long, slow look' },
  { id: 'rounded',    name: 'Rounded',    cssFamily: '"Nunito", -apple-system, sans-serif', weight: 700, sample: 'soft and warm' },
];

// 10 layout variants. Each has an id, name, and is rendered by a function
// in variants.jsx.
const LAYOUTS = [
  { id: 'classic',   name: 'Classic',   subtitle: 'Color top / photo bottom' },
  { id: 'gradient',  name: 'Gradient',  subtitle: 'Soft fade into the photo' },
  { id: 'palette',   name: 'Palette',   subtitle: 'Color band + 6-strip' },
  { id: 'polaroid',  name: 'Polaroid',  subtitle: 'Tilted card with footer' },
  { id: 'magazine',  name: 'Magazine',  subtitle: 'Vertical typography' },
  { id: 'window',    name: 'Window',    subtitle: 'Round porthole' },
  { id: 'splitV',    name: 'Vertical split', subtitle: 'Color left / photo right' },
  { id: 'tape',      name: 'Tape',      subtitle: 'Washi-taped photo' },
  { id: 'colorstory', name: 'Color story', subtitle: 'Side palette strip' },
  { id: 'film',      name: 'Film',      subtitle: '35mm sprocket strip' },
];

// Mood palettes (preset chips in the Color sheet).
const MOOD_PALETTES = [
  { id: 'dusk',    name: 'Dusk',    colors: ['#F4B89D', '#5C6E8A', '#1A1A1A'] },
  { id: 'cream',   name: 'Cream',   colors: ['#F0EEE9', '#E8DCC4', '#5C3A21'] },
  { id: 'forest',  name: 'Forest',  colors: ['#3F5C3D', '#1F2A1A', '#A8B8A0'] },
  { id: 'ocean',   name: 'Ocean',   colors: ['#1E5F74', '#86C5D8', '#0B3142'] },
  { id: 'rosé',    name: 'Rosé',    colors: ['#E8556B', '#F4D58D', '#9B3247'] },
  { id: 'mono',    name: 'Mono',    colors: ['#1A1A1A', '#8A8A8E', '#F0EEE9'] },
];

// EXIF chips that auto-suggest in the text panel.
const EXIF_CHIPS = (photo) => [
  { icon: '📍', label: photo.place },
  { icon: '🕒', label: photo.time },
  { icon: photo.emoji, label: `${photo.emoji} ${photo.caption}` },
  { icon: '🎨', label: photo.palette[0].toUpperCase() },
];

// Recent gallery — first 9 photos cycled with random pal jitter.
const RECENT_GRID = [...PHOTOS, ...PHOTOS, ...PHOTOS].slice(0, 12).map((p, i) => ({
  ...p,
  // give each tile a different dominant color visually
  dominant: p.palette[i % p.palette.length],
}));

// Mode tabs (Single / Collage / Story / Video) at the top of upload screen.
const MODES = [
  { id: 'single',  label: 'Single',  icon: '▢' },
  { id: 'collage', label: 'Collage', icon: '▦' },
  { id: 'story',   label: 'Story',   icon: '▮' },
  { id: 'video',   label: 'Video',   icon: '▷' },
];

// Bottom toolbar in editor (6 buttons, left→right).
const EDITOR_TOOLS = [
  { id: 'layout', label: 'Layout', glyph: '▦' },
  { id: 'color',  label: 'Color',  glyph: '◐' },
  { id: 'font',   label: 'Font',   glyph: 'Aa' },
  { id: 'text',   label: 'Text',   glyph: '¶' },
  { id: 'split',  label: 'Split',  glyph: '⇕' },
  { id: 'ratio',  label: 'Ratio',  glyph: '▭' },
];

// Export pill formats.
const EXPORT_FORMATS = [
  { id: 'png', label: 'PNG', detail: '3:4 · 2400×3200' },
  { id: 'jpg', label: 'JPG', detail: '3:4 · q92' },
  { id: 'live', label: 'Live', detail: 'Live Photo' },
  { id: 'mp4', label: 'MP4', detail: '4s loop' },
];

// 4×2 share grid.
const SHARE_TARGETS = [
  { id: 'xhs',   label: '小红书',     bg: '#FE2C55', fg: '#fff' },
  { id: 'ig',    label: 'Instagram', bg: 'linear-gradient(135deg,#FEDA75,#FA7E1E,#D62976,#962FBF,#4F5BD5)', fg: '#fff' },
  { id: 'wechat', label: '微信',     bg: '#07C160', fg: '#fff' },
  { id: 'twitter', label: 'X',       bg: '#000', fg: '#fff' },
  { id: 'photos', label: 'Photos',   bg: '#FAFAF7', fg: '#1a1a1a', border: true },
  { id: 'airdrop', label: 'AirDrop', bg: '#1F8AFF', fg: '#fff' },
  { id: 'mail',   label: 'Mail',     bg: '#1F8AFF', fg: '#fff' },
  { id: 'more',   label: 'More',     bg: '#FAFAF7', fg: '#1a1a1a', border: true },
];

Object.assign(window, {
  CW, PHOTOS, FONTS, LAYOUTS, MOOD_PALETTES, EXIF_CHIPS,
  RECENT_GRID, MODES, EDITOR_TOOLS, EXPORT_FORMATS, SHARE_TARGETS,
});

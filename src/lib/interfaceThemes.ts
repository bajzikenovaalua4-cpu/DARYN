export type InterfaceThemeId = 'ocean' | 'violet' | 'sunset' | 'forest' | 'crimson' | 'sakura';

export type InterfaceTheme = {
  id: InterfaceThemeId;
  title: string;
  colors: [string, string];
};

export const interfaceThemes: InterfaceTheme[] = [
  { id: 'ocean', title: 'Ocean', colors: ['#38bdf8', '#2563eb'] },
  { id: 'violet', title: 'Violet', colors: ['#a78bfa', '#7c3aed'] },
  { id: 'sunset', title: 'Sunset', colors: ['#fbbf24', '#f97316'] },
  { id: 'forest', title: 'Forest', colors: ['#34d399', '#059669'] },
  { id: 'crimson', title: 'Crimson', colors: ['#fb7185', '#dc2626'] },
  { id: 'sakura', title: 'Sakura', colors: ['#f9a8d4', '#ec4899'] },
];

export const defaultInterfaceTheme: InterfaceThemeId = 'ocean';

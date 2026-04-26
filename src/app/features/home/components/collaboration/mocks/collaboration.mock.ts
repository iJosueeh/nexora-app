import { Avatar, Figure } from '../interfaces/collaboration.model';

export const AVATARS_MOCK: Avatar[] = [
  { id: 1, initials: 'AS', bg: '#1e3a5f', color: '#60a5fa' },
  { id: 2, initials: 'LW', bg: '#3b1f5e', color: '#c084fc' },
  { id: 3, initials: 'MR', bg: '#1f3d2a', color: '#4ade80' },
  { id: 4, initials: 'JT', bg: '#3d2a1f', color: '#fb923c' },
];

export const FIGURES_MOCK: Figure[] = [
  { id: 1, size: 28, bodyH: 52 },
  { id: 2, size: 32, bodyH: 62 },
  { id: 3, size: 30, bodyH: 56 },
  { id: 4, size: 26, bodyH: 48 },
];

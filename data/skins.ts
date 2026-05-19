import type { Skin } from '@/lib/types';

export const rarityOrder = ['Consumer', 'Industrial', 'Mil-Spec', 'Restricted', 'Classified', 'Covert', 'Gold'] as const;

export const rarityStyles: Record<Skin['rarity'], { text: string; border: string; bg: string; glow: string }> = {
  Consumer: { text: 'text-slate-200', border: 'border-slate-400/35', bg: 'from-slate-700/50 to-slate-950', glow: 'shadow-[0_0_22px_rgba(203,213,225,0.12)]' },
  Industrial: { text: 'text-sky-200', border: 'border-sky-400/40', bg: 'from-sky-600/30 to-slate-950', glow: 'shadow-[0_0_24px_rgba(56,189,248,0.16)]' },
  'Mil-Spec': { text: 'text-blue-200', border: 'border-blue-500/45', bg: 'from-blue-700/35 to-slate-950', glow: 'shadow-[0_0_26px_rgba(59,130,246,0.18)]' },
  Restricted: { text: 'text-violet-200', border: 'border-violet-500/45', bg: 'from-violet-700/40 to-slate-950', glow: 'shadow-[0_0_30px_rgba(139,92,246,0.22)]' },
  Classified: { text: 'text-fuchsia-200', border: 'border-fuchsia-500/45', bg: 'from-fuchsia-700/40 to-slate-950', glow: 'shadow-[0_0_32px_rgba(217,70,239,0.22)]' },
  Covert: { text: 'text-red-200', border: 'border-red-500/50', bg: 'from-red-800/45 to-slate-950', glow: 'shadow-[0_0_34px_rgba(239,68,68,0.22)]' },
  Gold: { text: 'text-amber-100', border: 'border-amber-300/60', bg: 'from-amber-500/40 to-slate-950', glow: 'shadow-[0_0_38px_rgba(245,181,68,0.26)]' }
};

export const skins: Skin[] = [
  { id: 's-001', name: 'AK-47 Neon Ghost', weapon: 'AK-47', rarity: 'Mil-Spec', value: 145, image: 'forge://skin/neon-ghost', chance: 10, color: '#29b7ff', light: '#bdeeff' },
  { id: 's-002', name: 'M4A4 Crimson Core', weapon: 'M4A4', rarity: 'Restricted', value: 280, image: 'forge://skin/crimson-core', chance: 6, color: '#ff4545', light: '#ffb3a7' },
  { id: 's-003', name: 'AWP Void Hunter', weapon: 'AWP', rarity: 'Classified', value: 620, image: 'forge://skin/void-hunter', chance: 3.2, color: '#8b5cf6', light: '#d9c8ff' },
  { id: 's-004', name: 'USP-S Cyber Bite', weapon: 'USP-S', rarity: 'Industrial', value: 72, image: 'forge://skin/cyber-bite', chance: 17, color: '#2dd4bf', light: '#c8fff7' },
  { id: 's-005', name: 'Karambit Solar Fang', weapon: 'Karambit', rarity: 'Gold', value: 2950, image: 'forge://skin/solar-fang', chance: 0.3, color: '#ffc44d', light: '#fff0b8' },
  { id: 's-006', name: 'Gloves Phantom Pulse', weapon: 'Gloves', rarity: 'Gold', value: 3400, image: 'forge://skin/phantom-pulse', chance: 0.22, color: '#f59e0b', light: '#fff6d7' },
  { id: 's-007', name: 'FAMAS Alloy Static', weapon: 'FAMAS', rarity: 'Consumer', value: 28, image: 'forge://skin/alloy-static', chance: 22, color: '#c4c9d4', light: '#ffffff' },
  { id: 's-008', name: 'Glock-18 Rust Circuit', weapon: 'Glock-18', rarity: 'Consumer', value: 34, image: 'forge://skin/rust-circuit', chance: 19, color: '#d97706', light: '#ffe0b1' },
  { id: 's-009', name: 'Desert Eagle Iron Oath', weapon: 'Desert Eagle', rarity: 'Restricted', value: 315, image: 'forge://skin/iron-oath', chance: 5.4, color: '#f97316', light: '#ffd8ad' },
  { id: 's-010', name: 'MP9 Blue Voltage', weapon: 'MP9', rarity: 'Industrial', value: 88, image: 'forge://skin/blue-voltage', chance: 14, color: '#38bdf8', light: '#dff7ff' },
  { id: 's-011', name: 'P90 Reactor Bloom', weapon: 'P90', rarity: 'Mil-Spec', value: 155, image: 'forge://skin/reactor-bloom', chance: 9, color: '#a3e635', light: '#f0ffd1' },
  { id: 's-012', name: 'AUG Night Bastion', weapon: 'AUG', rarity: 'Mil-Spec', value: 190, image: 'forge://skin/night-bastion', chance: 7.8, color: '#64748b', light: '#e2e8f0' },
  { id: 's-013', name: 'Galil AR Ember Grid', weapon: 'Galil AR', rarity: 'Industrial', value: 96, image: 'forge://skin/ember-grid', chance: 13, color: '#fb923c', light: '#ffedd5' },
  { id: 's-014', name: 'SSG 08 Arctic Prism', weapon: 'SSG 08', rarity: 'Restricted', value: 355, image: 'forge://skin/arctic-prism', chance: 4.8, color: '#bae6fd', light: '#ffffff' },
  { id: 's-015', name: 'M4A1-S Royal Signal', weapon: 'M4A1-S', rarity: 'Classified', value: 840, image: 'forge://skin/royal-signal', chance: 2.4, color: '#a855f7', light: '#eadcff' },
  { id: 's-016', name: 'AK-47 Dragon Relay', weapon: 'AK-47', rarity: 'Covert', value: 1320, image: 'forge://skin/dragon-relay', chance: 1.05, color: '#ef4444', light: '#ffd6d6' },
  { id: 's-017', name: 'AWP Golden Rift', weapon: 'AWP', rarity: 'Covert', value: 1760, image: 'forge://skin/golden-rift', chance: 0.82, color: '#f5b544', light: '#fff4c5' },
  { id: 's-018', name: 'Butterfly Knife Ash Nova', weapon: 'Butterfly Knife', rarity: 'Gold', value: 4200, image: 'forge://skin/ash-nova', chance: 0.18, color: '#ffb020', light: '#fff7d6' },
  { id: 's-019', name: 'Five-SeveN Plasma Rail', weapon: 'Five-SeveN', rarity: 'Mil-Spec', value: 130, image: 'forge://skin/plasma-rail', chance: 10.5, color: '#60a5fa', light: '#dbeafe' },
  { id: 's-020', name: 'MAC-10 Toxic Wire', weapon: 'MAC-10', rarity: 'Consumer', value: 42, image: 'forge://skin/toxic-wire', chance: 18, color: '#84cc16', light: '#ecfccb' },
  { id: 's-021', name: 'Tec-9 Purple Riot', weapon: 'Tec-9', rarity: 'Industrial', value: 110, image: 'forge://skin/purple-riot', chance: 12, color: '#c084fc', light: '#f3e8ff' },
  { id: 's-022', name: 'XM1014 Furnace Mark', weapon: 'XM1014', rarity: 'Consumer', value: 38, image: 'forge://skin/furnace-mark', chance: 20, color: '#f97316', light: '#fed7aa' },
  { id: 's-023', name: 'Sawed-Off Graphite Wolf', weapon: 'Sawed-Off', rarity: 'Industrial', value: 86, image: 'forge://skin/graphite-wolf', chance: 15, color: '#94a3b8', light: '#f8fafc' },
  { id: 's-024', name: 'Nova Desert Chrome', weapon: 'Nova', rarity: 'Consumer', value: 31, image: 'forge://skin/desert-chrome', chance: 21, color: '#d6a75c', light: '#fff1cf' },
  { id: 's-025', name: 'SG 553 Inferno Logic', weapon: 'SG 553', rarity: 'Restricted', value: 390, image: 'forge://skin/inferno-logic', chance: 4.2, color: '#fb7185', light: '#ffe4e6' },
  { id: 's-026', name: 'Dual Berettas Neon Ash', weapon: 'Dual Berettas', rarity: 'Mil-Spec', value: 160, image: 'forge://skin/neon-ash', chance: 9.4, color: '#22d3ee', light: '#cffafe' },
  { id: 's-027', name: 'R8 Revolver Brass Halo', weapon: 'R8 Revolver', rarity: 'Restricted', value: 260, image: 'forge://skin/brass-halo', chance: 6.1, color: '#facc15', light: '#fef9c3' },
  { id: 's-028', name: 'M249 Siege Kernel', weapon: 'M249', rarity: 'Industrial', value: 76, image: 'forge://skin/siege-kernel', chance: 16, color: '#fb923c', light: '#ffedd5' },
  { id: 's-029', name: 'AWP Obsidian Monarch', weapon: 'AWP', rarity: 'Covert', value: 2250, image: 'forge://skin/obsidian-monarch', chance: 0.58, color: '#7c3aed', light: '#ddd6fe' },
  { id: 's-030', name: 'Bayonet Ember Crown', weapon: 'Bayonet', rarity: 'Gold', value: 3850, image: 'forge://skin/ember-crown', chance: 0.2, color: '#ff8a1d', light: '#ffedd5' }
];

export function getSkin(id: string) {
  const skin = skins.find((item) => item.id === id);
  if (!skin) throw new Error(`Skin not found: ${id}`);
  return skin;
}

export function rarityIndex(rarity: Skin['rarity']) {
  return rarityOrder.indexOf(rarity);
}

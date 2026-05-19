import type { ForgeCase } from '@/lib/types';

const commonLow = [
  { skinId: 's-007', chance: 24 },
  { skinId: 's-008', chance: 22 },
  { skinId: 's-020', chance: 19 },
  { skinId: 's-024', chance: 17 },
  { skinId: 's-004', chance: 9 },
  { skinId: 's-010', chance: 6 },
  { skinId: 's-001', chance: 2.4 },
  { skinId: 's-009', chance: 0.55 },
  { skinId: 's-005', chance: 0.05 }
];

export const cases: ForgeCase[] = [
  {
    id: 'free-forge',
    name: 'Free Forge Case',
    tagline: 'A caixa inicial para girar sem custo e construir o primeiro inventário.',
    image: 'forge://case/free',
    category: 'Free Cases',
    levelRequired: 1,
    xpReward: 12,
    coinReward: 8,
    price: 0,
    accent: '#c4c9d4',
    items: commonLow
  },
  {
    id: 'daily-supply',
    name: 'Daily Supply',
    tagline: 'Peças leves, drops básicos e uma pequena chance de item raro.',
    image: 'forge://case/daily',
    category: 'Free Cases',
    levelRequired: 1,
    xpReward: 10,
    coinReward: 6,
    price: 0,
    accent: '#29b7ff',
    items: [
      { skinId: 's-024', chance: 25 }, { skinId: 's-022', chance: 22 }, { skinId: 's-008', chance: 19 },
      { skinId: 's-023', chance: 12 }, { skinId: 's-004', chance: 10 }, { skinId: 's-010', chance: 7 },
      { skinId: 's-019', chance: 3.7 }, { skinId: 's-027', chance: 1.2 }, { skinId: 's-030', chance: 0.1 }
    ]
  },
  {
    id: 'rookie-cache',
    name: 'Rookie Cache',
    tagline: 'Entrada barata para farmar inventário e missões.',
    image: 'forge://case/rookie',
    category: 'Promo Cases',
    levelRequired: 2,
    xpReward: 14,
    coinReward: 10,
    price: 65,
    accent: '#7dd3fc',
    items: [
      { skinId: 's-007', chance: 20 }, { skinId: 's-020', chance: 19 }, { skinId: 's-023', chance: 16 },
      { skinId: 's-013', chance: 14 }, { skinId: 's-021', chance: 10 }, { skinId: 's-011', chance: 8 },
      { skinId: 's-026', chance: 6 }, { skinId: 's-002', chance: 1.7 }, { skinId: 's-005', chance: 0.15 }
    ]
  },
  {
    id: 'bronze-cache',
    name: 'Bronze Cache',
    tagline: 'Industrial gear, bronze plating and tactical parts.',
    image: 'forge://case/bronze',
    category: 'Promo Cases',
    levelRequired: 5,
    xpReward: 18,
    coinReward: 12,
    price: 125,
    accent: '#d97706',
    items: [
      { skinId: 's-022', chance: 18 }, { skinId: 's-023', chance: 16 }, { skinId: 's-013', chance: 15 },
      { skinId: 's-021', chance: 13 }, { skinId: 's-011', chance: 10 }, { skinId: 's-019', chance: 9 },
      { skinId: 's-027', chance: 7 }, { skinId: 's-002', chance: 5 }, { skinId: 's-015', chance: 1.7 }, { skinId: 's-030', chance: 0.3 }
    ]
  },
  {
    id: 'neon-starter',
    name: 'Neon Starter',
    tagline: 'Cores elétricas e valores médios para começar a subir o inventário.',
    image: 'forge://case/neon-starter',
    category: 'Holo Cases',
    levelRequired: 7,
    xpReward: 20,
    coinReward: 16,
    price: 185,
    accent: '#22d3ee',
    items: [
      { skinId: 's-010', chance: 18 }, { skinId: 's-004', chance: 17 }, { skinId: 's-021', chance: 14 },
      { skinId: 's-026', chance: 12 }, { skinId: 's-001', chance: 10 }, { skinId: 's-011', chance: 8 },
      { skinId: 's-014', chance: 4 }, { skinId: 's-003', chance: 1.6 }, { skinId: 's-006', chance: 0.18 }
    ]
  },
  {
    id: 'silver-armory',
    name: 'Silver Armory',
    tagline: 'Bright chrome, clean neon and mid-tier pressure.',
    image: 'forge://case/silver',
    category: 'Holo Cases',
    levelRequired: 10,
    xpReward: 24,
    coinReward: 20,
    price: 260,
    accent: '#c4c9d4',
    items: [
      { skinId: 's-010', chance: 16 }, { skinId: 's-013', chance: 15 }, { skinId: 's-028', chance: 13 },
      { skinId: 's-001', chance: 12 }, { skinId: 's-026', chance: 10 }, { skinId: 's-014', chance: 8 },
      { skinId: 's-025', chance: 6 }, { skinId: 's-003', chance: 2.6 }, { skinId: 's-017', chance: 1.1 }, { skinId: 's-006', chance: 0.3 }
    ]
  },
  {
    id: 'purple-signal',
    name: 'Purple Signal',
    tagline: 'Holo roxo, armas fictícias e drops épicos com iluminação forte.',
    image: 'forge://case/purple-signal',
    category: 'Holo Cases',
    levelRequired: 12,
    xpReward: 26,
    coinReward: 22,
    price: 340,
    accent: '#8b5cf6',
    items: [
      { skinId: 's-021', chance: 16 }, { skinId: 's-026', chance: 15 }, { skinId: 's-001', chance: 13 },
      { skinId: 's-002', chance: 9 }, { skinId: 's-014', chance: 7 }, { skinId: 's-003', chance: 3.4 },
      { skinId: 's-015', chance: 2.3 }, { skinId: 's-029', chance: 0.8 }, { skinId: 's-018', chance: 0.18 }
    ]
  },
  {
    id: 'battle-rush',
    name: 'Battle Rush',
    tagline: 'Criada para batalhas rápidas com bom equilíbrio entre risco e valor.',
    image: 'forge://case/battle-rush',
    category: 'Battle Cases',
    levelRequired: 8,
    xpReward: 18,
    coinReward: 8,
    price: 210,
    accent: '#ef4444',
    items: [
      { skinId: 's-013', chance: 18 }, { skinId: 's-010', chance: 15 }, { skinId: 's-019', chance: 13 },
      { skinId: 's-027', chance: 9 }, { skinId: 's-009', chance: 7 }, { skinId: 's-025', chance: 4.7 },
      { skinId: 's-015', chance: 2.4 }, { skinId: 's-016', chance: 1.2 }, { skinId: 's-030', chance: 0.18 }
    ]
  },
  {
    id: 'battle-iron',
    name: 'Battle Iron',
    tagline: 'Mais cara, mais pesada, pensada para confrontos longos.',
    image: 'forge://case/battle-iron',
    category: 'Battle Cases',
    levelRequired: 15,
    xpReward: 30,
    coinReward: 16,
    price: 430,
    accent: '#f97316',
    items: [
      { skinId: 's-011', chance: 14 }, { skinId: 's-012', chance: 13 }, { skinId: 's-009', chance: 10 },
      { skinId: 's-014', chance: 9 }, { skinId: 's-025', chance: 6 }, { skinId: 's-003', chance: 3.1 },
      { skinId: 's-016', chance: 2.2 }, { skinId: 's-017', chance: 1.2 }, { skinId: 's-005', chance: 0.28 }
    ]
  },
  {
    id: 'golden-vault',
    name: 'Golden Vault',
    tagline: 'High value drops with golden industrial lighting.',
    image: 'forge://case/gold',
    category: 'Premium Cases',
    levelRequired: 20,
    xpReward: 38,
    coinReward: 30,
    price: 620,
    accent: '#f5b544',
    items: [
      { skinId: 's-011', chance: 14 }, { skinId: 's-012', chance: 13 }, { skinId: 's-019', chance: 12 },
      { skinId: 's-009', chance: 9 }, { skinId: 's-014', chance: 8 }, { skinId: 's-015', chance: 5 },
      { skinId: 's-016', chance: 2.4 }, { skinId: 's-017', chance: 1.4 }, { skinId: 's-029', chance: 0.8 }, { skinId: 's-018', chance: 0.4 }
    ]
  },
  {
    id: 'crimson-foundry',
    name: 'Crimson Foundry',
    tagline: 'Vermelho escuro, metal quente e drops de alto impacto visual.',
    image: 'forge://case/crimson-foundry',
    category: 'Premium Cases',
    levelRequired: 24,
    xpReward: 42,
    coinReward: 34,
    price: 760,
    accent: '#dc2626',
    items: [
      { skinId: 's-002', chance: 12 }, { skinId: 's-009', chance: 10 }, { skinId: 's-025', chance: 8 },
      { skinId: 's-015', chance: 5.4 }, { skinId: 's-016', chance: 3.2 }, { skinId: 's-017', chance: 1.8 },
      { skinId: 's-029', chance: 1.1 }, { skinId: 's-030', chance: 0.4 }, { skinId: 's-006', chance: 0.3 }
    ]
  },
  {
    id: 'storm-holo',
    name: 'Storm Holo',
    tagline: 'Azul elétrico e prata com chance real de itens classificados.',
    image: 'forge://case/storm-holo',
    category: 'Holo Cases',
    levelRequired: 28,
    xpReward: 45,
    coinReward: 35,
    price: 840,
    accent: '#29b7ff',
    items: [
      { skinId: 's-026', chance: 13 }, { skinId: 's-014', chance: 10 }, { skinId: 's-003', chance: 6 },
      { skinId: 's-015', chance: 5 }, { skinId: 's-017', chance: 2.4 }, { skinId: 's-029', chance: 1.5 },
      { skinId: 's-005', chance: 0.6 }, { skinId: 's-006', chance: 0.42 }, { skinId: 's-018', chance: 0.22 }
    ]
  },
  {
    id: 'elite-reactor',
    name: 'Elite Reactor',
    tagline: 'Purple energy core, rare weapons and classified pulls.',
    image: 'forge://case/elite',
    category: 'Elite Cases',
    levelRequired: 35,
    xpReward: 58,
    coinReward: 46,
    price: 1180,
    accent: '#8b5cf6',
    items: [
      { skinId: 's-002', chance: 12 }, { skinId: 's-014', chance: 10 }, { skinId: 's-025', chance: 9 },
      { skinId: 's-003', chance: 7 }, { skinId: 's-015', chance: 6 }, { skinId: 's-016', chance: 3.8 },
      { skinId: 's-017', chance: 2.8 }, { skinId: 's-029', chance: 1.6 }, { skinId: 's-030', chance: 0.6 }, { skinId: 's-018', chance: 0.4 }
    ]
  },
  {
    id: 'obsidian-ops',
    name: 'Obsidian Ops',
    tagline: 'Preto, roxo e dourado com peso de endgame.',
    image: 'forge://case/obsidian-ops',
    category: 'Elite Cases',
    levelRequired: 42,
    xpReward: 70,
    coinReward: 58,
    price: 1450,
    accent: '#a855f7',
    items: [
      { skinId: 's-015', chance: 8 }, { skinId: 's-016', chance: 6.2 }, { skinId: 's-017', chance: 5.2 },
      { skinId: 's-029', chance: 3.8 }, { skinId: 's-003', chance: 7 }, { skinId: 's-005', chance: 1.1 },
      { skinId: 's-006', chance: 1 }, { skinId: 's-030', chance: 0.9 }, { skinId: 's-018', chance: 0.55 }
    ]
  },
  {
    id: 'legendary-forge',
    name: 'Legendary Forge',
    tagline: 'Endgame crate with mythic metals and ultra rare specials.',
    image: 'forge://case/legendary',
    category: 'Elite Cases',
    levelRequired: 50,
    xpReward: 88,
    coinReward: 72,
    price: 2050,
    accent: '#ff8a1d',
    items: [
      { skinId: 's-003', chance: 10 }, { skinId: 's-015', chance: 9 }, { skinId: 's-016', chance: 6.5 },
      { skinId: 's-017', chance: 5.8 }, { skinId: 's-029', chance: 3.2 }, { skinId: 's-005', chance: 1.2 },
      { skinId: 's-006', chance: 1.1 }, { skinId: 's-030', chance: 1 }, { skinId: 's-018', chance: 0.8 }, { skinId: 's-027', chance: 9 }
    ]
  },
  {
    id: 'solar-mythic',
    name: 'Solar Mythic',
    tagline: 'A caixa mais pesada da Forge, com foco em Gold e Covert.',
    image: 'forge://case/solar-mythic',
    category: 'Elite Cases',
    levelRequired: 60,
    xpReward: 115,
    coinReward: 95,
    price: 3200,
    accent: '#ffc44d',
    items: [
      { skinId: 's-016', chance: 8 }, { skinId: 's-017', chance: 7 }, { skinId: 's-029', chance: 5 },
      { skinId: 's-005', chance: 2 }, { skinId: 's-006', chance: 1.8 }, { skinId: 's-030', chance: 1.6 },
      { skinId: 's-018', chance: 1.2 }, { skinId: 's-015', chance: 8 }, { skinId: 's-003', chance: 8 }
    ]
  }
];

export const caseCategories = ['Free Cases', 'Promo Cases', 'Holo Cases', 'Battle Cases', 'Premium Cases', 'Elite Cases'] as const;

export function getCase(id: string) {
  const forgeCase = cases.find((item) => item.id === id);
  if (!forgeCase) throw new Error(`Case not found: ${id}`);
  return forgeCase;
}

'use client';

import type { InventoryItem } from '@/lib/types';
import { getSkin, rarityStyles } from '@/data/skins';
import { formatCoins, formatDateTime } from '@/lib/game';
import { WeaponSilhouette } from '@/components/shared/WeaponSilhouette';

export function InventoryItemCard({ item, onSell, highlight = false }: { item: InventoryItem; onSell?: (uid: string) => void; highlight?: boolean }) {
  const skin = getSkin(item.skinId);
  const style = rarityStyles[skin.rarity];

  return (
    <div className={`relative border bg-gradient-to-br ${style.bg} ${style.border} ${highlight ? 'shadow-glow' : style.glow} p-4`}>
      {highlight ? <div className="absolute right-2 top-2 border border-forge-amber/50 bg-forge-amber/15 px-2 py-1 text-[10px] font-black uppercase tracking-wider text-forge-amber">Most valuable</div> : null}
      <WeaponSilhouette skinId={skin.id} />
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="micro-label">{skin.weapon}</p>
          <h3 className={`truncate font-display text-xl font-black uppercase tracking-wide ${style.text}`}>{skin.name}</h3>
          <p className="mt-1 text-xs text-forge-muted">{skin.rarity} · {formatDateTime(item.obtainedAt)} · {item.source}</p>
        </div>
        <p className="font-display text-xl font-black text-forge-amber">¢{formatCoins(skin.value)}</p>
      </div>
      {onSell ? (
        <button onClick={() => onSell(item.uid)} className="ghost-button mt-4 w-full text-xs">Sell for fictional coins</button>
      ) : null}
    </div>
  );
}

'use client';

import { ChangeEvent, useState } from 'react';
import { useGame } from '@/store/GameContext';
import { Avatar } from '@/components/shared/Avatar';
import { cn } from '@/lib/cn';
import { calculateInventoryValue, formatCoins } from '@/lib/game';

const avatarChoices = ['CF', 'VX', 'AK', 'AW', 'NX', 'FG', 'LV', 'OP'];

type FormMode = 'sign-in' | 'sign-up';

export function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { login, users, openLoginAs, mode, authLoading } = useGame();
  const [formMode, setFormMode] = useState<FormMode>('sign-in');
  const [name, setName] = useState('ForgePlayer');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('CF');
  const [message, setMessage] = useState('');

  if (!open) return null;

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    setMessage('');
    const result = await login(name, avatar, undefined, password, formMode);
    setMessage(result.message);
    if (result.ok) onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="forge-panel w-full max-w-3xl p-6">
        <div className="relative z-10">
          <p className="micro-label mb-2 text-forge-amber">{mode === 'online' ? 'Real account login' : 'Local prototype login'}</p>
          <h2 className="font-display text-4xl font-black uppercase tracking-[0.08em] text-forge-ice">Enter Case Forge</h2>
          <p className="mt-2 text-sm text-forge-muted">
            {mode === 'online'
              ? 'Sistema online ativo: cada pessoa cria conta só com username e senha. O progresso fica salvo no banco Supabase.'
              : 'Modo local ativo: sem Supabase configurado. Use .env.local para ativar contas reais online.'}
          </p>

          {mode === 'online' ? (
            <div className="mt-5 flex gap-2 border border-white/10 bg-black/25 p-1">
              <button onClick={() => setFormMode('sign-in')} className={cn('flex-1 px-4 py-3 text-xs font-black uppercase tracking-wide', formMode === 'sign-in' ? 'bg-forge-amber text-black' : 'text-forge-muted hover:text-forge-ice')}>Entrar</button>
              <button onClick={() => setFormMode('sign-up')} className={cn('flex-1 px-4 py-3 text-xs font-black uppercase tracking-wide', formMode === 'sign-up' ? 'bg-forge-amber text-black' : 'text-forge-muted hover:text-forge-ice')}>Criar conta</button>
            </div>
          ) : null}

          <div className="mt-6 grid gap-5 md:grid-cols-[190px_1fr]">
            <div className="grid place-items-center border border-white/10 bg-black/35 p-4">
              <Avatar value={avatar} size="xl" />
              <label className="ghost-button mt-4 cursor-pointer text-xs">
                Upload avatar
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </label>
              <p className="mt-3 text-center text-[11px] font-bold text-forge-muted">Para produção, prefira storage de avatar. No protótipo, badge ou imagem pequena.</p>
            </div>
            <div>
              <label className="micro-label">Username</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={18}
                className="mt-2 w-full border border-white/15 bg-black/55 px-4 py-3 font-display text-xl font-bold uppercase tracking-wide text-forge-ice outline-none focus:border-forge-orange/60"
                placeholder="Your player name"
              />

              {mode === 'online' ? (
                <div className="mt-4">
                  <label className="micro-label">Senha</label>
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    minLength={6}
                    className="mt-2 w-full border border-white/15 bg-black/55 px-4 py-3 font-bold text-forge-ice outline-none focus:border-forge-orange/60"
                    placeholder="mínimo 6 caracteres"
                  />
                  <p className="mt-2 text-[11px] font-bold text-forge-muted">Sem e-mail na tela: o sistema cria um login interno pelo username.</p>
                </div>
              ) : null}

              <div className="mt-5">
                <p className="micro-label mb-2">Choose avatar badge</p>
                <div className="grid grid-cols-4 gap-2">
                  {avatarChoices.map((choice) => (
                    <button
                      key={choice}
                      onClick={() => setAvatar(choice)}
                      className={cn('border p-2 transition', avatar === choice ? 'border-forge-orange bg-forge-orange/12' : 'border-white/10 bg-white/[0.03]')}
                    >
                      <Avatar value={choice} size="md" className="mx-auto" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {mode === 'local' && users.length > 0 ? (
            <div className="mt-6 border border-white/10 bg-black/25 p-3">
              <p className="micro-label mb-3 text-forge-amber">Switch local user</p>
              <div className="grid max-h-44 gap-2 overflow-auto md:grid-cols-2">
                {users.map((user) => (
                  <button key={user.id} onClick={() => { openLoginAs(user.id); onClose(); }} className="flex items-center gap-3 border border-white/10 bg-white/[0.03] p-2 text-left hover:border-forge-amber/50">
                    <Avatar value={user.avatar} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-black uppercase text-forge-ice">{user.name}</p>
                      <p className="text-[10px] font-bold uppercase text-forge-muted">LVL {user.level} · ¢{formatCoins(calculateInventoryValue(user.inventory))} inv.</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {message ? <p className="mt-4 border border-forge-orange/30 bg-forge-orange/10 p-3 text-sm font-bold text-forge-amber">{message}</p> : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              className="forge-button flex-1 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={authLoading}
              onClick={submit}
            >
              {authLoading ? 'Carregando...' : mode === 'online' ? (formMode === 'sign-up' ? 'Criar conta' : 'Entrar') : 'Create / enter local user'}
            </button>
            <button className="ghost-button" onClick={onClose}>Explore first</button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { User as UserIcon, Sun, Moon, Check } from 'lucide-react';
import useAppStore from '../store/appStore';
import { Modal } from './Modal';
import { AVATAR_STICKERS, avatarBackground } from '../utils/avatars';

export const ProfileModal: React.FC = () => {
  const profileModalOpen = useAppStore((s) => s.profileModalOpen);
  const closeProfileModal = useAppStore((s) => s.closeProfileModal);
  const nickname = useAppStore((s) => s.nickname);
  const setNickname = useAppStore((s) => s.setNickname);
  const avatar = useAppStore((s) => s.avatar);
  const setAvatar = useAppStore((s) => s.setAvatar);
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const [draft, setDraft] = useState(nickname);
  const [draftAvatar, setDraftAvatar] = useState(avatar);

  React.useEffect(() => {
    if (profileModalOpen) {
      setDraft(nickname);
      setDraftAvatar(avatar);
    }
  }, [profileModalOpen, nickname, avatar]);

  const initial = (draft.trim()[0] || '').toUpperCase() || '?';
  const inputClass = "w-full bg-white border border-[#e8eaed] px-3 py-2.5 rounded-xl text-[14px] text-[#0a0a0a] placeholder-[#8a8f97] outline-none focus:border-[#4e55e0] focus:ring-2 focus:ring-[#4e55e0]/10 transition-all";
  const labelClass = "text-[10px] font-black text-[#8a8f97] uppercase tracking-widest mb-1.5 block px-1";

  return (
    <Modal isOpen={profileModalOpen} onClose={closeProfileModal} title="Profile">
      <div className="space-y-5 px-1 pb-2">
        <div className="flex items-center gap-4 pt-2">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-lg shrink-0 transition-all"
            style={{
              background: avatarBackground(draftAvatar),
              boxShadow: '0 8px 20px rgba(10, 10, 10, 0.25)',
            }}
          >
            {draftAvatar ? (
              <span className="text-[34px] leading-none drop-shadow-sm">{draftAvatar}</span>
            ) : initial === '?' ? (
              <UserIcon className="w-7 h-7" />
            ) : (
              initial
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#0a0a0a] font-black text-base truncate">
              {draft.trim() || 'Add a nickname'}
            </p>
            <p className="text-[#8a8f97] text-[11px] font-bold uppercase tracking-wider mt-0.5">
              Athlete profile
            </p>
          </div>
        </div>

        <div>
          <label className={labelClass}>Avatar Sticker</label>
          <div className="grid grid-cols-6 md:grid-cols-8 gap-2 p-2.5 rounded-2xl bg-[#f8f9fb] border border-[#e8eaed]">
            <button
              type="button"
              onClick={() => setDraftAvatar('')}
              aria-pressed={!draftAvatar}
              title="Use your initial"
              className={`relative aspect-square rounded-2xl flex items-center justify-center text-[15px] font-black text-white shadow-md transition-all active:scale-90 ${
                !draftAvatar ? 'ring-2 ring-[#4e55e0] ring-offset-2 ring-offset-[#f8f9fb] scale-105' : 'hover:scale-105 opacity-90 hover:opacity-100'
              }`}
              style={{ background: avatarBackground('') }}
            >
              {initial === '?' ? <UserIcon className="w-4 h-4" /> : initial}
              {!draftAvatar && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#4e55e0] flex items-center justify-center shadow">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />
                </span>
              )}
            </button>
            {AVATAR_STICKERS.map(({ emoji }) => {
              const active = draftAvatar === emoji;
              return (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setDraftAvatar(emoji)}
                  aria-pressed={active}
                  className={`relative aspect-square rounded-2xl flex items-center justify-center text-[20px] leading-none shadow-md transition-all active:scale-90 ${
                    active ? 'ring-2 ring-[#4e55e0] ring-offset-2 ring-offset-[#f8f9fb] scale-105' : 'hover:scale-105 opacity-90 hover:opacity-100'
                  }`}
                  style={{ background: avatarBackground(emoji) }}
                >
                  <span className="drop-shadow-sm">{emoji}</span>
                  {active && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#4e55e0] flex items-center justify-center shadow">
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-[#8a8f97] font-bold mt-1.5 px-1">
            Pick a profile sticker, or use your initial.
          </p>
        </div>

        <div>
          <label className={labelClass}>Nickname</label>
          <input
            className={inputClass}
            placeholder="e.g. Beast Mode"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={24}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <p className="text-[10px] text-[#8a8f97] font-bold mt-1.5 px-1">
            Up to 24 characters. Used to greet you across the app.
          </p>
        </div>

        <div>
          <label className={labelClass}>Appearance</label>
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#f0f1f5] border border-[#e8eaed]">
            {([
              { value: 'light' as const, label: 'Light', Icon: Sun },
              { value: 'dark' as const, label: 'Dark', Icon: Moon },
            ]).map(({ value, label, Icon }) => {
              const active = theme === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTheme(value)}
                  aria-pressed={active}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-black transition-all ${
                    active
                      ? 'bg-white text-[#0a0a0a] shadow-sm'
                      : 'text-[#8a8f97] hover:text-[#0a0a0a]'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={2.5} />
                  {label}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-[#8a8f97] font-bold mt-1.5 px-1">
            Switch between light and dark mode. Your choice is saved on this device.
          </p>
        </div>

        <button
          onClick={() => {
            setNickname(draft.trim().slice(0, 24));
            setAvatar(draftAvatar);
            closeProfileModal();
          }}
          className="w-full py-3 rounded-xl bg-[#0a0a0a] text-white font-black text-[14px] active:scale-[0.98] transition-all shadow-sm hover:shadow-md hover:bg-[#1a1a1a]"
        >
          Save Profile
        </button>
      </div>
    </Modal>
  );
};

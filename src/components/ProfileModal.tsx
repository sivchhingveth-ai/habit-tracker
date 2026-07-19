import React, { useState } from 'react';
import { User as UserIcon, Sun, Moon, Check, Volume2, VolumeX, Timer } from 'lucide-react';
import useAppStore from '../store/appStore';
import { Modal } from './Modal';
import { AVATARS, avatarSrc } from '../utils/avatars';
import { useTimerSettings, SOUND_LABELS, SoundPreset, playSound } from '../utils/timerSettings';

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
  const { settings: timerSettings, update: updateTimer } = useTimerSettings();

  React.useEffect(() => {
    if (profileModalOpen) {
      setDraft(nickname);
      setDraftAvatar(avatar);
    }
  }, [profileModalOpen, nickname, avatar]);

  const initial = (draft.trim()[0] || '').toUpperCase() || '?';
  const selectedSrc = avatarSrc(draftAvatar);
  const labelClass = "text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1.5 block px-1";

  return (
    <Modal isOpen={profileModalOpen} onClose={closeProfileModal} title="Profile">
      <div className="space-y-5 px-1 pb-2">
        {/* Preview */}
        <div className="flex items-center gap-3 sm:gap-4 pt-2">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-[var(--bg-soft)] border border-[var(--border-soft)] flex items-center justify-center shrink-0 overflow-hidden shadow-lg">
            {selectedSrc ? (
              <img
                src={selectedSrc}
                alt="Selected avatar"
                className="w-full h-full object-contain"
                draggable={false}
              />
            ) : initial === '?' ? (
              <UserIcon className="w-7 h-7 text-[var(--text-muted)]" />
            ) : (
              <span className="text-2xl font-black text-[var(--text-primary)]">{initial}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[var(--text-primary)] font-bold text-base truncate">
              {draft.trim() || 'Add a nickname'}
            </p>
            <p className="text-[var(--text-muted)] text-[11px] font-semibold uppercase tracking-wider mt-0.5">
              Athlete profile
            </p>
          </div>
        </div>

        {/* Avatar Grid */}
        <div>
          <label className={labelClass}>Avatar</label>
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-2xl bg-[var(--bg-soft)] border border-[var(--border-soft)]">
            {/* Initial option */}
            <button
              type="button"
              onClick={() => setDraftAvatar('')}
              aria-pressed={!draftAvatar}
              title="Use your initial"
              className={`relative aspect-square rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                !draftAvatar
                  ? 'bg-[var(--bg-card)] border-2 border-[var(--brand)] shadow-[0_0_12px_var(--brand-medium)]'
                  : 'bg-[var(--bg-card)] border border-[var(--border-soft)] hover:border-[var(--border-medium)]'
              }`}
            >
              {initial === '?' ? (
                <UserIcon className="w-5 h-5 text-[var(--text-muted)]" />
              ) : (
                <span className="text-sm font-bold text-[var(--text-primary)]">{initial}</span>
              )}
              {!draftAvatar && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--brand)] flex items-center justify-center shadow">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />
                </span>
              )}
            </button>

            {/* PNG avatars */}
            {AVATARS.map(({ id, src, label }) => {
              const active = draftAvatar === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setDraftAvatar(id)}
                  aria-pressed={active}
                  title={label}
                  className={`relative aspect-square rounded-xl flex items-center justify-center transition-all active:scale-95 overflow-hidden ${
                    active
                      ? 'bg-[var(--bg-card)] border-2 border-[var(--brand)] shadow-[0_0_12px_var(--brand-medium)]'
                      : 'bg-[var(--bg-card)] border border-[var(--border-soft)] hover:border-[var(--border-medium)]'
                  }`}
                >
                  <img
                    src={src}
                    alt={label}
                    className="w-[85%] h-[85%] object-contain"
                    draggable={false}
                  />
                  {active && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--brand)] flex items-center justify-center shadow">
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-1.5 px-1">
            Pick an avatar, or use your initial.
          </p>
        </div>

        {/* Nickname */}
        <div>
          <label className={labelClass}>Nickname</label>
          <input
            className="w-full bg-[var(--bg-card)] border border-[var(--border-soft)] px-3 py-2.5 rounded-xl text-[14px] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-medium)] transition-all"
            placeholder="e.g. Beast Mode"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={24}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-1.5 px-1">
            Up to 24 characters. Used to greet you across the app.
          </p>
        </div>

        {/* Theme */}
        <div>
          <label className={labelClass}>Appearance</label>
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[var(--bg-soft)] border border-[var(--border-soft)]">
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
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                    active
                      ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={2.5} />
                  {label}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-1.5 px-1">
            Switch between light and dark mode. Your choice is saved on this device.
          </p>
        </div>

        {/* Timer Settings */}
        <div>
          <label className={labelClass}>Gym Timer</label>
          <div className="p-3 rounded-2xl bg-[var(--bg-soft)] border border-[var(--border-soft)] space-y-3">
            {/* Sound Preset */}
            <div>
              <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Timer className="w-3 h-3" />
                Ring Tone
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {(Object.keys(SOUND_LABELS) as SoundPreset[]).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => updateTimer({ sound: preset })}
                    className={`px-2 py-2 rounded-lg text-[10px] font-bold transition-all active:scale-95 ${
                      timerSettings.sound === preset
                        ? 'bg-[var(--text-primary)] text-[var(--bg-card)]'
                        : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-soft)]'
                    }`}
                  >
                    {SOUND_LABELS[preset]}
                  </button>
                ))}
              </div>
            </div>

            {/* Volume */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Volume</p>
                <span className="text-[10px] font-bold text-[var(--text-primary)]">{timerSettings.volume}%</span>
              </div>
              <div className="flex items-center gap-2">
                <VolumeX className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={timerSettings.volume}
                  onChange={(e) => updateTimer({ volume: Number(e.target.value) })}
                  className="flex-1 h-1.5 rounded-full appearance-none bg-[var(--border-soft)] cursor-pointer accent-[var(--text-primary)]"
                />
                <Volume2 className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
              </div>
            </div>

            {/* Tick toggle */}
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Countdown Ticks</p>
              <button
                type="button"
                onClick={() => updateTimer({ tickEnabled: !timerSettings.tickEnabled })}
                className={`relative w-9 h-5 rounded-full transition-all ${
                  timerSettings.tickEnabled ? 'bg-[var(--text-primary)]' : 'bg-[var(--border-medium)]'
                }`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
                  timerSettings.tickEnabled ? 'left-[18px]' : 'left-0.5'
                }`} />
              </button>
            </div>

            {/* Preview */}
            <button
              type="button"
              onClick={() => playSound(timerSettings.sound, timerSettings.volume)}
              className="w-full py-2 rounded-lg text-[10px] font-bold text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border-soft)] hover:text-[var(--text-primary)] transition-all active:scale-[0.98]"
            >
              Preview Sound
            </button>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] font-semibold mt-1.5 px-1">
            Configure the gym exercise timer sound and volume.
          </p>
        </div>

        {/* Save */}
        <button
          onClick={() => {
            setNickname(draft.trim().slice(0, 24));
            setAvatar(draftAvatar);
            closeProfileModal();
          }}
          className="x-button-primary w-full py-3 text-[14px]"
        >
          Save Profile
        </button>
      </div>
    </Modal>
  );
};

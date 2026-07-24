import React, { useState } from 'react';
import { User as UserIcon, Check, Volume2, VolumeX, Timer, ChevronRight, Play } from 'lucide-react';
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
  const [draft, setDraft] = useState(nickname);
  const [draftAvatar, setDraftAvatar] = useState(avatar);
  const [showAllAvatars, setShowAllAvatars] = useState(false);
  const { settings: timerSettings, update: updateTimer } = useTimerSettings();

  React.useEffect(() => {
    if (profileModalOpen) {
      setDraft(nickname);
      setDraftAvatar(avatar);
      setShowAllAvatars(false);
    }
  }, [profileModalOpen, nickname, avatar]);

  const initial = (draft.trim()[0] || '').toUpperCase() || '?';
  const selectedSrc = avatarSrc(draftAvatar);
  const visibleAvatars = showAllAvatars ? AVATARS : AVATARS.slice(0, 12);

  return (
    <Modal isOpen={profileModalOpen} onClose={closeProfileModal} title="Profile">
      <div className="space-y-3 pb-2">
        {/* ─── Section 1: Identity Card ─────────────────────── */}
        <div className="rounded-2xl border border-[var(--border-soft)] overflow-hidden">
          {/* Preview + Nickname */}
          <div className="p-4 flex items-center gap-4 bg-[var(--bg-tint)]">
            <div className="w-14 h-14 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-soft)] flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
              {selectedSrc ? (
                <img src={selectedSrc} alt="Avatar" className="w-full h-full object-contain" draggable={false} />
              ) : initial === '?' ? (
                <UserIcon className="w-6 h-6 text-[var(--text-muted)]" />
              ) : (
                <span className="text-xl font-black text-[var(--text-primary)]">{initial}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-[var(--text-primary)] truncate">
                {draft.trim() || 'Add a nickname'}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] font-medium mt-0.5">
                Athlete profile
              </p>
            </div>
          </div>

          {/* Nickname Input */}
          <div className="px-4 py-3 border-t border-[var(--border-soft)]">
            <label className="text-[11px] font-semibold text-[var(--text-muted)] mb-1.5 block">Nickname</label>
            <input
              className="w-full bg-[var(--bg-card)] border border-[var(--border-soft)] px-3 py-2 rounded-xl text-[14px] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-medium)] transition-all"
              placeholder="e.g. Beast Mode"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={24}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
        </div>

        {/* ─── Section 2: Avatar Picker ─────────────────────── */}
        <div className="rounded-2xl border border-[var(--border-soft)] overflow-hidden">
          <div className="px-4 py-3 flex items-center justify-between bg-[var(--bg-tint)]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[var(--bg-card)] border border-[var(--border-soft)] flex items-center justify-center overflow-hidden shrink-0">
                {selectedSrc ? (
                  <img src={selectedSrc} alt="" className="w-full h-full object-contain" draggable={false} />
                ) : (
                  <span className="text-[10px] font-bold text-[var(--text-primary)]">{initial}</span>
                )}
              </div>
              <span className="text-[13px] font-semibold text-[var(--text-primary)]">Avatar</span>
            </div>
            <button
              type="button"
              onClick={() => setShowAllAvatars(!showAllAvatars)}
              className="text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              {showAllAvatars ? 'Show less' : `Show all (${AVATARS.length})`}
            </button>
          </div>

          <div className="p-3">
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5">
              {/* Initial option */}
              <button
                type="button"
                onClick={() => setDraftAvatar('')}
                aria-pressed={!draftAvatar}
                title="Use your initial"
                className={`relative aspect-square rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                  !draftAvatar
                    ? 'bg-[var(--brand-soft)] border-2 border-[var(--brand)]'
                    : 'bg-[var(--bg-soft)] border border-[var(--border-soft)] hover:border-[var(--border-medium)]'
                }`}
              >
                {initial === '?' ? (
                  <UserIcon className="w-4 h-4 text-[var(--text-muted)]" />
                ) : (
                  <span className="text-xs font-bold text-[var(--text-primary)]">{initial}</span>
                )}
                {!draftAvatar && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[var(--brand)] flex items-center justify-center">
                    <Check className="w-2 h-2 text-white" strokeWidth={4} />
                  </span>
                )}
              </button>

              {/* PNG avatars */}
              {visibleAvatars.map(({ id, src, label }) => {
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
                        ? 'bg-[var(--brand-soft)] border-2 border-[var(--brand)]'
                        : 'bg-[var(--bg-soft)] border border-[var(--border-soft)] hover:border-[var(--border-medium)]'
                    }`}
                  >
                    <img src={src} alt={label} loading="lazy" decoding="async" className="w-[80%] h-[80%] object-contain" draggable={false} />
                    {active && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[var(--brand)] flex items-center justify-center">
                        <Check className="w-2 h-2 text-white" strokeWidth={4} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── Section 3: Gym Timer ─────────────────────────── */}
        <div className="rounded-2xl border border-[var(--border-soft)] overflow-hidden">
          <div className="p-4 bg-[var(--bg-tint)] flex items-center gap-2">
            <Timer className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span className="text-[13px] font-semibold text-[var(--text-primary)]">Gym Timer</span>
          </div>

          <div className="divide-y divide-[var(--border-soft)]">
            {/* Ring Tone */}
            <div className="p-4">
              <p className="text-[11px] font-semibold text-[var(--text-muted)] mb-2">Ring Tone</p>
              <div className="grid grid-cols-3 gap-1.5">
                {(Object.keys(SOUND_LABELS) as SoundPreset[]).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => updateTimer({ sound: preset })}
                    className={`px-2 py-2 rounded-lg text-[11px] font-semibold transition-all active:scale-95 ${
                      timerSettings.sound === preset
                        ? 'bg-[var(--text-primary)] text-[var(--bg-card)]'
                        : 'bg-[var(--bg-soft)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border-soft)]'
                    }`}
                  >
                    {SOUND_LABELS[preset]}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => playSound(timerSettings.sound, timerSettings.volume)}
                className="mt-2.5 w-full py-1.5 rounded-lg text-[10px] font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-soft)] transition-all flex items-center justify-center gap-1.5"
              >
                <Play className="w-3 h-3" fill="currentColor" />
                Preview
              </button>
            </div>

            {/* Volume */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-semibold text-[var(--text-muted)]">Volume</p>
                <span className="text-[12px] font-bold text-[var(--text-primary)] tabular-nums">{timerSettings.volume}%</span>
              </div>
              <div className="flex items-center gap-3">
                <VolumeX className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={timerSettings.volume}
                  onChange={(e) => updateTimer({ volume: Number(e.target.value) })}
                  className="flex-1 h-1.5 rounded-full appearance-none bg-[var(--border-soft)] cursor-pointer accent-[var(--text-primary)]"
                />
                <Volume2 className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
              </div>
            </div>

            {/* Countdown Ticks */}
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[var(--text-muted)]">Countdown Ticks</p>
                <p className="text-[10px] text-[var(--text-muted)]/60 mt-0.5">Tick sound for last 3 seconds</p>
              </div>
              <button
                type="button"
                onClick={() => updateTimer({ tickEnabled: !timerSettings.tickEnabled })}
                className={`relative w-11 h-6 rounded-full transition-all duration-200 ${
                  timerSettings.tickEnabled ? 'bg-[var(--brand)]' : 'bg-[var(--border-medium)]'
                }`}
                role="switch"
                aria-checked={timerSettings.tickEnabled}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-200 ${
                  timerSettings.tickEnabled ? 'left-[22px]' : 'left-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* ─── Save Button ──────────────────────────────────── */}
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

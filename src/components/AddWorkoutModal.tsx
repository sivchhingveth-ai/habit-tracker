import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, X } from 'lucide-react';
import { Modal } from './Modal';
import { Gender, Level, Exercise } from '../utils/workouts';
import { addCustomWorkout, updateCustomWorkout } from '../utils/customWorkouts';

const LEVELS: { key: Level; label: string }[] = [
  { key: 'beginner', label: 'Beginner' },
  { key: 'intermediate', label: 'Intermediate' },
  { key: 'advanced', label: 'Advanced' },
];

interface AddWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editWorkout?: {
    id: string;
    title: string;
    tagline: string;
    duration: string;
    level: Level;
    gender: Gender;
    exercises: Exercise[];
    tip: string;
  } | null;
}

export const AddWorkoutModal: React.FC<AddWorkoutModalProps> = ({
  isOpen, onClose, onSave, editWorkout,
}) => {
  const [title, setTitle] = useState(editWorkout?.title || '');
  const [tagline, setTagline] = useState(editWorkout?.tagline || '');
  const [level, setLevel] = useState<Level>(editWorkout?.level || 'beginner');
  const [gender, setGender] = useState<Gender>(editWorkout?.gender || 'men');
  const [tip, setTip] = useState(editWorkout?.tip || '');
  const [exercises, setExercises] = useState<Exercise[]>(
    editWorkout?.exercises || [
      { name: '', duration: '60 sec', reps: '' },
    ]
  );

  const addExercise = () => {
    setExercises([...exercises, { name: '', duration: '60 sec', reps: '' }]);
  };

  const removeExercise = (i: number) => {
    if (exercises.length <= 1) return;
    setExercises(exercises.filter((_, idx) => idx !== i));
  };

  const updateExercise = (i: number, patch: Partial<Exercise>) => {
    const next = [...exercises];
    next[i] = { ...next[i], ...patch };
    setExercises(next);
  };

  const estimatedDuration = exercises.reduce((acc, ex) => {
    const match = ex.duration.match(/(\d+)/);
    return acc + (match ? parseInt(match[1]) : 0);
  }, 0);

  const handleSave = () => {
    if (!title.trim()) return;
    const validExercises = exercises.filter((e) => e.name.trim());
    if (validExercises.length === 0) return;

    const data = {
      title: title.trim(),
      tagline: tagline.trim() || 'My custom workout',
      duration: `${Math.ceil(estimatedDuration / 60)} min`,
      level,
      gender,
      exercises: validExercises,
      tip: tip.trim() || 'Listen to your body. Stay consistent.',
    };

    if (editWorkout) {
      updateCustomWorkout(editWorkout.id, data);
    } else {
      addCustomWorkout(data);
    }
    onSave();
    onClose();
  };

  const inputCls = 'w-full rounded-xl px-3 py-2.5 text-[14px] bg-[var(--bg-soft)] border border-[var(--border-soft)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30 transition-all';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editWorkout ? 'Edit Workout' : 'Create Workout'}>
      <div className="space-y-5">

        {/* Basic info */}
        <div className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-[var(--text-secondary)] mb-1 block">Name</label>
            <input
              className={inputCls}
              placeholder="e.g. My Morning Burn"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={30}
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[var(--text-secondary)] mb-1 block">Tagline</label>
            <input
              className={inputCls}
              placeholder="e.g. Quick full-body blast"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              maxLength={60}
            />
          </div>
        </div>

        {/* Level + Gender */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-[var(--text-secondary)] mb-1.5 block">Level</label>
            <div className="flex gap-1.5">
              {LEVELS.map((l) => (
                <button
                  key={l.key}
                  onClick={() => setLevel(l.key)}
                  className={`flex-1 py-2 rounded-xl text-[12px] font-semibold transition-all active:scale-95 ${
                    level === l.key
                      ? 'bg-[var(--accent)] text-white shadow-md'
                      : 'bg-[var(--bg-soft)] text-[var(--text-secondary)] hover:bg-[var(--border-medium)]'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-[var(--text-secondary)] mb-1.5 block">For</label>
            <div className="flex gap-1.5">
              {(['men', 'women'] as Gender[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 py-2 rounded-xl text-[12px] font-semibold capitalize transition-all active:scale-95 ${
                    gender === g
                      ? 'bg-[var(--accent)] text-white shadow-md'
                      : 'bg-[var(--bg-soft)] text-[var(--text-secondary)] hover:bg-[var(--border-medium)]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Exercises */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-semibold text-[var(--text-secondary)]">
              Exercises ({exercises.length})
            </label>
            <span className="text-[10px] text-[var(--text-muted)]">~{Math.ceil(estimatedDuration / 60)} min</span>
          </div>
          <div className="space-y-2">
            {exercises.map((ex, i) => (
              <div key={i} className="flex items-start gap-2 group">
                <span className="w-5 h-5 rounded-lg bg-[var(--bg-soft)] flex items-center justify-center text-[10px] font-bold text-[var(--text-muted)] mt-2.5 shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_90px_80px] gap-1.5">
                  <input
                    className={inputCls + ' !py-2 !text-[13px]'}
                    placeholder="Exercise name"
                    value={ex.name}
                    onChange={(e) => updateExercise(i, { name: e.target.value })}
                  />
                  <input
                    className={inputCls + ' !py-2 !text-[13px]'}
                    placeholder="60 sec"
                    value={ex.duration}
                    onChange={(e) => updateExercise(i, { duration: e.target.value })}
                  />
                  <input
                    className={inputCls + ' !py-2 !text-[13px]'}
                    placeholder="reps (opt)"
                    value={ex.reps || ''}
                    onChange={(e) => updateExercise(i, { reps: e.target.value })}
                  />
                </div>
                <button
                  onClick={() => removeExercise(i)}
                  className="w-11 h-11 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-all mt-1.5 md:opacity-0 md:group-hover:opacity-100 active:scale-90 touch-manipulation"
                  style={{ touchAction: 'manipulation' }}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addExercise}
            className="w-full mt-2 py-2 rounded-xl border border-dashed border-[var(--border-medium)] text-[12px] font-semibold text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all active:scale-[0.98]"
          >
            + Add Exercise
          </button>
        </div>

        {/* Tip */}
        <div>
          <label className="text-[11px] font-semibold text-[var(--text-secondary)] mb-1 block">Tip (optional)</label>
          <textarea
            className={inputCls + ' resize-none'}
            rows={2}
            placeholder="Any advice for this workout..."
            value={tip}
            onChange={(e) => setTip(e.target.value)}
            maxLength={150}
          />
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={!title.trim() || exercises.every((e) => !e.name.trim())}
          className="w-full py-3 rounded-2xl bg-[var(--accent)] text-white text-[14px] font-bold shadow-lg hover:shadow-xl hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-lg"
        >
          {editWorkout ? 'Save Changes' : 'Create Workout'}
        </button>
      </div>
    </Modal>
  );
};

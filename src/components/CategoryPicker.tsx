import React, { useState } from 'react';
import { Check, Plus, X, Pencil, Trash2 } from 'lucide-react';
import {
  useCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  CATEGORY_COLOR_SWATCHES,
  Category,
} from '../utils/categories';

interface CategoryPickerProps {
  value: string;                    // selected category id (habit.time)
  onChange: (categoryId: string) => void;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({ value, onChange }) => {
  const categories = useCategories();
  const [manageMode, setManageMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [draftColor, setDraftColor] = useState(CATEGORY_COLOR_SWATCHES[0]);
  const [adding, setAdding] = useState(false);

  const resetDraft = () => {
    setDraftName('');
    setDraftColor(CATEGORY_COLOR_SWATCHES[0]);
    setEditingId(null);
    setAdding(false);
  };

  const beginAdd = () => {
    resetDraft();
    setAdding(true);
  };

  const beginEdit = (c: Category) => {
    setAdding(false);
    setEditingId(c.id);
    setDraftName(c.label);
    setDraftColor(c.color);
  };

  const saveDraft = () => {
    const name = draftName.trim();
    if (!name) return;
    if (editingId) {
      updateCategory(editingId, { label: name, color: draftColor });
    } else {
      const created = addCategory(name, draftColor);
      onChange(created.id);
    }
    resetDraft();
  };

  const handleDelete = (c: Category) => {
    if (value === c.id) onChange('');
    deleteCategory(c.id);
    if (editingId === c.id) resetDraft();
  };

  const showForm = adding || editingId !== null;

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mt-1">
        {categories.map((c) => {
          const active = value === c.id;
          return (
            <div key={c.id} className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (manageMode) beginEdit(c);
                  else onChange(c.id);
                }}
                className="px-2.5 py-1.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-wider transition-all border flex items-center gap-1.5"
                style={
                  active
                    ? { backgroundColor: c.color, borderColor: c.color, color: '#fff' }
                    : { backgroundColor: 'var(--bg-soft)', borderColor: 'var(--border-soft)', color: 'var(--text-muted)' }
                }
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: active ? '#fff' : c.color }}
                />
                {c.label}
                {manageMode && <Pencil className="w-2.5 h-2.5 ml-0.5 opacity-70" />}
              </button>
              {manageMode && categories.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); handleDelete(c); }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[var(--accent-deep)] text-white flex items-center justify-center shadow-sm"
                  aria-label={`Delete ${c.label}`}
                >
                  <X className="w-2.5 h-2.5" strokeWidth={3} />
                </button>
              )}
            </div>
          );
        })}

        {!showForm && (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); beginAdd(); }}
            className="px-2.5 py-1.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-wider border border-dashed border-[var(--border-medium)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-all flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            New
          </button>
        )}

        <button
          type="button"
          onClick={(e) => { e.preventDefault(); setManageMode((m) => !m); if (manageMode) resetDraft(); }}
          className={`px-2 py-1.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-wider border transition-all flex items-center gap-1 ${
            manageMode
              ? 'bg-[var(--brand-soft)] border-[var(--brand)] text-[var(--brand)]'
              : 'border-[var(--border-soft)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          {manageMode ? <Check className="w-3 h-3" /> : <Pencil className="w-3 h-3" />}
        </button>
      </div>

      {showForm && (
        <div className="mt-2 p-2.5 rounded-xl border border-[var(--border-soft)] bg-[var(--bg-tint)] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); saveDraft(); } }}
              placeholder={editingId ? 'Rename category' : 'New category name'}
              maxLength={20}
              className="flex-1 min-w-0 bg-[var(--bg-card)] border border-[var(--border-soft)] px-2.5 py-1.5 rounded-lg text-[12px] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:border-[var(--brand)]"
            />
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); saveDraft(); }}
              disabled={!draftName.trim()}
              className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-[var(--brand)] text-white disabled:opacity-40 transition-all"
            >
              {editingId ? 'Save' : 'Add'}
            </button>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); resetDraft(); }}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              aria-label="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {CATEGORY_COLOR_SWATCHES.map((color) => (
              <button
                key={color}
                type="button"
                onClick={(e) => { e.preventDefault(); setDraftColor(color); }}
                className="w-6 h-6 rounded-full transition-all flex items-center justify-center"
                style={{
                  backgroundColor: color,
                  outline: draftColor === color ? '2px solid var(--text-primary)' : 'none',
                  outlineOffset: '1px',
                }}
                aria-label={`Color ${color}`}
              >
                {draftColor === color && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

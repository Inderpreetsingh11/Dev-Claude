import { useState } from 'react';
import type { FamilyMember } from '../../types';
import { AVATAR_COLORS, RELATIONSHIPS } from '../../types';
import { Modal } from '../ui/Modal';

interface MemberFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (member: Omit<FamilyMember, 'id'> | FamilyMember) => void;
  initial?: FamilyMember;
}

export function MemberForm({ open, onClose, onSave, initial }: MemberFormProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [relationship, setRelationship] = useState(initial?.relationship ?? 'Self');
  const [avatarColor, setAvatarColor] = useState(initial?.avatarColor ?? AVATAR_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(initial ? { ...initial, name: name.trim(), relationship, avatarColor } : { name: name.trim(), relationship, avatarColor });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Edit Member' : 'Add Family Member'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Mom"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500"
            autoFocus
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Relationship</label>
          <select
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-medical-500"
          >
            {RELATIONSHIPS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
          <div className="flex gap-2 flex-wrap">
            {AVATAR_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setAvatarColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  avatarColor === c ? 'border-slate-800 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="mt-2 px-4 py-2.5 bg-medical-600 text-white rounded-lg font-medium hover:bg-medical-700 transition-colors"
        >
          {initial ? 'Save Changes' : 'Add Member'}
        </button>
      </form>
    </Modal>
  );
}

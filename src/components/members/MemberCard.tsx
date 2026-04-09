import type { FamilyMember } from '../../types';
import { Pencil, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface MemberCardProps {
  member: FamilyMember;
  reportCount: number;
  onEdit: () => void;
  onDelete: () => void;
  onSelect: () => void;
}

export function MemberCard({ member, reportCount, onEdit, onDelete, onSelect }: MemberCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: member.avatarColor }}
          >
            {member.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{member.name}</h3>
            <p className="text-sm text-slate-400">{member.relationship}</p>
          </div>
        </div>
        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <button onClick={onEdit} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <Pencil className="w-4 h-4 text-slate-400" />
          </button>
          <button onClick={onDelete} className="p-1.5 hover:bg-danger-50 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4 text-slate-400 hover:text-danger-500" />
          </button>
        </div>
      </div>
      <div className="mt-3 text-sm text-slate-500">
        {reportCount} report{reportCount !== 1 ? 's' : ''}
      </div>
    </motion.div>
  );
}

import { useCallback } from 'react';
import type { FamilyMember } from '../types';
import { useLocalStorage } from './useLocalStorage';

export function useFamilyMembers() {
  const [members, setMembers] = useLocalStorage<FamilyMember[]>('medtrack:members', []);

  const addMember = useCallback(
    (member: Omit<FamilyMember, 'id'>) => {
      setMembers((prev) => [...prev, { ...member, id: crypto.randomUUID() }]);
    },
    [setMembers],
  );

  const updateMember = useCallback(
    (member: FamilyMember) => {
      setMembers((prev) => prev.map((m) => (m.id === member.id ? member : m)));
    },
    [setMembers],
  );

  const deleteMember = useCallback(
    (id: string) => {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    },
    [setMembers],
  );

  return { members, addMember, updateMember, deleteMember };
}

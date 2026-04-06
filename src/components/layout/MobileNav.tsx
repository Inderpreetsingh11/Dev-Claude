import { LayoutDashboard, FileText, TrendingUp, Users, Settings } from 'lucide-react';
import type { Page } from './Sidebar';

interface MobileNavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: Array<{ page: Page; label: string; icon: typeof LayoutDashboard }> = [
  { page: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { page: 'reports', label: 'Reports', icon: FileText },
  { page: 'trends', label: 'Trends', icon: TrendingUp },
  { page: 'members', label: 'Members', icon: Users },
  { page: 'settings', label: 'Settings', icon: Settings },
];

export function MobileNav({ currentPage, onNavigate }: MobileNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40">
      <div className="flex justify-around py-2">
        {navItems.map(({ page, label, icon: Icon }) => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-colors ${
              currentPage === page ? 'text-medical-600' : 'text-slate-400'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}

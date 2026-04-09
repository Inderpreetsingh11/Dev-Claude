import { LayoutDashboard, FileText, TrendingUp, Users, Settings } from 'lucide-react';

export type Page = 'dashboard' | 'reports' | 'trends' | 'members' | 'settings';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: Array<{ page: Page; label: string; icon: typeof LayoutDashboard }> = [
  { page: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { page: 'reports', label: 'Reports', icon: FileText },
  { page: 'trends', label: 'Trends', icon: TrendingUp },
  { page: 'members', label: 'Members', icon: Users },
  { page: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-56 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)]">
      <nav className="flex flex-col gap-1 p-3">
        {navItems.map(({ page, label, icon: Icon }) => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentPage === page
                ? 'bg-medical-50 text-medical-700'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

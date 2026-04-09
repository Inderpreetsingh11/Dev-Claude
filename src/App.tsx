import { useState, useCallback } from 'react';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/ui/Toast';
import type { ToastData } from './components/ui/Toast';
import type { Page } from './components/layout/Sidebar';
import type { FamilyMember } from './types';

import { DashboardPage } from './pages/DashboardPage';
import { ReportsPage } from './pages/ReportsPage';
import { TrendsPage } from './pages/TrendsPage';
import { MembersPage } from './pages/MembersPage';
import { SettingsPage } from './pages/SettingsPage';

import { useFamilyMembers } from './hooks/useFamilyMembers';
import { useLabReports } from './hooks/useLabReports';
import { useOllamaStatus } from './hooks/useOllamaStatus';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const { members, addMember, updateMember, deleteMember } = useFamilyMembers();
  const { allReports, addReport, updateReport, deleteReport } = useLabReports();
  const { isConnected: ollamaConnected } = useOllamaStatus();

  const toast = useCallback((type: ToastData['type'], message: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleSelectMemberFromList = useCallback((id: string) => {
    setSelectedMemberId(id);
    setCurrentPage('dashboard');
  }, []);

  const handleDeleteMember = useCallback(
    (id: string) => {
      deleteMember(id);
      if (selectedMemberId === id) setSelectedMemberId(null);
      toast('success', 'Member deleted');
    },
    [deleteMember, selectedMemberId, toast],
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DashboardPage
            members={members}
            reports={allReports}
            selectedMemberId={selectedMemberId}
            onNavigate={setCurrentPage as (page: 'members') => void}
          />
        );
      case 'reports':
        return (
          <ReportsPage
            members={members}
            reports={allReports}
            selectedMemberId={selectedMemberId}
            onAddReport={(r) => { addReport(r); toast('success', `Report added with ${r.tests.length} tests`); }}
            onUpdateReport={(r) => { updateReport(r); toast('success', 'Report updated'); }}
            onDeleteReport={(id) => { deleteReport(id); toast('success', 'Report deleted'); }}
            ollamaConnected={ollamaConnected}
            onNavigate={setCurrentPage as (page: 'members') => void}
          />
        );
      case 'trends':
        return (
          <TrendsPage
            members={members}
            reports={allReports}
            selectedMemberId={selectedMemberId}
          />
        );
      case 'members':
        return (
          <MembersPage
            members={members}
            allReports={allReports}
            onAddMember={(m) => { addMember(m); toast('success', 'Member added'); }}
            onUpdateMember={(m: FamilyMember) => { updateMember(m); toast('success', 'Member updated'); }}
            onDeleteMember={handleDeleteMember}
            onSelectMember={handleSelectMemberFromList}
          />
        );
      case 'settings':
        return <SettingsPage onToast={toast} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50">
        <Header
          members={members}
          selectedMemberId={selectedMemberId}
          onSelectMember={setSelectedMemberId}
          ollamaConnected={ollamaConnected}
        />
        <div className="flex">
          <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
          <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 max-w-5xl">
            {renderPage()}
          </main>
        </div>
        <MobileNav currentPage={currentPage} onNavigate={setCurrentPage} />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </div>
    </ErrorBoundary>
  );
}

"use client";

import { CRMProvider, useCRM } from "./store";
import { LoginScreen } from "./auth/login";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { DashboardView } from "./views/dashboard";
import { CandidatesView } from "./views/candidates";
import { PipelineView } from "./views/pipeline";
import { RequisitionsView } from "./views/requisitions";
import { ClientsView } from "./views/clients";
import { SubmissionsView } from "./views/submissions";
import { ReportsView } from "./views/reports";
import { SettingsView } from "./views/settings";
import { CandidatePanel } from "./panels/candidate-panel";
import { RequisitionPanel, ClientPanel } from "./panels/other-panels";
import { NewRecordModal } from "./modals/new-record-modal";
import { ConfirmDialog, ToastStack } from "./common/overlays";

function AppShell() {
  const {
    isAuthenticated,
    activeView,
    selectedCandidateId,
    selectedRequisitionId,
    selectedClientId,
    showNewRecordModal,
    confirmDialog,
    closeConfirm,
  } = useCRM();

  if (!isAuthenticated) return <LoginScreen />;

  const VIEW_MAP = {
    dashboard: <DashboardView />,
    candidates: <CandidatesView />,
    pipeline: <PipelineView />,
    requisitions: <RequisitionsView />,
    clients: <ClientsView />,
    submissions: <SubmissionsView />,
    reports: <ReportsView />,
    settings: <SettingsView />,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {VIEW_MAP[activeView] ?? <DashboardView />}
        </main>
      </div>

      {/* Slide-over panels */}
      {selectedCandidateId && <CandidatePanel />}
      {selectedRequisitionId && <RequisitionPanel />}
      {selectedClientId && <ClientPanel />}

      {/* Modals */}
      {showNewRecordModal && <NewRecordModal />}

      {/* Confirm dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onClose={closeConfirm}
      />

      {/* Toasts */}
      <ToastStack />
    </div>
  );
}

export function CRMApp() {
  return (
    <CRMProvider>
      <AppShell />
    </CRMProvider>
  );
}

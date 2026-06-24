'use client';

import { useAppStore } from '@/lib/store';
import { LandingPage } from '@/components/landing/landing-page';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { DashboardView } from '@/components/dashboard/dashboard-view';
import { ResumeAnalysis } from '@/components/resume/resume-analysis';
import { JDAnalysis } from '@/components/jd/jd-analysis';
import { IPSDisplay } from '@/components/ips/ips-display';
import { HealthCard } from '@/components/ips/health-card';
import { ApplicationTracker } from '@/components/applications/application-tracker';
import { CareerInsights } from '@/components/insights/career-insights';
import { SettingsView } from '@/components/dashboard/settings-view';
import { ScrollArea } from '@/components/ui/scroll-area';

function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <main className="flex-1 min-w-0">
        <div className="h-16 border-b border-border/50 lg:block hidden" />
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
            {children}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}

export default function HomePage() {
  const { currentView, isAuthenticated } = useAppStore();

  // Landing page for non-authenticated users
  if (!isAuthenticated || currentView === 'landing') {
    return <LandingPage />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <DashboardView />;
      case 'resume': return <ResumeAnalysis />;
      case 'jd': return <JDAnalysis />;
      case 'ips': return <IPSDisplay />;
      case 'health-card': return <HealthCard />;
      case 'applications': return <ApplicationTracker />;
      case 'insights': return <CareerInsights />;
      case 'settings': return <SettingsView />;
      default: return <DashboardView />;
    }
  };

  return <DashboardShell>{renderView()}</DashboardShell>;
}
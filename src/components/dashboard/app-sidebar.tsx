'use client';

import { useAppStore } from '@/lib/store';
import type { AppView } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard, FileText, FileSearch, Target,
  ClipboardList, TrendingUp, Share2, Settings,
  LogOut, Zap, X, ChevronLeft
} from 'lucide-react';

const navItems: { icon: typeof LayoutDashboard; label: string; view: AppView }[] = [
  { icon: LayoutDashboard, label: 'Dashboard', view: 'dashboard' },
  { icon: FileText, label: 'Resume Analysis', view: 'resume' },
  { icon: FileSearch, label: 'JD Analysis', view: 'jd' },
  { icon: Target, label: 'IPS Score', view: 'ips' },
  { icon: ClipboardList, label: 'Applications', view: 'applications' },
  { icon: TrendingUp, label: 'Career Insights', view: 'insights' },
  { icon: Share2, label: 'Health Card', view: 'health-card' },
  { icon: Settings, label: 'Settings', view: 'settings' },
];

export function AppSidebar() {
  const { currentView, setCurrentView, sidebarOpen, setSidebarOpen, userName, logout } = useAppStore();

  const handleNav = (view: AppView) => {
    setCurrentView(view);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-72 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">CareerGraph</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Nav */}
        <ScrollArea className="flex-1 py-4 px-3 custom-scrollbar">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNav(item.view)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                      : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
                  )}
                >
                  <item.icon className={cn('w-5 h-5 shrink-0', isActive && 'text-primary')} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </ScrollArea>

        {/* User section */}
        <div className="border-t border-sidebar-border p-4 shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
              {userName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">Free Plan</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile toggle button */}
      {!sidebarOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-30 lg:hidden h-10 w-10 rounded-full bg-card shadow-md border border-border"
          onClick={() => setSidebarOpen(true)}
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
      )}
    </>
  );
}
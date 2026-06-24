import { create } from 'zustand';
import type { AppView, ParsedResume, ParsedJD, IPSScore, Application, DashboardStats } from './types';

interface AppState {
  // Navigation
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  // Auth
  isAuthenticated: boolean;
  userName: string;
  userEmail: string;
  login: (name: string, email: string) => void;
  logout: () => void;

  // Resume
  currentResume: ParsedResume | null;
  resumeRawText: string;
  resumeId: string | null;
  setResume: (resume: ParsedResume, rawText: string, id?: string) => void;
  clearResume: () => void;

  // Job Description
  currentJD: ParsedJD | null;
  jdRawText: string;
  jdId: string | null;
  setJD: (jd: ParsedJD, rawText: string, id?: string) => void;
  clearJD: () => void;

  // IPS Score
  currentIPS: IPSScore | null;
  setIPS: (ips: IPSScore) => void;
  clearIPS: () => void;

  // Applications
  applications: Application[];
  setApplications: (apps: Application[]) => void;
  addApplication: (app: Application) => void;
  updateApplication: (id: string, updates: Partial<Application>) => void;
  removeApplication: (id: string) => void;

  // Dashboard Stats
  dashboardStats: DashboardStats | null;
  setDashboardStats: (stats: DashboardStats) => void;

  // UI
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Navigation
  currentView: 'landing',
  setCurrentView: (view) => set({ currentView: view }),

  // Auth
  isAuthenticated: false,
  userName: '',
  userEmail: '',
  login: (name, email) => set({ isAuthenticated: true, userName: name, userEmail: email }),
  logout: () => set({
    isAuthenticated: false, userName: '', userEmail: '',
    currentView: 'landing', currentResume: null, currentJD: null, currentIPS: null,
    applications: [], dashboardStats: null
  }),

  // Resume
  currentResume: null,
  resumeRawText: '',
  resumeId: null,
  setResume: (resume, rawText, id) => set({ currentResume: resume, resumeRawText: rawText, resumeId: id || null }),
  clearResume: () => set({ currentResume: null, resumeRawText: '', resumeId: null }),

  // Job Description
  currentJD: null,
  jdRawText: '',
  jdId: null,
  setJD: (jd, rawText, id) => set({ currentJD: jd, jdRawText: rawText, jdId: id || null }),
  clearJD: () => set({ currentJD: null, jdRawText: '', jdId: null }),

  // IPS Score
  currentIPS: null,
  setIPS: (ips) => set({ currentIPS: ips }),
  clearIPS: () => set({ currentIPS: null }),

  // Applications
  applications: [],
  setApplications: (apps) => set({ applications: apps }),
  addApplication: (app) => set((s) => ({ applications: [app, ...s.applications] })),
  updateApplication: (id, updates) => set((s) => ({
    applications: s.applications.map((a) => a.id === id ? { ...a, ...updates } : a)
  })),
  removeApplication: (id) => set((s) => ({
    applications: s.applications.filter((a) => a.id !== id)
  })),

  // Dashboard Stats
  dashboardStats: null,
  setDashboardStats: (stats) => set({ dashboardStats: stats }),

  // UI
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  isAnalyzing: false,
  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
}));
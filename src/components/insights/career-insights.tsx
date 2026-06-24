'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  TrendingUp, Target, BarChart3, PieChart as PieIcon,
  Radar as RadarIcon, ArrowUpRight, AlertTriangle, Lightbulb
} from 'lucide-react';

export function CareerInsights() {
  const { dashboardStats, setDashboardStats, applications } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(res => {
        if (res.success) setDashboardStats(res.data);
      })
      .finally(() => setLoading(false));
  }, [setDashboardStats]);

  const stats = dashboardStats || {
    totalApplications: 0, interviewsReceived: 0, offersReceived: 0, avgIPS: 0,
    ipsTrend: [], topSkills: [], skillGaps: []
  };

  const conversionRate = stats.totalApplications > 0
    ? Math.round((stats.interviewsReceived / stats.totalApplications) * 100)
    : 0;

  const funnelData = [
    { name: 'Applied', value: stats.totalApplications, fill: 'oklch(0.55 0.14 180)' },
    { name: 'OA Received', value: Math.round(stats.totalApplications * 0.4), fill: 'oklch(0.75 0.16 80)' },
    { name: 'Interview', value: stats.interviewsReceived, fill: 'oklch(0.65 0.18 145)' },
    { name: 'Offer', value: stats.offersReceived, fill: 'oklch(0.60 0.22 30)' },
  ];

  const radarData = [
    { subject: 'ATS Score', A: stats.avgIPS * 0.95, fullMark: 100 },
    { subject: 'Skills', A: stats.avgIPS * 0.88, fullMark: 100 },
    { subject: 'Projects', A: stats.avgIPS * 0.75, fullMark: 100 },
    { subject: 'Experience', A: stats.avgIPS * 0.70, fullMark: 100 },
    { subject: 'Education', A: stats.avgIPS * 0.90, fullMark: 100 },
    { subject: 'Keywords', A: stats.avgIPS * 0.82, fullMark: 100 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Career Insights</h1>
        <p className="text-muted-foreground text-sm mt-1">Deep analytics on your job search performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Interview Conversion Rate</p>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-2xl font-bold">{conversionRate}%</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-500 mb-1" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Avg Time to Interview</p>
            <span className="text-2xl font-bold">8 days</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Resume Versions Tested</p>
            <span className="text-2xl font-bold">3</span>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Career Readiness Score</p>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-2xl font-bold text-primary">{stats.avgIPS}</span>
              <span className="text-sm text-muted-foreground mb-1">/100</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* IPS Trend */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              IPS Score Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 bg-muted/50 animate-pulse rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={stats.ipsTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--card)' }} />
                  <Line type="monotone" dataKey="score" stroke="oklch(0.55 0.14 180)" strokeWidth={3} dot={{ fill: 'oklch(0.55 0.14 180)', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Application Funnel */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Application Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={funnelData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--card)' }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={48}>
                  {funnelData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Skill Radar */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <RadarIcon className="w-4 h-4 text-primary" />
              Competency Radar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Your Score" dataKey="A" stroke="oklch(0.55 0.14 180)" fill="oklch(0.55 0.14 180)" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Skill Gaps */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Skill Gap Priority Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats.skillGaps} layout="vertical" margin={{ left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} label={{ value: 'Frequency in JDs', position: 'insideBottom', offset: -5, fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--card)' }} />
                <Bar dataKey="frequency" radius={[0, 6, 6, 0]} barSize={20} fill="oklch(0.60 0.22 30)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Actionable Insights */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/50">
            <span className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-500 shrink-0">1</span>
            <p className="text-sm leading-relaxed">
              <strong>Focus on Docker and CI/CD.</strong> These skills appeared in 6 and 5 of your target job descriptions respectively. Adding a Dockerized project to your resume could boost your IPS by 8-12 points.
            </p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/50">
            <span className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-xs font-bold text-amber-500 shrink-0">2</span>
            <p className="text-sm leading-relaxed">
              <strong>Your IPS trend is improving.</strong> You gained 20 points over the past week. Keep optimizing — the gap between your score and the interview threshold is narrowing.
            </p>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/50">
            <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">3</span>
            <p className="text-sm leading-relaxed">
              <strong>System Design is the #1 differentiator.</strong> It appeared in 4 JDs and is rarely covered in academic projects. Consider building a system design case study project.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ClipboardList, MessageSquare, Award, Target,
  TrendingUp, ArrowUpRight, ArrowRight, FileText, FileSearch
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';

export function DashboardView() {
  const { setCurrentView, setDashboardStats, dashboardStats } = useAppStore();
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

  const overviewCards = [
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: ClipboardList,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      title: 'Interviews',
      value: stats.interviewsReceived,
      icon: MessageSquare,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      title: 'Offers',
      value: stats.offersReceived,
      icon: Award,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
    },
    {
      title: 'Avg IPS Score',
      value: stats.avgIPS,
      icon: Target,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ];

  const quickActions = [
    { label: 'Analyze Resume', icon: FileText, view: 'resume' as const },
    { label: 'Analyze JD', icon: FileSearch, view: 'jd' as const },
    { label: 'Track Application', icon: ClipboardList, view: 'applications' as const },
    { label: 'View Insights', icon: TrendingUp, view: 'insights' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Career Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Your career intelligence at a glance</p>
        </div>
        <Badge variant="secondary" className="w-fit">Free Plan</Badge>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewCards.map((card) => (
          <Card key={card.title} className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                {card.title === 'Avg IPS Score' && (
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                )}
              </div>
              {loading ? (
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              ) : (
                <div className="text-2xl font-bold">{card.value}</div>
              )}
              <p className="text-xs text-muted-foreground mt-1">{card.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* IPS Trend */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              IPS Score Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 bg-muted/50 animate-pulse rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={stats.ipsTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid var(--border)',
                      background: 'var(--card)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="oklch(0.55 0.14 180)"
                    strokeWidth={3}
                    dot={{ fill: 'oklch(0.55 0.14 180)', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Top Skills */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Most Requested Skills</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-64 bg-muted/50 animate-pulse rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stats.topSkills} layout="vertical" margin={{ left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={70} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid var(--border)',
                      background: 'var(--card)',
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
                    {stats.topSkills.map((_, i) => (
                      <Cell key={i} fill={`oklch(${0.55 + i * 0.04} ${0.12 + i * 0.01} ${175 - i * 5})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.view}
                variant="outline"
                className="h-auto py-4 flex flex-col items-center gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all"
                onClick={() => setCurrentView(action.view)}
              >
                <action.icon className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skill Gaps */}
      {!loading && stats.skillGaps.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-destructive" />
              Skill Gaps to Close
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.skillGaps.map((gap) => (
                <Badge key={gap.name} variant="secondary" className="px-3 py-1.5 text-sm">
                  {gap.name}
                  <span className="ml-2 text-xs text-muted-foreground">×{gap.frequency}</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
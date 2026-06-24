'use client';

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Target, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle2, XCircle, Lightbulb, Share2, ClipboardList, FileSearch
} from 'lucide-react';
import { cn } from '@/lib/utils';

function ScoreRing({ score, label, size = 'md' }: { score: number; label: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 100, md: 140, lg: 200 };
  const fontSize = { sm: 'text-xl', md: 'text-3xl', lg: 'text-5xl' };
  const strokeWidth = { sm: 6, md: 8, lg: 10 };
  const r = (sizes[size] - strokeWidth[size]) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return 'stroke-emerald-500';
    if (s >= 60) return 'stroke-amber-500';
    if (s >= 40) return 'stroke-orange-500';
    return 'stroke-red-500';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: sizes[size], height: sizes[size] }}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${sizes[size]} ${sizes[size]}`}>
          <circle
            cx={sizes[size] / 2}
            cy={sizes[size] / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            className="text-muted/30"
            strokeWidth={strokeWidth[size]}
          />
          <circle
            cx={sizes[size] / 2}
            cy={sizes[size] / 2}
            r={r}
            fill="none"
            className={getColor(score)}
            strokeWidth={strokeWidth[size]}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-bold', fontSize[size])}>{score}</span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground font-medium">{label}</p>
    </div>
  );
}

export function IPSDisplay() {
  const { currentIPS, currentResume, currentJD, setCurrentView } = useAppStore();

  if (!currentIPS) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Interview Probability Score</h1>
          <p className="text-muted-foreground text-sm mt-1">Match your resume against a job description to see your IPS</p>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <Target className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No IPS Score Yet</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Upload your resume and a job description first. We&apos;ll calculate your Interview Probability Score with specific, actionable feedback.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => setCurrentView('resume')}>
                <FileSearch className="w-4 h-4 mr-2" /> Upload Resume
              </Button>
              <Button className="bg-primary text-primary-foreground" onClick={() => setCurrentView('jd')}>
                <FileSearch className="w-4 h-4 mr-2" /> Add Job Description
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getPercentile = (score: number) => {
    if (score >= 90) return 'Top 5%';
    if (score >= 80) return 'Top 10%';
    if (score >= 70) return 'Top 25%';
    if (score >= 60) return 'Top 50%';
    if (score >= 50) return 'Top 75%';
    return 'Bottom 50%';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Interview Probability Score</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {currentJD?.title} at {currentJD?.company || 'Unknown'}
        </p>
      </div>

      {/* Main Score */}
      <Card className="border-primary/20">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <ScoreRing score={currentIPS.overall} label="Overall IPS" size="lg" />
            <div className="flex-1 w-full space-y-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">ATS Compatibility</span>
                  <span className="text-sm font-bold">{currentIPS.ats}/100</span>
                </div>
                <Progress value={currentIPS.ats} className="h-2.5" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Skills Match</span>
                  <span className="text-sm font-bold">{currentIPS.skills}/100</span>
                </div>
                <Progress value={currentIPS.skills} className="h-2.5" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Project Relevance</span>
                  <span className="text-sm font-bold">{currentIPS.projects}/100</span>
                </div>
                <Progress value={currentIPS.projects} className="h-2.5" />
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {getPercentile(currentIPS.overall)} of Junior SDE Candidates
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths & Weaknesses */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentIPS.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">{s}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-500" />
              Weaknesses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {currentIPS.weaknesses.map((w, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">{w}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Missing Skills & Keywords */}
      <div className="grid lg:grid-cols-2 gap-6">
        {currentIPS.missingSkills.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Missing Skills ({currentIPS.missingSkills.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {currentIPS.missingSkills.map((skill) => (
                  <Badge key={skill} variant="outline" className="px-3 py-1.5 text-sm border-amber-500/30 text-amber-600">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {currentIPS.missingKeywords.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                Missing Keywords ({currentIPS.missingKeywords.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {currentIPS.missingKeywords.map((kw) => (
                  <Badge key={kw} variant="outline" className="px-3 py-1.5 text-sm border-orange-500/30 text-orange-600">
                    {kw}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recommendations */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-primary" />
            Actionable Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentIPS.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-card border border-border/50">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed">{rec}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => setCurrentView('health-card')}>
          <Share2 className="w-4 h-4 mr-2" /> Generate Health Card
        </Button>
        <Button variant="outline" onClick={() => setCurrentView('applications')}>
          <ClipboardList className="w-4 h-4 mr-2" /> Track This Application
        </Button>
      </div>
    </div>
  );
}


'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import type { ParsedJD } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  FileSearch, Sparkles, X, Target, Briefcase,
  GraduationCap, ListChecks, Wrench, CheckCircle2, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function JDAnalysis() {
  const {
    currentResume, currentJD, setJD, jdRawText,
    isAnalyzing, setIsAnalyzing, setCurrentView, setIPS,
    resumeRawText
  } = useAppStore();
  const [pastedText, setPastedText] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  const analyzeJobDescription = async (rawText: string) => {
    setIsAnalyzing(true);
    setError('');
    try {
      const res = await fetch('/api/jd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Analysis failed');

      const parsed: ParsedJD = {
        title: data.data.title || 'Untitled Role',
        company: data.data.company,
        skills: data.data.skills || [],
        technologies: data.data.technologies || [],
        experience: data.data.experience || '',
        education: data.data.education || '',
        roleType: data.data.roleType || '',
        seniority: data.data.seniority || '',
        requirements: data.data.requirements || [],
        responsibilities: data.data.responsibilities || [],
      };
      setJD(parsed, rawText);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    try {
      const text = await file.text();
      await analyzeJobDescription(text);
    } catch {
      setError('Could not read file. Please paste the JD instead.');
    }
  };

  const calculateIPS = async () => {
    if (!currentResume || !currentJD) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData: currentResume,
          jdData: currentJD,
          resumeRawText,
          jdRawText,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'IPS calculation failed');
      setIPS(data.data);
      setCurrentView('ips');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'IPS calculation failed';
      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {currentJD ? 'Calculating IPS...' : 'Analyzing Job Description'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {currentJD ? 'Comparing your resume against the job requirements...' : 'Extracting requirements and skills...'}
          </p>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="w-20 h-20 rounded-full border-4 border-primary/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-lg font-semibold">
                  {currentJD ? 'Running IPS Engine' : 'Parsing job description...'}
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {currentJD
                    ? 'Evaluating ATS compatibility, skills match, and project relevance'
                    : 'Extracting skills, requirements, and role metadata'}
                </p>
              </div>
              <Progress value={60} className="w-full max-w-xs h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentJD) {
    const matchedSkills = currentJD.skills.filter(s =>
      currentResume?.skills.some(rs => rs.toLowerCase() === s.toLowerCase())
    );
    const missingSkills = currentJD.skills.filter(s =>
      !currentResume?.skills.some(rs => rs.toLowerCase() === s.toLowerCase())
    );

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{currentJD.title}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {currentJD.company || 'Unknown Company'} — {currentJD.seniority} {currentJD.roleType}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { useAppStore.getState().clearJD(); }}>
              <X className="w-4 h-4 mr-1" /> Clear
            </Button>
            {currentResume && (
              <Button size="sm" className="bg-primary text-primary-foreground" onClick={calculateIPS}>
                <Target className="w-4 h-4 mr-1" /> Calculate IPS
              </Button>
            )}
          </div>
        </div>

        {/* Quick Match Summary */}
        {currentResume && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Quick Match Preview
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {matchedSkills.length} of {currentJD.skills.length} skills match
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-500">
                      {currentJD.skills.length > 0 ? Math.round((matchedSkills.length / currentJD.skills.length) * 100) : 0}%
                    </div>
                    <div className="text-xs text-muted-foreground">Match Rate</div>
                  </div>
                  <div className="w-px bg-border" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-destructive">{missingSkills.length}</div>
                    <div className="text-xs text-muted-foreground">Missing</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Role Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Role Type', value: currentJD.roleType, icon: Briefcase },
            { label: 'Seniority', value: currentJD.seniority, icon: Wrench },
            { label: 'Experience', value: currentJD.experience, icon: ListChecks },
            { label: 'Education', value: currentJD.education, icon: GraduationCap },
          ].filter(m => m.value).map((meta) => (
            <Card key={meta.label}>
              <CardContent className="p-4">
                <meta.icon className="w-4 h-4 text-primary mb-2" />
                <p className="text-xs text-muted-foreground">{meta.label}</p>
                <p className="text-sm font-medium mt-1">{meta.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skills */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Wrench className="w-4 h-4 text-primary" />
              Required Skills ({currentJD.skills.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {currentJD.skills.map((skill) => {
                const isMatched = currentResume?.skills.some(rs => rs.toLowerCase() === skill.toLowerCase());
                return (
                  <Badge
                    key={skill}
                    variant={isMatched ? 'default' : 'outline'}
                    className={cn(
                      'px-3 py-1.5 text-sm',
                      isMatched
                        ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
                        : 'text-destructive border-destructive/30'
                    )}
                  >
                    {isMatched ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <X className="w-3 h-3 mr-1" />}
                    {skill}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Technologies */}
        {currentJD.technologies.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Technologies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {currentJD.technologies.map((tech) => (
                  <Badge key={tech} variant="secondary" className="px-3 py-1.5">{tech}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Requirements */}
        {currentJD.requirements.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-amber-500" />
                Requirements ({currentJD.requirements.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {currentJD.requirements.map((req, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="text-xs text-muted-foreground font-mono mt-0.5 shrink-0">{i + 1}.</span>
                  <p className="text-sm">{req}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Responsibilities */}
        {currentJD.responsibilities.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Responsibilities ({currentJD.responsibilities.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {currentJD.responsibilities.map((resp, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="text-xs text-muted-foreground font-mono mt-0.5 shrink-0">{i + 1}.</span>
                  <p className="text-sm">{resp}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Job Description Analysis</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {currentResume
            ? 'Paste or upload the job description to match against your resume'
            : 'Analyze a job description to see what skills and requirements are needed'}
        </p>
      </div>

      {!currentResume && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">Tip: Upload your resume first</p>
            <p className="text-sm text-muted-foreground mt-1">
              For the best experience, analyze your resume first so we can show skill matching and calculate your IPS.
            </p>
          </div>
        </div>
      )}

      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Paste the Job Description</p>
              <label className="text-sm text-primary cursor-pointer hover:underline">
                Or upload a file
                <input type="file" accept=".txt,.md,.text" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
            <Textarea
              placeholder="Paste the full job description here... Include the job title, company, requirements, responsibilities, and qualifications for the best analysis."
              className="min-h-[300px] resize-y text-sm"
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">{pastedText.length} characters</p>
            <Button
              className="bg-primary text-primary-foreground"
              onClick={() => analyzeJobDescription(pastedText)}
              disabled={pastedText.trim().length < 30}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Analyze JD
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
          <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive">Analysis Failed</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
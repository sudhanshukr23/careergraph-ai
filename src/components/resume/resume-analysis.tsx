'use client';

import { useState, useRef, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import type { ParsedResume } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Upload, FileText, Sparkles, X, CheckCircle2,
  Code2, Briefcase, GraduationCap, Star, AlertTriangle,
  FileSearch, Target, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ResumeAnalysis() {
  const { setResume, setCurrentView, currentResume, resumeRawText, isAnalyzing, setIsAnalyzing, setIPS } = useAppStore();
  const [mode, setMode] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const extractTextFromFile = async (file: File): Promise<string> => {
    const text = await file.text();
    return text;
  };

  const analyzeResume = async (rawText: string) => {
    setIsAnalyzing(true);
    setError('');
    try {
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Analysis failed');

      const parsed: ParsedResume = {
        name: data.data.name,
        email: data.data.email,
        phone: data.data.phone,
        summary: data.data.summary,
        skills: data.data.skills || [],
        projects: data.data.projects || [],
        experience: data.data.experience || [],
        education: data.data.education || [],
      };
      setResume(parsed, rawText);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Analysis failed. Please try again.';
      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setFileName(file.name);
    try {
      const text = await extractTextFromFile(file);
      if (text.trim().length < 50) {
        setError('File content is too short or could not be parsed. Please paste your resume text instead.');
        return;
      }
      await analyzeResume(text);
    } catch {
      setError('Could not read file. Please paste your resume text instead.');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }, []);

  const handleAnalyzeWithJD = () => {
    if (currentResume) {
      setCurrentView('jd');
    }
  };

  if (isAnalyzing) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analyzing Resume</h1>
          <p className="text-muted-foreground text-sm mt-1">Our AI is extracting skills, projects, and experience...</p>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-primary/20 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                </div>
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-lg font-semibold">Parsing your resume...</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Extracting skills, projects, experience, and education using AI
                </p>
              </div>
              <div className="w-full max-w-xs space-y-2">
                <Progress value={66} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Extracting entities</span>
                  <span>Categorizing...</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full max-w-sm mt-4">
                {['Skills & Technologies', 'Projects & Work', 'Education & Certs', 'Contact Info'].map((label, i) => (
                  <div key={label} className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded" />
                    <span className="text-xs text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentResume) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Resume Analysis</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {fileName || 'Pasted resume'} — {currentResume.skills.length} skills extracted
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { useAppStore.getState().clearResume(); setFileName(''); }}>
              <X className="w-4 h-4 mr-1" /> Clear
            </Button>
            <Button size="sm" className="bg-primary text-primary-foreground" onClick={handleAnalyzeWithJD}>
              <FileSearch className="w-4 h-4 mr-1" /> Analyze with JD
            </Button>
          </div>
        </div>

        {/* Contact Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              Profile Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid sm:grid-cols-3 gap-4">
              {currentResume.name && (
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium">{currentResume.name}</p>
                </div>
              )}
              {currentResume.email && (
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{currentResume.email}</p>
                </div>
              )}
              {currentResume.phone && (
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{currentResume.phone}</p>
                </div>
              )}
            </div>
            {currentResume.summary && (
              <p className="text-sm text-muted-foreground leading-relaxed">{currentResume.summary}</p>
            )}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Code2 className="w-4 h-4 text-primary" />
              Extracted Skills ({currentResume.skills.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {currentResume.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="px-3 py-1.5 text-sm font-medium hover:bg-primary/10 transition-colors">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Projects */}
        {currentResume.projects.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                Projects ({currentResume.projects.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentResume.projects.map((project, i) => (
                <div key={i} className="p-4 rounded-xl bg-muted/50 space-y-2">
                  <h4 className="font-semibold text-sm">{project.name}</h4>
                  {project.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Experience */}
        {currentResume.experience.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-amber-500" />
                Experience ({currentResume.experience.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentResume.experience.map((exp, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-px bg-border shrink-0" />
                  <div className="space-y-1 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-sm">{exp.role}</h4>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                      </div>
                      {exp.duration && (
                        <span className="text-xs text-muted-foreground shrink-0">{exp.duration}</span>
                      )}
                    </div>
                    {exp.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Education */}
        {currentResume.education.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                Education ({currentResume.education.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentResume.education.map((edu, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{edu.institution}</h4>
                    <p className="text-sm text-muted-foreground">
                      {edu.degree} {edu.field ? `in ${edu.field}` : ''} {edu.gpa ? `— GPA: ${edu.gpa}` : ''}
                    </p>
                    {edu.duration && <p className="text-xs text-muted-foreground">{edu.duration}</p>}
                  </div>
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
        <h1 className="text-2xl font-bold tracking-tight">Resume Analysis</h1>
        <p className="text-muted-foreground text-sm mt-1">Upload your resume for AI-powered analysis</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <Button
          variant={mode === 'upload' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('upload')}
          className={mode === 'upload' ? 'bg-primary text-primary-foreground' : ''}
        >
          <Upload className="w-4 h-4 mr-1" /> Upload File
        </Button>
        <Button
          variant={mode === 'paste' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode('paste')}
          className={mode === 'paste' ? 'bg-primary text-primary-foreground' : ''}
        >
          <FileText className="w-4 h-4 mr-1" /> Paste Text
        </Button>
      </div>

      {mode === 'upload' ? (
        <Card>
          <CardContent className="p-8">
            <div
              className={cn(
                'border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 cursor-pointer',
                dragOver
                  ? 'border-primary bg-primary/5 scale-[1.01]'
                  : 'border-border hover:border-primary/50 hover:bg-muted/30'
              )}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".txt,.md,.text"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
              <div className="flex flex-col items-center gap-4">
                <div className={cn(
                  'w-16 h-16 rounded-2xl flex items-center justify-center transition-colors',
                  dragOver ? 'bg-primary/20' : 'bg-muted'
                )}>
                  <Upload className={cn('w-8 h-8', dragOver ? 'text-primary' : 'text-muted-foreground')} />
                </div>
                <div>
                  <p className="text-base font-semibold">
                    {dragOver ? 'Drop your resume here' : 'Drag & drop your resume'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    or click to browse — supports TXT, MD files
                  </p>
                </div>
                {fileName && (
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <FileText className="w-4 h-4" />
                    {fileName}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Paste your resume content below</p>
              <Textarea
                placeholder="Paste your full resume text here... Include your skills, projects, experience, and education for the best analysis."
                className="min-h-[300px] resize-y text-sm"
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{pastedText.length} characters</p>
              <Button
                className="bg-primary text-primary-foreground"
                onClick={() => analyzeResume(pastedText)}
                disabled={pastedText.trim().length < 50}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze Resume
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
          <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-destructive">Analysis Failed</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Tips */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Tips for Best Results
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              Include a dedicated Skills section with specific technologies
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              List projects with their tech stack and brief descriptions
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              Quantify achievements with numbers where possible
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              Ensure your most relevant experience is listed first
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import { useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toPng } from 'html-to-image';
import { Download, Share2, Zap, AlertTriangle, ArrowRight } from 'lucide-react';

export function HealthCard() {
  const { currentIPS, currentResume, currentJD, setCurrentView } = useAppStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        backgroundColor: '#ffffff',
        pixelRatio: 2,
        cacheBust: true,
      });
      const a = document.createElement('a');
      a.download = `careergraph-health-card-${Date.now()}.png`;
      a.href = dataUrl;
      a.click();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (!currentIPS) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resume Health Card</h1>
          <p className="text-muted-foreground text-sm mt-1">Generate a shareable card showing your IPS score</p>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <Share2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Calculate Your IPS First</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Upload your resume and a job description, then calculate your IPS to generate a shareable health card.
            </p>
            <Button className="bg-primary text-primary-foreground" onClick={() => setCurrentView('resume')}>
              Get Started
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Resume Health Card</h1>
          <p className="text-muted-foreground text-sm mt-1">Shareable card for WhatsApp, LinkedIn, and Twitter</p>
        </div>
        <Button className="bg-primary text-primary-foreground" onClick={handleDownload} disabled={downloading}>
          <Download className="w-4 h-4 mr-2" />
          {downloading ? 'Generating...' : 'Download Image'}
        </Button>
      </div>

      {/* The Card to Capture */}
      <div className="flex justify-center">
        <div
          ref={cardRef}
          className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: getScoreColor(currentIPS.overall) }}>
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">CareerGraph AI</div>
                <div className="text-xs text-gray-500">Interview Probability Score</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black" style={{ color: getScoreColor(currentIPS.overall) }}>
                {currentIPS.overall}
              </div>
              <div className="text-xs text-gray-500">{getPercentile(currentIPS.overall)}</div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'ATS', score: currentIPS.ats },
              { label: 'Skills', score: currentIPS.skills },
              { label: 'Projects', score: currentIPS.projects },
            ].map((item) => (
              <div key={item.label} className="text-center p-3 rounded-xl bg-gray-50">
                <div className="text-lg font-bold" style={{ color: getScoreColor(item.score) }}>{item.score}</div>
                <div className="text-xs text-gray-500">{item.label}</div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{ width: `${item.score}%`, backgroundColor: getScoreColor(item.score) }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Missing Skills */}
          {currentIPS.missingSkills.length > 0 && (
            <div className="mb-6">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Missing Skills</div>
              <div className="flex flex-wrap gap-1.5">
                {currentIPS.missingSkills.slice(0, 4).map((skill) => (
                  <span key={skill} className="px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium">
                    {skill}
                  </span>
                ))}
                {currentIPS.missingSkills.length > 4 && (
                  <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">
                    +{currentIPS.missingSkills.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Job Info */}
          {(currentJD?.title || currentJD?.company) && (
            <div className="p-3 rounded-xl bg-gray-50 mb-4">
              <div className="text-xs text-gray-500">Matching Against</div>
              <div className="text-sm font-semibold text-gray-900">{currentJD?.title}</div>
              {currentJD?.company && <div className="text-xs text-gray-500">{currentJD.company}</div>}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-400">Optimize outcomes, not resumes.</div>
            <div className="text-xs font-medium" style={{ color: getScoreColor(currentIPS.overall) }}>
              {getPercentile(currentIPS.overall)} of Junior SDEs
            </div>
          </div>
        </div>
      </div>

      {/* Sharing Tips */}
      <Card className="bg-muted/30">
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold mb-3">Sharing Tips</h3>
          <div className="grid sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="text-green-600 shrink-0">WhatsApp</Badge>
              <span>Best for sharing with friends and study groups</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="text-blue-600 shrink-0">LinkedIn</Badge>
              <span>Share as a post to showcase your preparation</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="text-sky-600 shrink-0">Twitter</Badge>
              <span>Join the conversation about career optimization</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
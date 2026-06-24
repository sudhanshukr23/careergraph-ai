'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import {
  Zap, Target, TrendingUp, Shield, ArrowRight,
  BarChart3, FileSearch, Brain, Users
} from 'lucide-react';

export function LandingPage() {
  const { setCurrentView, login } = useAppStore();

  const handleGetStarted = () => {
    login('Demo User', 'demo@caregraph.ai');
    setCurrentView('dashboard');
  };

  const features = [
    {
      icon: FileSearch,
      title: 'AI Resume Analysis',
      description: 'Upload your resume and get instant AI-powered analysis. Extract skills, projects, and experience automatically. No manual entry needed.',
    },
    {
      icon: Target,
      title: 'Interview Probability Score',
      description: 'Get a 0-100 IPS that predicts your interview chances. Understand exactly why you score what you do, with specific, actionable feedback.',
    },
    {
      icon: Brain,
      title: 'Job Description Intelligence',
      description: 'Paste any JD and instantly see the skill map, requirements breakdown, and how your profile stacks up against every requirement.',
    },
    {
      icon: BarChart3,
      title: 'Application Analytics',
      description: 'Track every application with status updates. See your conversion funnel, identify patterns, and optimize where it matters most.',
    },
    {
      icon: TrendingUp,
      title: 'Career Outcome Graph',
      description: 'Over time, we build a unique graph connecting your resume versions to real hiring outcomes. Data no one else has.',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is encrypted and never shared. DPDP and GDPR compliant. You own your career data, always.',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Resumes Analyzed' },
    { value: '84%', label: 'Avg IPS Improvement' },
    { value: '3.2x', label: 'More Interviews' },
    { value: '< 30s', label: 'Analysis Time' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">CareerGraph AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <button className="hover:text-foreground transition-colors">Features</button>
            <button className="hover:text-foreground transition-colors">Pricing</button>
            <button className="hover:text-foreground transition-colors">About</button>
          </div>
          <Button onClick={handleGetStarted} className="bg-primary text-primary-foreground hover:opacity-90">
            Get Started Free
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-36">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Users className="w-4 h-4" />
              Built for STEM students & Junior Engineers in India
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Stop Guessing.{' '}
              <span className="gradient-text">Start Optimizing</span>{' '}
              Your Career.
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              CareerGraph AI analyzes your resume against real job descriptions and calculates your
              <strong className="text-foreground"> Interview Probability Score</strong> — so you know
              exactly what to fix before you apply.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-primary text-primary-foreground hover:opacity-90 text-base px-8 h-12 rounded-xl shadow-lg shadow-primary/20"
              >
                Analyze My Resume
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-base px-8 h-12 rounded-xl">
                See How It Works
              </Button>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary animate-count-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Not a Resume Builder. A <span className="gradient-text">Career Intelligence Platform</span>.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We don&apos;t optimize resumes. We optimize outcomes. Every feature is designed to increase your interview callbacks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Three Steps to <span className="gradient-text">More Interviews</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Upload Your Resume', desc: 'Drop your PDF or DOCX. Our AI extracts every skill, project, and experience point in seconds.' },
              { step: '02', title: 'Add a Job Description', desc: 'Paste the JD for the role you want. We extract requirements, tech stack, and seniority level.' },
              { step: '03', title: 'Get Your IPS & Fix It', desc: 'See your Interview Probability Score with specific, actionable fixes. No generic advice — ever.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-5xl font-black text-primary/10 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Ready to Stop Guessing?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of students and engineers who are optimizing their careers with real hiring intelligence.
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-primary text-primary-foreground hover:opacity-90 text-base px-8 h-12 rounded-xl shadow-lg shadow-primary/20"
          >
            Start Free — No Credit Card
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium">CareerGraph AI</span>
          </div>
          <p className="text-sm text-muted-foreground">Optimize outcomes, not resumes.</p>
        </div>
      </footer>
    </div>
  );
}
'use client';

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User, Shield, Bell, Palette, CreditCard, HelpCircle,
  LogOut, Zap, Check, Crown
} from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '0',
    description: 'Get started with basic career intelligence',
    features: ['3 Resume Analyses/month', '5 JD Analyses/month', 'Basic IPS Scores', 'Application Tracker (10 max)', 'Resume Health Card'],
    cta: 'Current Plan',
    active: true,
  },
  {
    name: 'Pro',
    price: '499',
    period: '/month',
    description: 'For serious job seekers who want an edge',
    features: ['Unlimited Resume Analyses', 'Unlimited JD Analyses', 'Advanced IPS with Explanations', 'Unlimited Applications', 'Career Insights Dashboard', 'Resume Health Card Pro', 'Priority AI Analysis'],
    cta: 'Upgrade to Pro',
    active: false,
    popular: true,
  },
  {
    name: 'Premium',
    price: '999',
    period: '/month',
    description: 'Career optimization at its finest',
    features: ['Everything in Pro', 'Outcome Tracking', 'Email/WhatsApp Follow-ups', 'Career Outcome Graph Access', 'Custom Recommendations', 'Resume Version Comparison', 'Mock Interview Prep'],
    cta: 'Coming Soon',
    active: false,
  },
];

export function SettingsView() {
  const { userName, userEmail, logout } = useAppStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
              {userName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="font-semibold">{userName || 'Demo User'}</h3>
              <p className="text-sm text-muted-foreground">{userEmail || 'demo@caregraph.ai'}</p>
              <Badge variant="secondary" className="mt-1">Free Plan</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plans */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-500" />
            Pricing Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-5 transition-all ${
                  plan.active
                    ? 'border-primary bg-primary/5'
                    : plan.popular
                    ? 'border-amber-500/30 shadow-md'
                    : 'border-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-amber-500 text-white">Most Popular</Badge>
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="font-bold">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-black">{plan.price === '0' ? 'Free' : `₹${plan.price}`}</span>
                  {plan.period && <span className="text-sm text-muted-foreground">{plan.period}</span>}
                </div>
                <ul className="space-y-2 mb-5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.active ? 'default' : 'outline'}
                  size="sm"
                  className={`w-full ${plan.active ? 'bg-primary text-primary-foreground' : ''}`}
                  disabled={plan.name === 'Premium'}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Data Privacy</p>
                <p className="text-xs text-muted-foreground">Your data is encrypted and never shared</p>
              </div>
            </div>
            <Badge variant="outline" className="text-emerald-600 border-emerald-500/30">DPDP Compliant</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Notifications</p>
                <p className="text-xs text-muted-foreground">Email and WhatsApp follow-up reminders</p>
              </div>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Help & Support</p>
                <p className="text-xs text-muted-foreground">FAQs, documentation, and contact support</p>
              </div>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Card>
        <CardContent className="p-4">
          <Button variant="outline" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out of CareerGraph AI
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
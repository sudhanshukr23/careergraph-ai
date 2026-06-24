'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import type { Application, ApplicationStatus } from '@/lib/types';
import { STATUS_CONFIG } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Plus, Filter, Trash2, Edit2, MoreHorizontal,
  Calendar, Building2, Search, ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';

const statusOptions: ApplicationStatus[] = ['applied', 'oa_received', 'interview', 'rejected', 'offer'];

export function ApplicationTracker() {
  const { applications, setApplications, addApplication, updateApplication, removeApplication } = useAppStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  // Form state
  const [formCompany, setFormCompany] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formStatus, setFormStatus] = useState<ApplicationStatus>('applied');
  const [formNotes, setFormNotes] = useState('');

  // Load applications from API
  useEffect(() => {
    fetch('/api/applications')
      .then(r => r.json())
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          setApplications(res.data.map((a: { id: string; company: string; role: string; status: string; appliedDate: string; notes?: string }) => ({
            id: a.id,
            company: a.company,
            role: a.role,
            status: a.status as ApplicationStatus,
            appliedDate: a.appliedDate,
            notes: a.notes,
          })));
        }
      });
  }, [setApplications]);

  const openAddDialog = () => {
    setEditingId(null);
    setFormCompany('');
    setFormRole('');
    setFormStatus('applied');
    setFormNotes('');
    setDialogOpen(true);
  };

  const openEditDialog = (app: Application) => {
    setEditingId(app.id);
    setFormCompany(app.company);
    setFormRole(app.role);
    setFormStatus(app.status);
    setFormNotes(app.notes || '');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formCompany.trim() || !formRole.trim()) return;

    if (editingId) {
      const res = await fetch('/api/applications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, company: formCompany, role: formRole, status: formStatus, notes: formNotes }),
      });
      const data = await res.json();
      if (data.success) {
        updateApplication(editingId, { company: formCompany, role: formRole, status: formStatus, notes: formNotes });
      }
    } else {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: formCompany, role: formRole, status: formStatus, notes: formNotes }),
      });
      const data = await res.json();
      if (data.success) {
        addApplication({
          id: data.data.id,
          company: formCompany,
          role: formRole,
          status: formStatus,
          appliedDate: new Date().toISOString(),
          notes: formNotes,
        });
      }
    }
    setDialogOpen(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/applications?id=${id}`, { method: 'DELETE' });
    removeApplication(id);
  };

  const handleStatusChange = async (id: string, newStatus: ApplicationStatus) => {
    const res = await fetch('/api/applications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    const data = await res.json();
    if (data.success) {
      updateApplication(id, { status: newStatus });
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = !search ||
      app.company.toLowerCase().includes(search.toLowerCase()) ||
      app.role.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const statusCounts = statusOptions.reduce((acc, s) => {
    acc[s] = applications.filter(a => a.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Application Tracker</h1>
          <p className="text-muted-foreground text-sm mt-1">{applications.length} applications tracked</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground" onClick={openAddDialog}>
              <Plus className="w-4 h-4 mr-2" /> Add Application
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Application' : 'Add Application'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Company *</Label>
                <Input placeholder="e.g., Google, Amazon, Startup" value={formCompany} onChange={e => setFormCompany(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Role *</Label>
                <Input placeholder="e.g., SDE-1, Frontend Developer" value={formRole} onChange={e => setFormRole(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formStatus} onValueChange={(v) => setFormStatus(v as ApplicationStatus)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(s => (
                      <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea placeholder="Any additional notes..." value={formNotes} onChange={e => setFormNotes(e.target.value)} className="min-h-[80px]" />
              </div>
              <Button className="w-full bg-primary text-primary-foreground" onClick={handleSave} disabled={!formCompany.trim() || !formRole.trim()}>
                {editingId ? 'Update' : 'Add'} Application
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-5 gap-2">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            'p-3 rounded-xl text-center transition-all border',
            filter === 'all' ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted/50'
          )}
        >
          <div className="text-lg font-bold">{applications.length}</div>
          <div className="text-xs text-muted-foreground">All</div>
        </button>
        {statusOptions.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              'p-3 rounded-xl text-center transition-all border',
              filter === s ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted/50'
            )}
          >
            <div className="text-lg font-bold">{statusCounts[s]}</div>
            <div className="text-xs text-muted-foreground">{STATUS_CONFIG[s].label}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search companies or roles..."
          className="pl-10"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Application List */}
      {filteredApps.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ClipboardList className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {applications.length === 0 ? 'No Applications Yet' : 'No Matches Found'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {applications.length === 0
                ? 'Start tracking your job applications to see patterns and improve your success rate.'
                : 'Try adjusting your filters or search term.'}
            </p>
            {applications.length === 0 && (
              <Button className="bg-primary text-primary-foreground" onClick={openAddDialog}>
                <Plus className="w-4 h-4 mr-2" /> Add Your First Application
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredApps.map(app => (
            <Card key={app.id} className="group hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm truncate">{app.role}</h3>
                      <Badge variant="secondary" className={cn('text-xs shrink-0', STATUS_CONFIG[app.status].bg, STATUS_CONFIG[app.status].color)}>
                        {STATUS_CONFIG[app.status].label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {app.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(app.appliedDate)}
                      </span>
                    </div>
                    {app.notes && (
                      <p className="text-xs text-muted-foreground mt-2 truncate">{app.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Select value={app.status} onValueChange={(v) => handleStatusChange(app.id, v as ApplicationStatus)}>
                      <SelectTrigger className="w-28 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(s => (
                          <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(app)}>
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(app.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
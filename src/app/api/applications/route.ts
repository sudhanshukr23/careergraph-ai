import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const applications = await db.application.findMany({
      orderBy: { appliedDate: 'desc' },
    });
    return NextResponse.json({ success: true, data: applications });
  } catch {
    return NextResponse.json({ success: true, data: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { company, role, status, notes } = await req.json();
    const application = await db.application.create({
      data: { userId: 'demo-user', company, role, status: status || 'applied', notes },
    });
    return NextResponse.json({ success: true, data: application });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create application';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id, ...updates } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }
    const application = await db.application.update({
      where: { id },
      data: updates,
    });
    return NextResponse.json({ success: true, data: application });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update application';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Application ID is required' }, { status: 400 });
    }
    await db.application.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete application';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
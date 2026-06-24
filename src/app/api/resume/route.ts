import { NextRequest, NextResponse } from 'next/server';
import { analyzeResume } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { rawText } = await req.json();
    if (!rawText || rawText.trim().length < 50) {
      return NextResponse.json({ error: 'Resume text is too short to analyze' }, { status: 400 });
    }
    const result = await analyzeResume(rawText);
    const parsed = JSON.parse(result);
    return NextResponse.json({ success: true, data: parsed });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to analyze resume';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
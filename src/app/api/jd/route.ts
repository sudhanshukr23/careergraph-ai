import { NextRequest, NextResponse } from 'next/server';
import { analyzeJD } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { rawText } = await req.json();
    if (!rawText || rawText.trim().length < 30) {
      return NextResponse.json({ error: 'Job description text is too short to analyze' }, { status: 400 });
    }
    const result = await analyzeJD(rawText);
    const parsed = JSON.parse(result);
    return NextResponse.json({ success: true, data: parsed });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to analyze job description';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
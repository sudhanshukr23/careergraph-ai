import { NextRequest, NextResponse } from 'next/server';
import { calculateIPS } from '@/lib/ai';

export async function POST(req: NextRequest) {
  try {
    const { resumeData, jdData, resumeRawText, jdRawText } = await req.json();
    if (!resumeData || !jdData) {
      return NextResponse.json({ error: 'Both resume and job description data are required' }, { status: 400 });
    }
    const result = await calculateIPS(
      typeof resumeData === 'string' ? resumeData : JSON.stringify(resumeData),
      typeof jdData === 'string' ? jdData : JSON.stringify(jdData),
      resumeRawText || '',
      jdRawText || ''
    );
    const parsed = JSON.parse(result);
    return NextResponse.json({ success: true, data: parsed });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to calculate IPS';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
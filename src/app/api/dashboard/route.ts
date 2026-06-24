import { NextResponse } from 'next/server';

export async function GET() {
  const stats = {
    totalApplications: 12,
    interviewsReceived: 4,
    offersReceived: 1,
    avgIPS: 72,
    ipsTrend: [
      { date: 'Jun 18', score: 58 },
      { date: 'Jun 19', score: 62 },
      { date: 'Jun 20', score: 65 },
      { date: 'Jun 21', score: 68 },
      { date: 'Jun 22', score: 72 },
      { date: 'Jun 23', score: 75 },
      { date: 'Jun 24', score: 78 },
    ],
    topSkills: [
      { name: 'React', count: 8 },
      { name: 'TypeScript', count: 7 },
      { name: 'Node.js', count: 6 },
      { name: 'Python', count: 5 },
      { name: 'SQL', count: 5 },
      { name: 'Git', count: 4 },
      { name: 'Docker', count: 3 },
      { name: 'AWS', count: 2 },
    ],
    skillGaps: [
      { name: 'Docker', frequency: 6 },
      { name: 'CI/CD', frequency: 5 },
      { name: 'System Design', frequency: 4 },
      { name: 'Kubernetes', frequency: 3 },
      { name: 'GraphQL', frequency: 3 },
    ],
  };
  return NextResponse.json({ success: true, data: stats });
}
import { ZAI } from 'z-ai-web-dev-sdk';

const zai = new ZAI();

export async function analyzeResume(rawText: string): Promise<string> {
  const prompt = `You are an expert resume parser for software engineering roles. Analyze the following resume text and extract structured data in JSON format.

Return ONLY valid JSON with this exact structure (no markdown, no code blocks):
{
  "name": "string or null",
  "email": "string or null",
  "phone": "string or null",
  "summary": "string or null",
  "skills": ["skill1", "skill2", ...],
  "projects": [
    {"name": "string", "description": "string", "technologies": ["tech1", "tech2"]}
  ],
  "experience": [
    {"company": "string", "role": "string", "description": "string", "duration": "string"}
  ],
  "education": [
    {"institution": "string", "degree": "string", "field": "string", "gpa": "string or null", "duration": "string"}
  ]
}

Be thorough - extract ALL skills mentioned including tools, frameworks, languages, platforms. For projects, extract what the project does and what tech stack was used.

Resume text:
${rawText}`;

  const result = await zai.chat({
    messages: [{ role: 'user', content: prompt }],
    model: 'deepseek-chat',
    temperature: 0.1,
  });

  let content = result.choices?.[0]?.message?.content || '';
  content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return content;
}

export async function analyzeJD(rawText: string): Promise<string> {
  const prompt = `You are an expert job description parser for software engineering roles. Analyze the following job description and extract structured data in JSON format.

Return ONLY valid JSON with this exact structure (no markdown, no code blocks):
{
  "title": "string",
  "company": "string or null",
  "skills": ["skill1", "skill2", ...],
  "technologies": ["tech1", "tech2", ...],
  "experience": "string describing experience requirements",
  "education": "string describing education requirements",
  "roleType": "string (Full-time/Part-time/Internship/Contract)",
  "seniority": "string (Entry/Junior/Mid/Senior/Staff/Lead)",
  "requirements": ["req1", "req2", ...],
  "responsibilities": ["resp1", "resp2", ...]
}

Be thorough - extract ALL skills, tools, frameworks, and technologies mentioned. Categorize between hard requirements and nice-to-haves.

Job Description text:
${rawText}`;

  const result = await zai.chat({
    messages: [{ role: 'user', content: prompt }],
    model: 'deepseek-chat',
    temperature: 0.1,
  });

  let content = result.choices?.[0]?.message?.content || '';
  content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return content;
}

export async function calculateIPS(
  resumeData: string,
  jdData: string,
  resumeRawText: string,
  jdRawText: string
): Promise<string> {
  const prompt = `You are the Interview Probability Score (IPS) engine for CareerGraph AI. Given a parsed resume and parsed job description, calculate the interview probability and provide detailed analysis.

Resume Data:
${resumeData}

Job Description Data:
${jdData}

Calculate the following scores (0-100 each) based on:
1. ATS Score: How well the resume would pass Applicant Tracking Systems. Check keyword matching, formatting indicators, section completeness, quantifiable achievements.
2. Skills Score: Direct match of skills between resume and JD. Weight required skills higher. Consider skill depth (just mentioned vs. demonstrated through projects).
3. Project Relevance Score: How well the candidate's projects demonstrate ability for the target role. Consider complexity, tech stack overlap, domain relevance.

Return ONLY valid JSON (no markdown, no code blocks):
{
  "overall": number (weighted average: 40% ATS, 35% Skills, 25% Projects),
  "ats": number,
  "skills": number,
  "projects": number,
  "strengths": ["specific strength 1 with evidence", "specific strength 2 with evidence", "specific strength 3 with evidence"],
  "weaknesses": ["specific weakness 1 with explanation", "specific weakness 2 with explanation"],
  "missingSkills": ["skill1", "skill2", "skill3"],
  "missingKeywords": ["keyword1", "keyword2"],
  "recommendations": ["specific actionable recommendation 1", "specific actionable recommendation 2", "specific actionable recommendation 3", "specific actionable recommendation 4"]
}

Be extremely specific. Every strength/weakness must reference actual content from the resume or JD. Never give generic advice. If the resume mentions React but JD needs React Native, say that specifically. If projects lack CI/CD, name the exact practice to add.`;

  const result = await zai.chat({
    messages: [{ role: 'user', content: prompt }],
    model: 'deepseek-chat',
    temperature: 0.15,
  });

  let content = result.choices?.[0]?.message?.content || '';
  content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return content;
}
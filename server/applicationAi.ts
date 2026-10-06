import { askGemini, askGeminiJson } from './gemini.js';
import type { ResumeProfile } from './resumeParser.js';

export async function generateCoverLetter(
  profile: ResumeProfile,
  jobDescription: string,
  company = '',
  jobTitle = ''
): Promise<string> {
  const prompt = `You are a high-performing tech career strategist writing a tailored, persuasive cover letter.
Candidate Profile:
Name: ${profile.name}
Email: ${profile.email}
Phone: ${profile.phone}
Headline: ${profile.headline || 'Software Engineer'}
Key Skills: ${[...profile.skills.languages, ...profile.skills.frameworks, ...profile.skills.tools].join(', ')}

Target Company: ${company || 'Hiring Team'}
Target Role: ${jobTitle || 'Software Engineer'}

Job Description:
"""
${jobDescription.slice(0, 3000)}
"""

Instructions:
1. Write an engaging, authentic, professional cover letter (approx 3-4 paragraphs, 250-400 words).
2. Connect the candidate's real experience and projects to the company's tech stack and goals.
3. Hook the hiring manager with specific value and quantifiable accomplishments.
4. Do NOT use overly cliché openers like "I am thrilled to write to you today".
5. Return the full cover letter formatted neatly.`;

  return await askGemini(prompt);
}

export interface QuestionAnalysisResult {
  intent: string;
  key_competencies_evaluated: string[];
  suggested_framework: string; // e.g. STAR (Situation, Task, Action, Result)
  guidelines: string[];
}

export async function analyzeApplicationQuestion(
  question: string,
  jobDescription = ''
): Promise<QuestionAnalysisResult> {
  const prompt = `Analyze this job application question:
Question: "${question}"
Target Job Context: "${jobDescription.slice(0, 1500)}"

Return strict JSON:
{
  "intent": "<What the recruiter really wants to know>",
  "key_competencies_evaluated": ["<competency 1>", "<competency 2>", "<competency 3>"],
  "suggested_framework": "<e.g. STAR method / Direct Assertion + Evidence>",
  "guidelines": ["<tip 1>", "<tip 2>", "<tip 3>"]
}`;

  return await askGeminiJson<QuestionAnalysisResult>(prompt);
}

export interface AnswerResult {
  question: string;
  answer: string;
  word_count: number;
  highlighted_skills: string[];
  talking_points: string[];
}

export async function generateApplicationAnswer(
  profile: ResumeProfile,
  question: string,
  jobDescription = ''
): Promise<AnswerResult> {
  const prompt = `You are crafting an answer for a job application screening or behavioral question on behalf of candidate ${profile.name}.
Candidate Background:
Summary: ${profile.summary}
Skills: ${[...profile.skills.languages, ...profile.skills.frameworks, ...profile.skills.tools].join(', ')}
Raw Text: ${(profile.raw_text || '').slice(0, 2000)}

Job Context: "${jobDescription.slice(0, 1500)}"
Application Question: "${question}"

Provide a structured, authentic answer (150-250 words) highlighting relevant projects and impact.
Return strict JSON:
{
  "question": "${question.replace(/"/g, '\\"')}",
  "answer": "<complete polished answer>",
  "word_count": <number>,
  "highlighted_skills": ["<skill 1>", "<skill 2>"],
  "talking_points": ["<point 1>", "<point 2>"]
}`;

  return await askGeminiJson<AnswerResult>(prompt);
}

export async function generateApplicationAnswers(
  profile: ResumeProfile,
  questions: string[],
  jobDescription = ''
): Promise<AnswerResult[]> {
  const results: AnswerResult[] = [];
  for (const q of questions) {
    if (q.trim()) {
      const ans = await generateApplicationAnswer(profile, q, jobDescription);
      results.push(ans);
    }
  }
  return results;
}

import { groq } from '@ai-sdk/groq';
import { streamText, convertToModelMessages } from 'ai';
import fs from 'fs';
import path from 'path';

export const maxDuration = 30;

interface WebsiteRoute {
  url: string;
  name: string;
  type: string;
  desc: string;
  keywords: string[];
}

function loadAllWebsiteRoutes(): { routes: WebsiteRoute[]; profileContext: string; experienceContext: string; worksContext: string; funContext: string } {
  const routes: WebsiteRoute[] = [
    {
      url: '/',
      name: 'Studio Workspace',
      type: 'Home',
      desc: 'Interactive Bento grid studio workspace with direct navigation to all portfolio sections',
      keywords: ['home', 'workspace', 'start', 'bento grid', 'main page', 'index']
    },
    {
      url: '/about',
      name: 'About Syed Muhammad Saleh',
      type: 'Biography',
      desc: 'Full engineering background, leadership philosophy, career history, and verified credentials',
      keywords: ['about', 'bio', 'who is saleh', 'background', 'profile', 'story', 'engineer']
    },
    {
      url: '/about#experience',
      name: 'Work Experience & Career Timeline',
      type: 'Career',
      desc: 'Chronological timeline of engineering leadership and technical roles at Nexus Lab & Ventures, Curiositora, and others',
      keywords: ['experience', 'work experience', 'career', 'jobs', 'roles', 'cto', 'lead architect', 'companies', 'resume', 'where did he work']
    },
    {
      url: '/about#certifications',
      name: 'Verified Certifications & Credentials',
      type: 'Credentials',
      desc: 'Official verified certifications from AWS (Solutions Architect), Meta (Full-Stack Developer), and DeepLearning.AI',
      keywords: ['certifications', 'aws', 'meta', 'deeplearning.ai', 'credentials', 'certified', 'licenses', 'degrees', 'verification']
    },
    {
      url: '/about#bio',
      name: 'Bio & Engineering Philosophy',
      type: 'Philosophy',
      desc: "Saleh's focus on software craftsmanship, distributed boundaries, sub-second latency, and intuitive UI",
      keywords: ['philosophy', 'craftsmanship', 'principles', 'approach', 'mindset', 'engineering story']
    },
    {
      url: '/works',
      name: 'Selected Works & Architecture',
      type: 'Portfolio',
      desc: 'Complete index of all shipped engineering projects, production applications, and systems case studies',
      keywords: ['works', 'projects', 'portfolio', 'all projects', 'what has he built', 'case studies', 'apps']
    },
    {
      url: '/fun',
      name: 'Photo Journal & Hobbies',
      type: 'Photo Journal',
      desc: 'Editorial photo album of analog 35mm photography, custom soldered keyboards, and hackathons',
      keywords: ['fun', 'hobbies', 'photo album', 'extracurricular', 'life beyond terminal', 'creative pursuits']
    },
    {
      url: '/ai',
      name: "Ask Saleh's AI",
      type: 'Assistant',
      desc: "Full-screen conversational assistant for direct inquiries about Saleh's engineering architecture",
      keywords: ['ai', 'chat', 'ask ai', 'assistant', 'ask questions', 'ai buddy']
    }
  ];

  // 1. Profile context
  let profileContext = '';
  try {
    const profilePath = path.join(process.cwd(), 'content', 'profile', 'main.json');
    if (fs.existsSync(profilePath)) {
      const profileData = JSON.parse(fs.readFileSync(profilePath, 'utf-8'));
      profileContext = `Name: ${profileData.name}\nTitle: ${profileData.title}\nStory & Bio:\n${(profileData.aboutParagraphs || []).join('\n\n')}\nVerified Certifications:\n${JSON.stringify(profileData.certifications || [], null, 2)}`;
    }
  } catch (e) {
    console.error('Error reading profile:', e);
  }

  // 2. Experience context & role anchors
  let experienceContext = '';
  try {
    const expDir = path.join(process.cwd(), 'content', 'experience');
    if (fs.existsSync(expDir)) {
      for (const file of fs.readdirSync(expDir)) {
        if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
        const slug = file.replace(/\.(md|mdx)$/, '');
        const content = fs.readFileSync(path.join(expDir, file), 'utf-8');
        const role = content.match(/role:\s*(.*)/)?.[1]?.trim() || 'Role';
        const company = content.match(/company:\s*(.*)/)?.[1]?.trim() || 'Company';
        const duration = content.match(/duration:\s*(.*)/)?.[1]?.trim() || '';
        const location = content.match(/location:\s*(.*)/)?.[1]?.trim() || '';

        experienceContext += `\n- Role: ${role} at ${company} (${duration}${location ? ', ' + location : ''})\n${content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '')}\n`;

        routes.push({
          url: `/about#role-${slug}`,
          name: `${company} (${role})`,
          type: 'Career Role',
          desc: `${role} at ${company} (${duration})`,
          keywords: [slug, company.toLowerCase(), role.toLowerCase(), 'work history', 'career']
        });
      }
    }
  } catch (e) {
    console.error('Error reading experience:', e);
  }

  // 3. Works context & case study routes
  let worksContext = '';
  try {
    const worksDir = path.join(process.cwd(), 'content', 'works');
    if (fs.existsSync(worksDir)) {
      for (const file of fs.readdirSync(worksDir)) {
        if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
        const slug = file.replace(/\.(md|mdx)$/, '');
        const content = fs.readFileSync(path.join(worksDir, file), 'utf-8');
        const title = content.match(/title:\s*(.*)/)?.[1]?.trim() || slug;
        const summary = content.match(/summary:\s*(.*)/)?.[1]?.trim() || '';
        const role = content.match(/role:\s*(.*)/)?.[1]?.trim() || '';
        const year = content.match(/year:\s*(.*)/)?.[1]?.trim() || '';

        // Extract clean tech stack tags from YAML block
        const techMatch = content.match(/techStack:[\s\S]*?(?=\n\w+:|$)/);
        const stack: string[] = [];
        if (techMatch) {
          const lines = techMatch[0].match(/- (.*)/g);
          if (lines) {
            for (const l of lines) {
              const cleaned = l.replace('- ', '').trim();
              if (cleaned) stack.push(cleaned);
            }
          }
        }

        worksContext += `\n--- Project: ${title} (${year}${role ? ', ' + role : ''}) ---\nURL: /works/${slug}\nSummary: ${summary}\nTech Stack: ${stack.join(', ')}\n`;

        routes.push({
          url: `/works/${slug}`,
          name: `${title} Case Study`,
          type: 'Case Study',
          desc: summary || `${title} architectural deep dive and case study`,
          keywords: [slug, title.toLowerCase(), ...stack.map(s => s.toLowerCase()), 'case study', 'architecture']
        });
      }
    }
  } catch (e) {
    console.error('Error reading works:', e);
  }

  // 4. Fun context & hobby deep-links
  let funContext = '';
  try {
    const funDir = path.join(process.cwd(), 'content', 'fun');
    if (fs.existsSync(funDir)) {
      for (const file of fs.readdirSync(funDir)) {
        if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
        const slug = file.replace(/\.(md|mdx)$/, '');
        const content = fs.readFileSync(path.join(funDir, file), 'utf-8');
        const title = content.match(/title:\s*(.*)/)?.[1]?.trim() || slug;
        const category = content.match(/category:\s*(.*)/)?.[1]?.trim() || 'Hobby';
        const tagline = content.match(/tagline:\s*(.*)/)?.[1]?.trim() || '';
        const location = content.match(/location:\s*(.*)/)?.[1]?.trim() || '';

        funContext += `\n--- Hobby: ${title} (${category}${location ? ', ' + location : ''}) ---\nURL: /fun#${slug}\nTagline: ${tagline}\n`;

        routes.push({
          url: `/fun#${slug}`,
          name: title,
          type: category,
          desc: tagline || `${title} in Saleh's editorial photo album`,
          keywords: [slug, title.toLowerCase(), category.toLowerCase(), 'photos', 'album', 'photography', 'keyboards', 'hackathons']
        });
      }
    }
  } catch (e) {
    console.error('Error reading fun:', e);
  }

  return { routes, profileContext, experienceContext, worksContext, funContext };
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  const { routes, profileContext, experienceContext, worksContext, funContext } = loadAllWebsiteRoutes();

  // Construct System Prompt
  let systemPrompt = `You are Syed Muhammad Saleh's portfolio assistant representing Saleh directly to founders, recruiters, engineering leaders, and visitors.

================================================================================
CRITICAL OPERATIONAL RULES:
================================================================================
1. STRICT ACCURACY & GROUNDEDNESS: ONLY answer based on the verified facts provided below about Saleh. If a question is not covered in your knowledge context, concisely state: "I don't have that information regarding Saleh's background." NEVER invent, assume, extrapolate, or hallucinate facts or links on your own.
2. SHORT & WELL-FORMATTED: Keep your responses CONCISE, CRISP, and PUNCHY. Never output giant essays or long walls of text. Limit answers to 2-4 concise bullet points or 1-2 brief paragraphs maximum.
3. FORMATTING: Use clean, readable Markdown (bold key terms, clean bullet points).
4. MANDATORY RESOURCE LINKING: For EVERY user question about Saleh, his projects, career, certifications, hobbies, or the site, you MUST append EXACTLY ONE reference card token at the very end of your response using the verified Website Routes Directory below.
Token syntax:
:::ref{title="Exact Title" href="Exact URL" type="Exact Type" desc="Exact Description"}:::

================================================================================
COMPLETE DIRECTORY OF VERIFIED WEBSITE ROUTES:
================================================================================
${routes.map(r => `• Route: "${r.url}"
  Title: "${r.name}"
  Type: "${r.type}"
  Description: "${r.desc}"
  Target Topics: ${r.keywords.join(', ')}
  Exact Reference Token:
  :::ref{title="${r.name}" href="${r.url}" type="${r.type}" desc="${r.desc}"}:::`).join('\n\n')}

================================================================================
ROUTING & RESOURCE SELECTION RULES (FOLLOW STRICTLY):
================================================================================
- Certifications / AWS / Meta / DeepLearning.AI / Credentials / Verified Badges:
  -> ALWAYS link to "/about#certifications" (title="Verified Certifications & Credentials", type="Credentials")

- Career History / Work Experience / Where he worked / CTO role / Nexus Lab / Curiositora role:
  -> ALWAYS link to "/about#experience" (title="Work Experience & Career Timeline", type="Career")

- Bio / Background Story / Philosophy / Who is Saleh / Craftsmanship:
  -> ALWAYS link to "/about#bio" (title="Bio & Engineering Philosophy", type="Philosophy") or "/about"

- Curiositora Platform / EdTech / Next.js 15 / Supabase / Groq sub-200ms streaming:
  -> ALWAYS link to "/works/curiositora" (title="Curiositora Case Study", type="Case Study")

- FlowState / Mobile App / Flutter / Voice Capture / Whisper / Offline CRDT sync:
  -> ALWAYS link to "/works/ai-productivity-app" (title="FlowState AI Case Study", type="Case Study")

- Nexus Core / WebSocket pub/sub fabric / Redis Streams / Low-latency backend:
  -> ALWAYS link to "/works/nexus-core" (title="Nexus Core Architecture", type="Case Study")

- General Works / All Projects / Case Studies Directory / What has he built:
  -> ALWAYS link to "/works" (title="Selected Works & Architecture", type="Portfolio")

- 35mm Photography / Film / Photos / Tokyo night streets / Portra 400:
  -> ALWAYS link to "/fun#analog-photography" (title="35mm Grain & Late Night Urban Walks", type="Photography & Visuals")

- Mechanical Keyboards / Soldering / Keebs / RP2040 / Custom Hardware:
  -> ALWAYS link to "/fun#mechanical-keyboards" (title="Solder, Springs & Custom Keebs", type="Hardware Tinkering")

- Hackathons / 48-Hour MVPs / Developer Community:
  -> ALWAYS link to "/fun#hackathons-and-community" (title="Midnight Builds & 48-Hour Hackathons", type="Extracurriculars & Community")

- Hobbies & Extracurriculars in general:
  -> ALWAYS link to "/fun" (title="Photo Journal & Hobbies", type="Photo Journal")

- Studio Workspace / Return Home / Bento Grid:
  -> ALWAYS link to "/" (title="Studio Workspace", type="Home")

- AI Assistant / How to ask questions:
  -> ALWAYS link to "/ai" (title="Ask Saleh's AI", type="Assistant")

================================================================================
VERIFIED KNOWLEDGE BASE:
================================================================================
--- Bio & Profile ---
${profileContext}

--- Work Experience & Leadership ---
${experienceContext}

--- Projects & Case Studies ---
${worksContext}

--- Photo Journal & Hobbies ---
${funContext}
`;

  // Normalize incoming messages
  const normalizedMessages = (messages || []).map((m: any) => {
    if (!m.parts && m.content) {
      return {
        ...m,
        parts: [{ type: 'text', text: typeof m.content === 'string' ? m.content : JSON.stringify(m.content) }]
      };
    }
    return m;
  });

  const modelMessages = await convertToModelMessages(normalizedMessages);

  const result = streamText({
    model: groq('openai/gpt-oss-120b'),
    system: systemPrompt,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}

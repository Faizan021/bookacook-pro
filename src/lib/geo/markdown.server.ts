import fs from 'fs';
import path from 'path';

export interface GeoMarkdownData {
  title: string;
  description: string;
  h1: string;
  intro: string;
  areaServed: string;
  eventType?: string;
  faq: { question: string; answer: string }[];
  content: string;
}

export function parseFrontmatter(fileContent: string): GeoMarkdownData {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const match = fileContent.match(frontmatterRegex);
  
  const result: Partial<GeoMarkdownData> = {
    faq: [],
    content: ''
  };

  if (match) {
    const fmText = match[1];
    const content = fileContent.replace(frontmatterRegex, '').trim();
    result.content = content;

    const lines = fmText.split('\n');
    let inFaq = false;
    let currentFaq: any = null;

    for (const line of lines) {
      if (line.trim() === 'faq:') {
        inFaq = true;
        continue;
      }
      
      if (inFaq) {
        if (line.startsWith('  - question:')) {
          if (currentFaq) result.faq!.push(currentFaq);
          currentFaq = { question: line.replace('  - question:', '').replace(/^["']|["']$/g, '').trim() };
        } else if (line.startsWith('    answer:')) {
          if (currentFaq) {
            currentFaq.answer = line.replace('    answer:', '').replace(/^["']|["']$/g, '').trim();
          }
        } else if (!line.startsWith(' ') && line.trim() !== '') {
          inFaq = false;
          if (currentFaq) {
            result.faq!.push(currentFaq);
            currentFaq = null;
          }
        }
      }

      if (!inFaq) {
        const colonIdx = line.indexOf(':');
        if (colonIdx > -1) {
          const key = line.slice(0, colonIdx).trim();
          let value = line.slice(colonIdx + 1).trim();
          value = value.replace(/^["']|["']$/g, '');
          (result as any)[key] = value;
        }
      }
    }
    
    if (currentFaq) {
      result.faq!.push(currentFaq);
    }
  } else {
    result.content = fileContent;
  }

  return result as GeoMarkdownData;
}

export async function getGeoMarkdown(role: 'catering' | 'planner', filename: string): Promise<GeoMarkdownData | null> {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'geo', role, `${filename}.md`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return parseFrontmatter(content);
  } catch (e) {
    console.error('Failed to read geo markdown:', e);
    return null;
  }
}

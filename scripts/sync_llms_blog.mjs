import fs from 'fs';
import path from 'path';

// Read blog.ts
const blogPath = path.join(process.cwd(), 'src', 'data', 'blog.ts');
const blogContent = fs.readFileSync(blogPath, 'utf8');

const articles = [];
// Match each object in blogPosts
const regex = /slug:\s*"([^"]+)",[\s\S]*?title:\s*\{[\s\S]*?de:\s*"([^"]+)"[\s\S]*?description:\s*\{[\s\S]*?de:\s*"([^"]+)"/g;

let match;
while ((match = regex.exec(blogContent)) !== null) {
  articles.push({
    slug: match[1],
    title: match[2],
    description: match[3],
  });
}

console.log(`Found ${articles.length} blog articles in blog.ts`);

if (articles.length === 0) {
  console.error('Failed to parse articles');
  process.exit(1);
}

// Generate the Markdown links for llms.txt
const blogMarkdown = articles
  .map((a) => `- [${a.title}](https://speisely.de/blog/${a.slug}): ${a.description}`)
  .join('\n');

const blogSection = `## Editorial Guides & Blog Articles\n\n${blogMarkdown}\n`;

// 1. Update public/llms.txt
const llmsPath = path.join(process.cwd(), 'public', 'llms.txt');
let llmsText = fs.readFileSync(llmsPath, 'utf8');

if (llmsText.includes('## Editorial Guides & Blog Articles')) {
  llmsText = llmsText.replace(/## Editorial Guides & Blog Articles[\s\S]*?(?=\n##|$)/, blogSection.trim());
} else {
  const target = '## Speisely Visits & Community Partner Spotlights';
  if (llmsText.includes(target)) {
    llmsText = llmsText.replace(target, `${blogSection}\n${target}`);
  } else {
    llmsText += `\n\n${blogSection}`;
  }
}

fs.writeFileSync(llmsPath, llmsText, 'utf8');
console.log('✓ Successfully synchronized public/llms.txt with all blog articles.');

// 2. Update public/llms-full.txt
const llmsFullPath = path.join(process.cwd(), 'public', 'llms-full.txt');
if (fs.existsSync(llmsFullPath)) {
  let llmsFullText = fs.readFileSync(llmsFullPath, 'utf8');
  if (llmsFullText.includes('## Editorial Guides & Blog Articles')) {
    llmsFullText = llmsFullText.replace(/## Editorial Guides & Blog Articles[\s\S]*?(?=\n##|$)/, blogSection.trim());
  } else {
    const targetFull = '## Speisely Visits & Community Partner Spotlights';
    if (llmsFullText.includes(targetFull)) {
      llmsFullText = llmsFullText.replace(targetFull, `${blogSection}\n${targetFull}`);
    } else {
      llmsFullText += `\n\n${blogSection}`;
    }
  }
  fs.writeFileSync(llmsFullPath, llmsFullText, 'utf8');
  console.log('✓ Successfully synchronized public/llms-full.txt with all blog articles.');
}

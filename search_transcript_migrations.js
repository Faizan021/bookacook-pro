import { readFileSync } from 'fs';
try {
  const logContent = readFileSync('C:/Users/ahmad/.gemini/antigravity/brain/50c0003c-9bc8-4772-bed5-898f20518055/.system_generated/logs/transcript_full.jsonl', 'utf8');
  const lines = logContent.split('\n');
  for (const line of lines) {
    if (!line.trim()) continue;
    const step = JSON.parse(line);
    if (step.tool_calls) {
      for (const call of step.tool_calls) {
        if (call.name === 'run_command' && call.args.CommandLine.includes('supabase')) {
          console.log("Found command:", call.args.CommandLine);
        }
      }
    }
  }
} catch (e) {
  console.error("Error reading transcript:", e);
}

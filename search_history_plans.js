import fs from "fs";
import path from "path";
import readline from "readline";

const logPath =
  "C:\\\\Users\\\\ahmad\\\\.gemini\\\\antigravity\\\\brain\\\\50c0003c-9bc8-4772-bed5-898f20518055\\\\.system_generated\\\\logs\\\\transcript.jsonl";

if (!fs.existsSync(logPath)) {
  console.log("Log file not found");
  process.exit(1);
}

const fileStream = fs.createReadStream(logPath);

async function run() {
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const matches = [];

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const obj = JSON.parse(line);
      const content = obj.content || "";

      // Look for matches of specific numbers 5, 6, 10, 11, etc.
      const match = content.match(/(milestone|phase|plan)\s*(5|6|10|11)\b/i);
      if (match) {
        matches.push({
          step_index: obj.step_index,
          source: obj.source,
          type: obj.type,
          created_at: obj.created_at,
          matchedText: match[0],
          snippet: content.substring(0, 1000),
        });
      }
    } catch (e) {
      // ignore
    }
  }

  // Print all found matches
  console.log(JSON.stringify(matches, null, 2));
}

run();

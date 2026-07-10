import fs from "fs";

const file = "C:/recoverd usb/Speisely Marketplace1/src/routes/_authenticated/caterer.tsx";
if (fs.existsSync(file)) {
  const content = fs.readFileSync(file, "utf8");
  const lines = content.split("\n");
  lines.forEach((line, index) => {
    const lowerLine = line.toLowerCase();
    if (
      lowerLine.includes("commission") ||
      lowerLine.includes("payout") ||
      lowerLine.includes("fee") ||
      lowerLine.includes("%") ||
      lowerLine.includes("10") ||
      lowerLine.includes("0.1") ||
      lowerLine.includes("earn") ||
      lowerLine.includes("revenue") ||
      lowerLine.includes("booking") ||
      lowerLine.includes("brief")
    ) {
      console.log(`${index + 1}: ${line.trim()}`);
    }
  });
} else {
  console.log("File not found");
}

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const WORD = "Teflon";

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

if (WORD.length < 1 || WORD.length > 30) {
  console.error("word must be 1-30 characters");
  process.exit(1);
}
if (WORD.trim() !== WORD || WORD.length === 0) {
  console.error("word must not be only whitespace");
  process.exit(1);
}
if (/\s/.test(WORD)) {
  console.error("entry must be exactly one word (no spaces)");
  process.exit(1);
}
if (WORD.includes("\n") || WORD.includes("\r")) {
  console.error("entry must be a single line");
  process.exit(1);
}
// Ties break on bytes: assert the UTF-8 byte length is in the 1-30 gate
// and, for this all-ASCII word, equals the character length.
const byteLen = Buffer.byteLength(WORD, "utf8");
if (byteLen < 1 || byteLen > 30) {
  console.error("word must be 1-30 bytes");
  process.exit(1);
}
if (byteLen !== WORD.length) {
  console.error("word must be ASCII so bytes equal chars");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, WORD, "utf8");

// Read-back check: the file must contain exactly the word, byte-identical.
const back = readFileSync(outPath, "utf8");
if (back !== WORD) {
  console.error("read-back mismatch");
  process.exit(1);
}
console.log(`wrote ${outPath} (${WORD.length} chars)`);

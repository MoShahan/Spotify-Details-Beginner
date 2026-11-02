#!/usr/bin/env node
/**
 * Replace em dashes (-) with hyphens (-) in any text file.
 * Used by lint-staged so docs, env, configs, and code all get fixed on commit.
 *
 * Usage: node scripts/fix-em-dash.mjs [file ...]
 * Exit 0 always after writing fixes (lint-staged re-stages).
 */
import fs from 'node:fs';

const EM_DASH = '\u2014';
const HYPHEN = '-';

const files = process.argv.slice(2);
let changed = 0;

for (const file of files) {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    continue;
  }

  const buffer = fs.readFileSync(file);
  // Skip binary-ish files
  if (buffer.includes(0)) {
    continue;
  }

  const original = buffer.toString('utf8');
  if (!original.includes(EM_DASH)) {
    continue;
  }

  const next = original.split(EM_DASH).join(HYPHEN);
  fs.writeFileSync(file, next, 'utf8');
  changed += 1;
  console.log(`fixed em dash → hyphen: ${file}`);
}

if (files.length === 0) {
  console.error('Usage: node scripts/fix-em-dash.mjs <file>...');
  process.exit(1);
}

process.exit(0);

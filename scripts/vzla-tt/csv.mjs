#!/usr/bin/env node
/*
 * Minimal RFC 4180 CSV reader/writer. Written in-tree deliberately: the study
 * has to run in locked-down environments where `npm install` is unavailable,
 * so the pipeline carries no third-party dependencies.
 *
 * Handles quoted fields, escaped quotes (""), embedded commas and newlines,
 * and both LF and CRLF line endings.
 */

/**
 * Parse CSV text into row objects keyed by the header row.
 * @param {string} text
 * @returns {{header: string[], rows: Record<string,string>[], lineNos: number[]}}
 *   lineNos[i] is the 1-based source line where rows[i] began, for error messages.
 */
export function parseCsv(text) {
  const records = [];
  const startLines = [];
  let field = "";
  let record = [];
  let inQuotes = false;
  let line = 1;
  let recordStartLine = 1;
  let sawAny = false;

  // Strip a UTF-8 BOM; spreadsheet exports routinely include one.
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  for (let i = 0; i < text.length; i++) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        if (c === "\n") line++;
        field += c;
      }
      continue;
    }

    if (c === '"' && field === "") {
      inQuotes = true;
      sawAny = true;
    } else if (c === ",") {
      record.push(field);
      field = "";
      sawAny = true;
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      record.push(field);
      if (sawAny || record.some((f) => f !== "")) {
        records.push(record);
        startLines.push(recordStartLine);
      }
      record = [];
      field = "";
      line++;
      recordStartLine = line;
      sawAny = false;
    } else {
      field += c;
      sawAny = true;
    }
  }

  if (sawAny || field !== "" || record.length) {
    record.push(field);
    if (record.some((f) => f !== "")) {
      records.push(record);
      startLines.push(recordStartLine);
    }
  }

  if (!records.length) return { header: [], rows: [], lineNos: [] };

  const header = records[0].map((h) => h.trim());
  const rows = [];
  const lineNos = [];
  for (let r = 1; r < records.length; r++) {
    const obj = {};
    header.forEach((h, c) => {
      obj[h] = (records[r][c] ?? "").trim();
    });
    rows.push(obj);
    lineNos.push(startLines[r]);
  }
  return { header, rows, lineNos };
}

/**
 * Serialise rows to CSV, quoting only where required.
 * @param {string[]} columns
 * @param {Record<string,string|number>[]} rows
 * @returns {string}
 */
export function toCsv(columns, rows) {
  const esc = (v) => {
    const s = v === undefined || v === null ? "" : String(v);
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [columns.map(esc).join(",")];
  for (const row of rows) lines.push(columns.map((c) => esc(row[c])).join(","));
  return lines.join("\n") + "\n";
}

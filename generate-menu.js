import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

const csvPath = path.join("src", "menu.csv");
const outputPath = path.join("src", "menu.js");

const csvData = fs.readFileSync(csvPath, "utf-8");

const records = parse(csvData, {
  columns: ["id", "category", "name", "full", "half"],
  skip_empty_lines: true,
  trim: true
});

const menu = records.map((r) => ({
  id: Number(r.id),
  category: r.category,
  name: r.name,
  full: r.full ? Number(r.full) : null,
  half: r.half ? Number(r.half) : null
}));

const jsContent = `export const menu = ${JSON.stringify(menu, null, 2)};`;

fs.writeFileSync(outputPath, jsContent);

console.log("✅ menu.js generated successfully");

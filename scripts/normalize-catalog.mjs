import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const sourcePath = path.join(rootDir, "old", "data", "catalog_updated.json");
const imagesDir = path.join(rootDir, "images");
const outputDir = path.join(rootDir, "src", "data");

const source = JSON.parse(await readFile(sourcePath, "utf8"));
const imageFiles = (await readdir(imagesDir)).filter((name) => /\.jpe?g$/i.test(name));

function getNumber(record) {
  const candidates = [record.Cover, ...(record.Images || []), record.SKU, record.Title];
  for (const candidate of candidates) {
    const text = decodeURIComponent(String(candidate || ""));
    const match = text.match(/#(\d{3})\b/) || text.match(/-(\d{3})(?:_|\b)/);
    if (match) return Number(match[1]);
  }
  return null;
}

function rawImageUrl(filename) {
  return `https://raw.githubusercontent.com/xkbn7779090-cmyk/Art/main/images/${encodeURIComponent(filename)}`;
}

function filesFor(number) {
  const prefixes = [`#${number}_`];
  if (number === 227) prefixes.push("#228_");

  const matches = imageFiles.filter((name) => prefixes.some((prefix) => name.startsWith(prefix)));
  return matches.sort((a, b) => {
    const rank = (name) => {
      if (name.startsWith(`#${number}_main_`)) return 0;
      if (name.startsWith(`#${number}_detail_`)) return 1;
      if (name.includes("_main_")) return 2;
      return 3;
    };
    return rank(a) - rank(b) || a.localeCompare(b);
  });
}

function materialKind(material = "") {
  return /board/i.test(material) ? "board" : "canvas";
}

function materialRu(material = "") {
  if (/board/i.test(material)) return "Масло, холст на картоне";
  if (/canvas/i.test(material)) return "Масло, холст на подрамнике";
  return material;
}

function normalizeRecord(number, record) {
  const files = filesFor(number);
  if (files.length < 2) throw new Error(`Expected at least two images for #${number}, found ${files.length}`);

  const title = String(record.Title || "")
    .replace(/^#\d+\s*/, "")
    .trim() || "Untitled";
  const price = Number(String(record.Price || "").replace(/[^\d]/g, "")) || null;
  const material = record.Material || "";

  return {
    id: number,
    number,
    title,
    displayTitle: `#${number} ${title}`,
    description: {
      en: record["Description (EN)"] || "",
      ru: record["Description (RU)"] || "",
    },
    size: record.Size || "—",
    material: {
      en: material,
      ru: materialRu(material),
      kind: materialKind(material),
    },
    price,
    currency: "EUR",
    status: "available",
    location: record["Created in"] || "Limburg, Netherlands",
    sku: record.SKU || "",
    cover: rawImageUrl(files[0]),
    images: files.map(rawImageUrl),
    needsReview: false,
  };
}

const grouped = new Map();
for (const record of source) {
  const number = getNumber(record);
  if (!number) throw new Error(`Could not determine artwork number for ${record.Title || record.SKU}`);
  const records = grouped.get(number) || [];
  records.push(record);
  grouped.set(number, records);
}

const duplicateDecisions = [];
const canonical = [];

for (let number = 100; number <= 227; number += 1) {
  if (number === 123) {
    const files = filesFor(number);
    if (files.length !== 2) throw new Error(`Expected two source images for review card #123, found ${files.length}`);
    canonical.push({
      id: 123,
      number: 123,
      title: "Untitled",
      displayTitle: "#123 Untitled",
      description: {
        en: "This work has been restored from the image archive. Its title, size, material and price still need to be confirmed.",
        ru: "Работа восстановлена по фотоархиву. Название, размер, материал и цена ещё требуют подтверждения.",
      },
      size: "—",
      material: { en: "Details pending", ru: "Данные уточняются", kind: "unknown" },
      price: null,
      currency: "EUR",
      status: "review",
      location: "Limburg, Netherlands",
      sku: "UNVERIFIED-123",
      cover: rawImageUrl(files[0]),
      images: files.map(rawImageUrl),
      needsReview: true,
    });
    continue;
  }

  const records = grouped.get(number) || [];
  if (!records.length) throw new Error(`Missing catalog record for #${number}`);

  const preferred =
    records.find((record) => !String(record.SKU || "").includes("_Untitled_")) || records[0];

  if (records.length > 1) {
    duplicateDecisions.push({
      number,
      kept: preferred.Title,
      removed: records.filter((record) => record !== preferred).map((record) => record.Title),
    });
  }

  canonical.push(normalizeRecord(number, preferred));
}

if (canonical.length !== 128) throw new Error(`Expected 128 canonical works, found ${canonical.length}`);

const audit = {
  generatedAt: new Date().toISOString(),
  sourceRecords: source.length,
  canonicalWorks: canonical.length,
  physicalRange: "#100–#227",
  duplicateDecisions,
  restoredReviewCards: [123],
  foldedAssetNumbers: { 228: 227 },
  notes: [
    "Artwork #123 is intentionally marked for review because its editorial record is missing.",
    "Files numbered #228 are detail views of #227 Long Hush and are included in that work's gallery.",
    "Image URLs are rebuilt from the repository filenames, replacing eight broken legacy references.",
  ],
};

await mkdir(outputDir, { recursive: true });
await writeFile(path.join(outputDir, "catalog.json"), `${JSON.stringify(canonical, null, 2)}\n`, "utf8");
await writeFile(path.join(outputDir, "audit.json"), `${JSON.stringify(audit, null, 2)}\n`, "utf8");

console.log(`Generated ${canonical.length} canonical works from ${source.length} source records.`);
console.log(`Resolved duplicate numbers: ${duplicateDecisions.map(({ number }) => `#${number}`).join(", ")}`);

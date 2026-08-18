import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const catalog = JSON.parse(await readFile(path.join(rootDir, "src", "data", "catalog.json"), "utf8"));
function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(catalog.length === 128, `Expected 128 works, found ${catalog.length}`);
assert(new Set(catalog.map((work) => work.number)).size === 128, "Artwork numbers are not unique");

for (let number = 100; number <= 227; number += 1) {
  assert(catalog.some((work) => work.number === number), `Missing artwork #${number}`);
}

const referencedUrls = catalog.flatMap((work) => work.images);
const referencedImages = referencedUrls
  .map((url) => decodeURIComponent(new URL(url).pathname.split("/").pop()))
  .sort();

assert(referencedImages.length === 258, `Expected 258 referenced images, found ${referencedImages.length}`);
assert(new Set(referencedImages).size === 258, "An image is referenced more than once");
assert(new Set(referencedUrls).size === 258, "An image URL is referenced more than once");

for (const url of referencedUrls) {
  const parsed = new URL(url);
  assert(parsed.protocol === "https:", `Image URL must use HTTPS: ${url}`);
  assert(parsed.hostname === "raw.githubusercontent.com", `Unexpected image host: ${url}`);
  assert(
    parsed.pathname.startsWith("/xkbn7779090-cmyk/Art/main/images/"),
    `Image URL does not point to the public Art archive: ${url}`,
  );
  assert(/\.jpe?g$/i.test(parsed.pathname), `Image URL is not a JPEG: ${url}`);
}

for (const work of catalog) {
  assert(work.images.includes(work.cover), `Cover for #${work.number} is not present in its image list`);
}

const reviewWork = catalog.find((work) => work.number === 123);
assert(reviewWork?.status === "review" && reviewWork?.needsReview, "#123 must remain marked for review");
assert(reviewWork?.price === null, "#123 must not invent a price");

const longHush = catalog.find((work) => work.number === 227);
assert(longHush?.images.length === 4, "#227 must include its four verified image views");
assert(longHush.images.some((url) => decodeURIComponent(url).includes("#228_main_")), "#227 is missing the #228 main detail view");
assert(longHush.images.some((url) => decodeURIComponent(url).includes("#228_detail_")), "#227 is missing the #228 detail view");

for (const work of catalog.filter((item) => item.number !== 123)) {
  assert(work.status === "available", `Unexpected status for #${work.number}`);
  assert(work.price > 0, `Missing price for #${work.number}`);
  assert(work.description.en && work.description.ru, `Missing bilingual description for #${work.number}`);
}

console.log("Catalog verification passed: 128 works, 258 unique images, complete #100–#227 range.");

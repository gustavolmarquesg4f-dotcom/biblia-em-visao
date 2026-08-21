import { readFileSync, writeFileSync } from "node:fs";

const path = "client/public/data/advanced-book-dossiers.json";
const payload = JSON.parse(readFileSync(path, "utf8"));
const results = Array.isArray(payload) ? payload : payload.results || [];
const replacements = new Map([
  ["https://www.ccel.org/lxx", "https://www.sefaria.org/"],
  ["https://www.zondervan.com/9780310206101/deuteronomy/", "https://www.zondervan.com/"],
  ["https://www.ivpress.com/joshua-commentary", "https://www.ivpress.com/"],
  ["https://books.google.com/books?id=1234example", "https://books.google.com/"],
  ["https://archive.org/details/12chroniclesnewc00will", "https://archive.org/search?query=1%20Chronicles%20commentary"],
  ["https://www.gotquestions.org/Book-of-Zephaniah.html", "https://bibleproject.com/guides/book-of-zephaniah/"],
  ["https://www.zondervan.com/9780310521921/word-biblical-commentary-vol-45-1-and-2-thessalonians/", "https://www.zondervan.com/"],
  ["http://www.earlychristianwritings.com/pastorals.html", "https://www.earlychristianwritings.com/"],
  ["https://www.uni-muenster.de/FBMD/ivf/ntvm/", "https://ntvmr.uni-muenster.de/"],
  ["https://zondervanacademic.com/products/letters-and-revelation-from-john-to-patmos", "https://zondervanacademic.com/"],
  ["https://bakeracademic.com/p/Proverbs-Tremper-Longman-III/9780801026955", "https://bakeracademic.com/"],
  ["https://www.sketchesofthec_cntr.org", "https://www.bibleproject.com/guides/"],
  ["https://tanakh.us/", "https://www.sefaria.org/"],
  ["https://www.tanakh.us", "https://www.sefaria.org/"],
  ["https://www.anchorbible.com", "https://yalebooks.yale.edu/"],
  ["https://archive.org", "https://archive.org/search"],
]);
let changed = 0;
let entries = 0;
const cleanEntry = (source) => {
  const match = source.match(/https?:\/\/[^\s\]\\)}>]+/);
  if (!match) return source.trim();
  const url = match[0].replace(/[.,;]+$/, "");
  return replacements.get(url) || url;
};
for (const item of results) {
  const output = item?.output ?? item;
  for (const field of ["primary_sources", "academic_bibliography"]) {
    if (typeof output?.[field] !== "string") continue;
    const parts = output[field].split(/;\s*/).filter(Boolean);
    const cleaned = parts.map(cleanEntry);
    entries += cleaned.length;
    if (cleaned.join("; ") !== output[field]) {
      output[field] = cleaned.join("; ");
      changed += 1;
    }
  }
}
writeFileSync(path, JSON.stringify(payload, null, 2) + "\n");
console.log(JSON.stringify({ entries, records: results.length, recordsChanged: changed }, null, 2));

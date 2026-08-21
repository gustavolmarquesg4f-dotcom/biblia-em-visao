import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const sourceRoot = join(root, "client/src");
const files = [];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const file = join(dir, entry);
    const stat = statSync(file);
    if (stat.isDirectory()) walk(file);
    else if (/\.(tsx|ts|css)$/.test(file)) files.push(file);
  }
}
walk(sourceRoot);
const text = files.map((file) => ({ file: relative(root, file), content: readFileSync(file, "utf8") }));
const tsx = text.filter(({ file }) => file.endsWith(".tsx"));
const css = text.filter(({ file }) => file.endsWith(".css"));
const joinedTsx = tsx.map((item) => item.content).join("\n");
const joinedCss = css.map((item) => item.content).join("\n");

const imgTags = [...joinedTsx.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag);
const buttonTags = [...joinedTsx.matchAll(/<button\b[^>]*>/g)].map(([tag]) => tag);
const inputRecords = [];
for (const item of tsx) {
  for (const match of item.content.matchAll(/<input\b/g)) {
    const tag = item.content.slice(match.index, match.index + 1400);
    const before = item.content.slice(Math.max(0, match.index - 1100), match.index);
    const insideLabel = /<label\b[^>]*>[\s\S]*$/i.test(before) && !/<\/label>[\s\S]*$/i.test(before);
    const genericComponent = item.file === "client/src/components/ui/input.tsx";
    const sourceNamed = /\baria-label\s*=|\baria-labelledby\s*=|\bid\s*=/.test(tag);
    inputRecords.push({ tag, file: item.file, insideLabel, genericComponent, sourceNamed });
  }
}
const interactiveGaps = [];
for (const [index, tag] of buttonTags.entries()) {
  if (!/\btype\s*=/.test(tag)) interactiveGaps.push({ kind: "button-type", index, tag: tag.slice(0, 240) });
}
for (const [index, tag] of imgTags.entries()) {
  if (!/\balt\s*=/.test(tag)) interactiveGaps.push({ kind: "image-alt", index, tag: tag.slice(0, 240) });
}
for (const [index, input] of inputRecords.entries()) {
  const named = input.sourceNamed || input.insideLabel || input.genericComponent;
  if (!named) interactiveGaps.push({ kind: "input-name", index, file: input.file, tag: input.tag.slice(0, 240) });
}
const namedInputs = inputRecords.filter((input) => input.sourceNamed || input.insideLabel || input.genericComponent).length;
const report = {
  generatedAt: new Date().toISOString(),
  filesScanned: files.length,
  imageTags: imgTags.length,
  buttonTags: buttonTags.length,
  inputTags: inputRecords.length,
  imagesWithAlt: imgTags.filter((tag) => /\balt\s*=/.test(tag)).length,
  buttonsWithType: buttonTags.filter((tag) => /\btype\s*=/.test(tag)).length,
  inputsNamed: namedInputs,
  focusVisibleRules: (joinedCss.match(/:focus-visible/g) || []).length,
  reducedMotionRules: (joinedCss.match(/prefers-reduced-motion/g) || []).length,
  overflowGuards: (joinedCss.match(/overflow-x\s*:\s*(hidden|clip|auto)/g) || []).length,
  gaps: interactiveGaps,
  status: interactiveGaps.length === 0 ? "APROVADA" : "REVISAR",
};
writeFileSync(join(root, "audit/accessibility-final.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));

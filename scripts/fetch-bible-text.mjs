import fs from "node:fs";
const url = "https://bible.helloao.org/api/por_blj/complete.simple.json";
const output = "/tmp/por_blj.complete.simple.json";
const response = await fetch(url);
if (!response.ok) throw new Error(`Não foi possível baixar a fonte textual: ${response.status}`);
const payload = await response.arrayBuffer();
fs.writeFileSync(output, Buffer.from(payload));
console.log(JSON.stringify({ output, bytes: payload.byteLength, source: url }));

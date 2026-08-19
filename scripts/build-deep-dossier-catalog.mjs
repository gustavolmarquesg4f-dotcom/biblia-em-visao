import { readFile, writeFile } from 'node:fs/promises'

const project = '/home/ubuntu/biblia-em-visao'
const sourceIndex = JSON.parse(await readFile('/home/ubuntu/expandir_dossies_59_livros.json', 'utf8'))
const catalogPath = `${project}/client/public/data/deep-dossier-catalog.json`
const catalog = JSON.parse(await readFile(catalogPath, 'utf8'))

const canonical = (value) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/^(1|2|3)\s+/, '$1-')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')

const displayName = {
  Cantares: 'Cântico dos Cânticos',
  Oséias: 'Oseias',
}

function headingsFor(markdown) {
  const headings = [...markdown.matchAll(/^#{1,3}\s+(.+)$/gm)].map((match) => match[1].replace(/[*_`]/g, '').trim())
  return [...new Set(headings)].slice(0, 40)
}

function extendedRecord(existing, generated, bookName) {
  const generatedText = generated.trim()
  const currentText = existing?.markdown?.trim() || ''
  const markdown = [
    `# Dossiê aprofundado · ${bookName}`,
    '',
    '> Este verbete reúne duas camadas complementares: uma rota de leitura aprofundada por passagens e o dossiê enciclopédico integral. Onde há debate, o texto o identifica em vez de nivelar interpretações diferentes.',
    '',
    generatedText,
    '',
    '---',
    '',
    '## Arquivo enciclopédico complementar',
    '',
    currentText,
  ].join('\n')
  const paragraphs = markdown.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean)
  return {
    bookName,
    confidence: existing?.confidence ?? null,
    bytes: Buffer.byteLength(markdown, 'utf8'),
    sectionCount: headingsFor(markdown).length,
    longParagraphCount: paragraphs.filter((part) => part.replace(/[#>*_`\-]/g, '').length >= 350).length,
    headings: headingsFor(markdown),
    markdown,
  }
}

const existingByKey = new Map(catalog.books.map((book) => [canonical(book.bookName), book]))
const additions = []

for (const result of sourceIndex.results) {
  const output = result.output
  if (!output?.book || !output?.dossier_file) continue
  const bookName = displayName[output.book] || output.book
  const response = await fetch(output.dossier_file)
  if (!response.ok) throw new Error(`Não foi possível obter o dossiê de ${bookName}: ${response.status}`)
  const generated = await response.text()
  if (generated.trim().length < 2400) throw new Error(`O dossiê de ${bookName} ficou curto demais para incorporação.`)
  additions.push(extendedRecord(existingByKey.get(canonical(bookName)), generated, bookName))
}

const additionsByKey = new Map(additions.map((book) => [canonical(book.bookName), book]))
const mergedBooks = catalog.books.map((book) => additionsByKey.get(canonical(book.bookName)) || book)
const result = {
  books: mergedBooks,
  generatedAt: new Date().toISOString(),
  methodology: 'Dossiês integrais com texto, contexto, debate, leitura pentecostal/IDB e fontes; os 59 livros adicionados receberam uma rota aprofundada por passagens integrada ao arquivo enciclopédico já existente.',
}

await writeFile(catalogPath, `${JSON.stringify(result)}\n`)
console.log(JSON.stringify({ books: mergedBooks.length, expanded: additions.length, bytes: Buffer.byteLength(JSON.stringify(result), 'utf8') }))

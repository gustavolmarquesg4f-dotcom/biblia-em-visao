import { describe, expect, it } from "vitest";

import { registerBiographyCatalog } from "@/lib/biography-data";

describe("sobreposição de vínculos biográficos", () => {
  it("aplica somente os livros verificados e preserva os vínculos legados", () => {
    const [record] = registerBiographyCatalog(
      {
        records: [
          {
            id: "person-eva",
            name: "Eva",
            biography: "Dossiê preservado.",
            books: ["Oseias", "Naum"],
          },
        ],
      },
      {
        records: [
          {
            id: "person-eva",
            books: ["Gênesis"],
            rawBooks: ["Oseias", "Naum"],
            bookLinkMethod: "explicit-reference-prefix-v1",
            bookLinksVerified: true,
          },
        ],
      }
    );

    expect(record.books).toEqual(["Gênesis"]);
    expect(record.rawBooks).toEqual(["Oseias", "Naum"]);
    expect(record.biography).toBe("Dossiê preservado.");
  });
});

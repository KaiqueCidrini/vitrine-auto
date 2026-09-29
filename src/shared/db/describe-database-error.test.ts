import { describe, expect, it } from "vitest";

import { describeDatabaseError } from "./describe-database-error";

function wrapLikeDrizzle(cause: object): Error {
  return new Error('Failed query: select "id" from "users"', { cause });
}

describe("describeDatabaseError", () => {
  it("explica quando as tabelas não existem", () => {
    const message = describeDatabaseError(
      wrapLikeDrizzle({ code: "42P01", message: 'relation "users" does not exist' }),
    );
    expect(message).toContain("npm run db:migrate");
    expect(message).toContain('relation "users" does not exist');
  });

  it("explica senha incorreta", () => {
    const message = describeDatabaseError(
      wrapLikeDrizzle({ code: "28P01", message: "password authentication failed" }),
    );
    expect(message).toContain("DATABASE_URL");
  });

  it("mostra a causa original quando não há dica conhecida", () => {
    expect(describeDatabaseError(wrapLikeDrizzle({ code: "XX000", message: "erro interno" }))).toBe(
      "erro interno",
    );
    expect(describeDatabaseError("texto solto")).toBe("texto solto");
  });
});

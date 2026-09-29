import { describe, expect, it } from "vitest";

import { AttemptLimiter } from "./attempt-limiter";

function createLimiter() {
  let currentTime = 0;
  const limiter = new AttemptLimiter({ maxFailures: 3, windowInMs: 1000, now: () => currentTime });
  return { limiter, advanceTime: (ms: number) => (currentTime += ms) };
}

describe("AttemptLimiter", () => {
  it("bloqueia depois do limite de falhas", () => {
    const { limiter } = createLimiter();
    limiter.registerFailure("ip:email");
    limiter.registerFailure("ip:email");
    expect(limiter.isBlocked("ip:email")).toBe(false);

    limiter.registerFailure("ip:email");
    expect(limiter.isBlocked("ip:email")).toBe(true);
    expect(limiter.isBlocked("outra-chave")).toBe(false);
  });

  it("libera quando a janela de tempo expira", () => {
    const { limiter, advanceTime } = createLimiter();
    for (let attempt = 0; attempt < 3; attempt++) limiter.registerFailure("chave");

    advanceTime(1001);
    expect(limiter.isBlocked("chave")).toBe(false);
  });

  it("zera a contagem após um login bem-sucedido", () => {
    const { limiter } = createLimiter();
    for (let attempt = 0; attempt < 3; attempt++) limiter.registerFailure("chave");

    limiter.reset("chave");
    expect(limiter.isBlocked("chave")).toBe(false);
  });
});

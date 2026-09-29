interface AttemptWindow {
  failures: number;
  windowStartedAt: number;
}

interface AttemptLimiterOptions {
  maxFailures: number;
  windowInMs: number;
  now?: () => number;
}

/**
 * Conta tentativas que falharam por chave (ex.: IP + e-mail) dentro de uma janela de tempo.
 * Fica em memória: suficiente para o modelo de um servidor por concessionária.
 */
export class AttemptLimiter {
  private readonly windows = new Map<string, AttemptWindow>();
  private readonly maxFailures: number;
  private readonly windowInMs: number;
  private readonly now: () => number;

  constructor({ maxFailures, windowInMs, now = Date.now }: AttemptLimiterOptions) {
    this.maxFailures = maxFailures;
    this.windowInMs = windowInMs;
    this.now = now;
  }

  isBlocked(key: string): boolean {
    const window = this.getActiveWindow(key);
    return Boolean(window && window.failures >= this.maxFailures);
  }

  registerFailure(key: string): void {
    const window = this.getActiveWindow(key) ?? { failures: 0, windowStartedAt: this.now() };
    window.failures += 1;
    this.windows.set(key, window);
  }

  reset(key: string): void {
    this.windows.delete(key);
  }

  private getActiveWindow(key: string): AttemptWindow | undefined {
    const window = this.windows.get(key);
    if (!window) return undefined;

    if (this.now() - window.windowStartedAt > this.windowInMs) {
      this.windows.delete(key);
      return undefined;
    }
    return window;
  }
}

import { describe, expect, it } from "vitest";

import {
  calculateResizedDimensions,
  MAX_UPLOAD_SIZE_IN_BYTES,
  needsResizeBeforeUpload,
} from "./photo-upload-sizing";

describe("calculateResizedDimensions", () => {
  it("reduz fotos horizontais mantendo a proporção", () => {
    expect(calculateResizedDimensions({ width: 4032, height: 3024 })).toEqual({
      width: 2000,
      height: 1500,
    });
  });

  it("limita pelo maior lado em fotos verticais", () => {
    expect(calculateResizedDimensions({ width: 3024, height: 4032 })).toEqual({
      width: 1500,
      height: 2000,
    });
  });

  it("não amplia fotos pequenas", () => {
    expect(calculateResizedDimensions({ width: 1280, height: 960 })).toEqual({
      width: 1280,
      height: 960,
    });
  });
});

describe("needsResizeBeforeUpload", () => {
  it("reprocessa fotos grandes em pixels ou em bytes", () => {
    expect(needsResizeBeforeUpload({ width: 4032, height: 3024 }, 500_000)).toBe(true);
    expect(
      needsResizeBeforeUpload({ width: 1600, height: 1200 }, MAX_UPLOAD_SIZE_IN_BYTES + 1),
    ).toBe(true);
  });

  it("envia direto fotos que já são leves", () => {
    expect(needsResizeBeforeUpload({ width: 1600, height: 1200 }, 800_000)).toBe(false);
  });
});

import sharp from "sharp";

import type { BodyType } from "@/features/vehicles/domain/vehicle-attributes";

const WIDTH = 1600;
const HEIGHT = 1200;
const CAR_SCALE = 1.45;
const GROUND_Y = 860;

/** Silhuetas laterais simplificadas (viewBox 1000x400) por tipo de carroceria. */
const BODY_PATHS: Partial<Record<BodyType, string>> = {
  hatch:
    "M90 290 C90 250 110 232 160 224 L300 206 C360 150 430 118 520 116 L640 118 C700 122 745 150 790 205 L870 222 C905 230 915 250 915 290 Z",
  sedan:
    "M70 292 C70 252 92 236 150 228 L300 212 C370 150 440 126 530 124 L630 126 C690 130 735 160 780 206 L890 222 C925 230 935 252 935 292 Z",
  suv: "M80 300 C80 240 98 222 150 214 L260 196 C310 128 360 100 460 98 L700 100 C760 104 800 140 830 196 L885 210 C915 220 925 245 925 300 Z",
  pickup:
    "M70 300 C70 246 90 228 140 220 L250 204 C300 136 350 112 440 110 L560 112 C600 116 620 150 640 206 L920 206 C940 208 945 230 945 300 Z",
};

const WINDOW_PATHS: Partial<Record<BodyType, string>> = {
  hatch:
    "M330 206 C380 162 440 136 515 134 L560 134 L560 206 Z M580 134 L635 136 C690 140 725 166 760 206 L580 206 Z",
  sedan:
    "M330 212 C390 164 450 142 530 140 L570 140 L570 212 Z M590 140 L628 142 C680 146 715 172 750 212 L590 212 Z",
  suv: "M290 196 C330 142 380 118 460 116 L560 116 L560 196 Z M580 116 L695 118 C745 122 780 154 805 196 L580 196 Z",
  pickup:
    "M280 204 C320 150 370 128 445 126 L500 126 L500 204 Z M518 126 L555 128 C585 132 598 160 612 204 L518 204 Z",
};

function buildCarSvg(bodyType: BodyType, colorHex: string, variant: number): string {
  const body = BODY_PATHS[bodyType] ?? BODY_PATHS.hatch!;
  const windows = WINDOW_PATHS[bodyType] ?? WINDOW_PATHS.hatch!;
  const backgrounds = [
    ["#EEF1F5", "#C9D1DC"],
    ["#F5F1EA", "#D9CFBF"],
    ["#E9EEF0", "#BFCACF"],
  ];
  const [backgroundTop, backgroundBottom] = backgrounds[variant % backgrounds.length];
  const mirror = variant % 2 === 1 ? `translate(${WIDTH} 0) scale(-1 1)` : "";

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${backgroundTop}"/><stop offset="1" stop-color="${backgroundBottom}"/>
    </linearGradient>
    <linearGradient id="paint" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.35"/><stop offset="0.45" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.25"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect y="${GROUND_Y - 20}" width="100%" height="${HEIGHT - GROUND_Y + 20}" fill="#000" opacity="0.05"/>
  <g transform="${mirror}">
    <g transform="translate(${WIDTH / 2 - 500 * CAR_SCALE} ${GROUND_Y - 360 * CAR_SCALE}) scale(${CAR_SCALE})">
      <ellipse cx="500" cy="318" rx="440" ry="26" fill="#000" opacity="0.22"/>
      <path d="${body}" fill="${colorHex}"/>
      <path d="${body}" fill="url(#paint)"/>
      <path d="${windows}" fill="#1c2430" opacity="0.88"/>
      <rect x="120" y="258" width="780" height="6" fill="#000" opacity="0.12"/>
      ${[260, 745]
        .map(
          (x) => `
      <circle cx="${x}" cy="292" r="68" fill="#15181c"/>
      <circle cx="${x}" cy="292" r="40" fill="#9aa3ad"/>
      <circle cx="${x}" cy="292" r="12" fill="#5b636c"/>`,
        )
        .join("")}
    </g>
  </g>
  <text x="${WIDTH - 40}" y="${HEIGHT - 36}" text-anchor="end" font-family="Arial, sans-serif" font-size="30" fill="#000" opacity="0.35">Imagem ilustrativa</text>
</svg>`;
}

/** Gera uma foto ilustrativa em WebP para o estoque de demonstração. */
export async function renderDemoPhoto(bodyType: BodyType, colorHex: string, variant: number) {
  const { data, info } = await sharp(Buffer.from(buildCarSvg(bodyType, colorHex, variant)))
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });
  return { content: data, width: info.width, height: info.height };
}

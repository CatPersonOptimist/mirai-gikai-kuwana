// みらい議会＠桑名市 のロゴ・OGP・PWAアイコン生成
// モチーフ: 桑名名産のはまぐり + 木曽三川（揖斐川・長良川・木曽川）の3本の流れ
const sharp = require("sharp");
const fs = require("fs");
const OUT = process.argv[2];
const FONT = "Hiragino Sans, Hiragino Kaku Gothic ProN, Noto Sans JP, sans-serif";

const SHELL = "M60 8C70 8 80 14 90 24C104 38 112 52 110 66C108 82 88 92 60 92C32 92 12 82 10 66C8 52 16 38 30 24C40 14 50 8 60 8Z";
function markInner(id) {
  const ridges = [-50, -30, -10, 10, 30, 50]
    .map((dx) => `<path d="M60 12 L${60 + dx * 1.1} 92" stroke="#fff" stroke-opacity=".22" stroke-width="2"/>`)
    .join("");
  const waves = [56, 68, 80]
    .map((y) => `<path d="M4 ${y} C20 ${y - 8} 32 ${y - 8} 46 ${y} S72 ${y + 8} 86 ${y} S108 ${y - 8} 118 ${y}" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none"/>`)
    .join("");
  return `<defs>
    <linearGradient id="g${id}" x1="20" y1="8" x2="100" y2="92" gradientUnits="userSpaceOnUse">
      <stop stop-color="#7CC4EE"/><stop offset="1" stop-color="#1F6FB2"/>
    </linearGradient>
    <clipPath id="c${id}"><path d="${SHELL}"/></clipPath>
  </defs>
  <path d="${SHELL}" fill="url(#g${id})"/>
  <g clip-path="url(#c${id})">${ridges}${waves}</g>
  <path d="M52 10 Q60 2 68 10 Q60 14 52 10Z" fill="#0F4F86"/>`;
}
const markSvg = (w, h) =>
  `<svg width="${w}" height="${h}" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">${markInner("m")}</svg>`;

fs.writeFileSync(`${OUT}/img/logo.svg`, markSvg(42, 36) + "\n");
fs.writeFileSync(
  `${OUT}/img/service-logo.svg`,
  `<svg width="200" height="26" viewBox="0 0 200 26" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="21" font-family="${FONT}" font-weight="700" font-size="21" fill="#1F2937">みらい議会<tspan fill="#1F6FB2">＠桑名市</tspan></text></svg>\n`
);

const png = (svg, file, w, h) => sharp(Buffer.from(svg)).resize(w, h).png().toFile(file);

function icon(size, label) {
  const badge = label
    ? `<rect x="0" y="${size * 0.74}" width="${size}" height="${size * 0.26}" fill="${label === "DEV" ? "#dd425f" : "#ff9500"}"/>
       <text x="${size / 2}" y="${size * 0.93}" text-anchor="middle" font-family="${FONT}" font-weight="700" font-size="${size * 0.17}" fill="#fff">${label}</text>`
    : "";
  const inset = size * 0.16;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" fill="#E4F1FB"/>
    <svg x="${inset}" y="${inset * (label ? 0.6 : 1.1)}" width="${size - inset * 2}" height="${(size - inset * 2) * 0.83}" viewBox="0 0 120 100">${markInner("i")}</svg>
    ${badge}</svg>`;
}

function ogp() {
  const W = 2400, H = 1260;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop stop-color="#E4F1FB"/><stop offset="1" stop-color="#F7F4EE"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="40" height="${H}" fill="#1F6FB2"/>
  ${[0, 1, 2].map((i) => `<path d="M0 ${1050 + i * 60} C400 ${990 + i * 60} 800 ${1110 + i * 60} 1200 ${1050 + i * 60} S2000 ${990 + i * 60} 2400 ${1050 + i * 60}" stroke="#7CC4EE" stroke-opacity="${0.55 - i * 0.12}" stroke-width="18" fill="none"/>`).join("")}
  <svg x="190" y="170" width="520" height="433" viewBox="0 0 120 100">${markInner("o")}</svg>
  <text x="820" y="380" font-family="${FONT}" font-weight="800" font-size="190" fill="#1F2937">みらい議会</text>
  <text x="830" y="600" font-family="${FONT}" font-weight="800" font-size="150" fill="#1F6FB2">＠桑名市</text>
  <text x="200" y="820" font-family="${FONT}" font-weight="700" font-size="84" fill="#1F2937">桑名市議会の議論を、できるだけわかりやすく</text>
  <text x="200" y="960" font-family="${FONT}" font-weight="500" font-size="44" fill="#4B5563">※ これは政党チームみらいが運営しているものではありません</text>
</svg>`;
}

function archiveHero() {
  const W = 2440, H = 1760;
  const waves = Array.from({ length: 9 }, (_, i) => {
    const y = 700 + i * 120;
    return `<path d="M-100 ${y} C400 ${y - 90} 800 ${y + 90} 1220 ${y} S2040 ${y - 90} 2540 ${y}" stroke="#fff" stroke-opacity="${0.35 - i * 0.03}" stroke-width="26" fill="none"/>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop stop-color="#D4ECFA"/><stop offset=".55" stop-color="#7CC4EE"/><stop offset="1" stop-color="#1F6FB2"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>${waves}
  <svg x="${W / 2 - 330}" y="180" width="660" height="550" viewBox="0 0 120 100" opacity=".9">${markInner("h")}</svg>
</svg>`;
}

(async () => {
  await png(markSvg(378, 315).replace('width="378" height="315"', 'width="378" height="321"'), `${OUT}/img/ogp-logo.png`, 378, 321);
  await sharp(Buffer.from(ogp())).jpeg({ quality: 88, progressive: true }).toFile(`${OUT}/ogp.jpg`);
  await sharp(Buffer.from(archiveHero())).jpeg({ quality: 85 }).toFile(`${OUT}/img/archive-hero-kuwana.jpg`);
  const P = `${OUT}/icons/pwa`;
  await png(icon(192), `${P}/icon_android_192.png`, 192, 192);
  await png(icon(512), `${P}/icon_android_512.png`, 512, 512);
  await png(icon(180), `${P}/icon_ios.png`, 180, 180);
  await png(icon(192, "DEV"), `${P}/icon_dev_192_v3.png`, 192, 192);
  await png(icon(192, "STG"), `${P}/icon_staging_192.png`, 192, 192);
  await png(icon(180, "STG"), `${P}/icon_staging_ios.png`, 180, 180);
  console.log("done");
})();

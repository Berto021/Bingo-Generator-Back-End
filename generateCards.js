import { createCanvas, registerFont } from "canvas";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const babyWords = [
  "Abraço",
  "Amor",
  "Babador",
  "Banheira",
  "Berço",
  "Bico",
  "Bochecha",
  "Body",
  "Bocejo",
  "Brinquedo",
  "Caminhar",
  "Carrinho",
  "Cobertor",
  "Colo",
  "Conchinha",
  "Denguinho",
  "Dentinho",
  "Docinho",
  "Escovinha",
  "Família",
  "Fraldinha",
  "Fralda",
  "Fofinho",
  "Gatinho",
  "Gorro",
  "Lencinho",
  "Luzinha",
  "Macacão",
  "Mamadeira",
  "Mamãe",
  "Mãozinha",
  "Meinha",
  "Mijão",
  "Naninha",
  "Nana",
  "Olhinho",
  "Paciência",
  "Papai",
  "Patinho",
  "Pezinho",
  "Pijama",
  "Pomadinha",
  "Recém-nascido",
  "Risadinha",
  "Ronquinho",
  "Soneca",
  "Soninho",
  "Sorrisinho",
  "Tapetinho",
  "Toalhinha",
];

registerFont(path.join(__dirname, "fonts", "Poppins-SemiBold.ttf"), {
  family: "Poppins",
});

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

const lines = 4;
const columns = 3;

const width = 600;
const height = 800;
const margin = 40;

const cellWidth = (width - margin * 2) / columns;
const cellHeight = (height - margin * 2 - 100) / lines;

function drawBackground(ctx, width, height) {
  ctx.fillStyle = "#FFFDF9";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(244, 167, 185, 0.2)";
  for (let i = 0; i < width; i += 50) {
    for (let j = 0; j < height; j += 50) {
      ctx.beginPath();
      ctx.arc(i, j, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function generateImage(words, index, title) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  drawBackground(ctx, width, height);

  ctx.fillStyle = "#F4A7B9";
  ctx.font = "bold 48px Poppins";
  ctx.textAlign = "center";
  ctx.fillText(title, width / 2, 60);

  ctx.fillRect(width / 2 - 150, 75, 300, 5);

  ctx.font = "22px Poppins";
  ctx.fillStyle = "#7D5A5A";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.lineWidth = 2;

  words.forEach((word, i) => {
    const row = Math.floor(i / columns);
    const col = i % columns;

    const cellX = margin + col * cellWidth;
    const cellY = 100 + row * cellHeight;

    const centerX = cellX + cellWidth / 2;
    const centerY = cellY + cellHeight / 2;

    ctx.fillStyle = row % 2 === 0 ? "#FFE8F0" : "#FFFDF9";

    ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    ctx.fillRect(cellX, cellY, cellWidth, cellHeight);

    ctx.strokeStyle = "#D0C3E6";
    ctx.strokeRect(cellX, cellY, cellWidth, cellHeight);

    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    ctx.fillStyle = "#7D5A5A";
    ctx.fillText(word, centerX, centerY);
  });

  const dir = path.join(__dirname, "cartelas");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  const buffer = canvas.toBuffer("image/jpeg");
  fs.writeFileSync(path.join(dir, `cartela_${index + 1}.jpeg`), buffer);
}

export function makeGames(quantity, title) {
  const games = new Set();

  while (games.size < quantity) {
    const shuffles = shuffle(babyWords);
    const game = shuffles.slice(0, 12).sort();
    const gameKey = game.join(",");

    if (!games.has(gameKey)) {
      games.add(gameKey);
      generateImage(game, games.size - 1, title);
    }
  }
}

import { createCanvas, registerFont, loadImage } from "canvas";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const babyWords = [
  "Abraço",
  "Amor",
  "Bebê",
  "Babador",
  "Banheira",
  "Berço",
  "Bico",
  "Bochecha",
  "Body",
  "Bocejo",
  "Brinquedo",
  "Banho",
  "Andar",
  "Carrinho",
  "Cobertor",
  "Colo",
  "Cueiro",
  "Chupeta",
  "Dentinho",
  "Docinho",
  "Escova",
  "Família",
  "Fraldinha",
  "Fralda",
  "Fome",
  "Engatinhar",
  "Toquinha",
  "Lencinho",
  "Macacão",
  "Mamadeira",
  "Mamãe",
  "Mãozinha",
  "Maternidade",
  "Meinha",
  "Mijão",
  "Mobile",
  "Mosqueteiro",
  "Naninha",
  "Neném",
  "Olhinho",
  "Papai",
  "Pezinho",
  "Pijama",
  "Pomada",
  "Risada",
  "Ronquinho",
  "Trocador",
  "Cochilo",
  "Sono",
  "Sorriso",
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

async function generateImage(words, index, title) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  drawBackground(ctx, width, height);

  const leftImage = await loadImage(
    path.join(__dirname, "assets", "image-left.png")
  );

  const rightImage = await loadImage(
    path.join(__dirname, "assets", "image-right.png")
  );

  ctx.fillStyle = "#F4A7B9";
  ctx.font = "bold 48px Poppins";
  ctx.textAlign = "center";
  ctx.fillText(title, width / 2, 60);

  ctx.fillRect(width / 2 - 150, 75, 300, 5);

  const titleWidth = ctx.measureText(title).width;
  const imageSize = 80;
  const spacing = 15;
  const imageY = 60 - imageSize / 2;

  ctx.drawImage(
    leftImage,
    width / 2 - titleWidth / 2 - imageSize - spacing,
    imageY,
    imageSize,
    imageSize
  );

  ctx.drawImage(
    rightImage,
    width / 2 + titleWidth / 2 + spacing,
    imageY,
    imageSize,
    imageSize
  );

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

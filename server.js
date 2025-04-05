import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import archiver from "archiver";

import { makeGames } from "./generateCards.js";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, "cartelas");

app.post("/generate", async (req, res) => {
  const { quantity, title } = req.body;

  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true });
  }
  fs.mkdirSync(outputDir);

  makeGames(Number(quantity), title || "");

  const zipName = "cartelas.zip";
  const zipPath = path.join(__dirname, zipName);

  const output = fs.createWriteStream(zipPath);
  const archive = archiver("zip", { zlib: { level: 9 } });

  output.on("close", () => {
    res.download(zipPath, () => {
      fs.unlinkSync(zipPath);
    });
  });

  archive.on("error", (err) => res.status(500).send({ error: err.message }));

  archive.pipe(output);
  archive.directory(outputDir, false);
  archive.finalize();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

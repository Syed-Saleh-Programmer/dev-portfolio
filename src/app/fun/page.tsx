import fs from "fs";
import path from "path";
import { FunClientView, HobbyEntry, AlbumPhoto } from "./FunClientView";

function loadHobbies(): HobbyEntry[] {
  const funDir = path.join(process.cwd(), "content", "fun");
  if (!fs.existsSync(funDir)) return [];

  const files = fs.readdirSync(funDir);
  const items: HobbyEntry[] = [];

  for (const file of files) {
    if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue;
    const content = fs.readFileSync(path.join(funDir, file), "utf-8");
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (match) {
      const rawYaml = match[1];
      const body = match[2].trim();
      const title = rawYaml.match(/title:\s*(.*)/)?.[1]?.trim() || "Untitled Hobby";
      const category = rawYaml.match(/category:\s*(.*)/)?.[1]?.trim() || "Extracurricular";
      const date = rawYaml.match(/date:\s*(.*)/)?.[1]?.trim();
      const location = rawYaml.match(/location:\s*(.*)/)?.[1]?.trim();
      const tagline = rawYaml.match(/tagline:\s*(.*)/)?.[1]?.trim();

      const stamp = category.includes("Photo")
        ? "35MM • ANALOG GRAIN"
        : category.includes("Hardware")
        ? "QMK • RP2040 SOLDER"
        : "48H • PRODUCTION MVP";

      // Parse photos
      const photos: AlbumPhoto[] = [];
      const lines = rawYaml.split(/\r?\n/);
      let inPhotos = false;
      let currentPhoto: any = null;

      for (const line of lines) {
        if (line.startsWith("photos:")) {
          inPhotos = true;
          continue;
        }
        if (inPhotos) {
          const imgMatch = line.match(/^\s*-\s*image:\s*(.*)$/);
          if (imgMatch) {
            currentPhoto = { image: imgMatch[1].trim() };
            photos.push(currentPhoto);
            continue;
          }
          const capMatch = line.match(/^\s*caption:\s*(.*)$/);
          if (capMatch && currentPhoto) {
            currentPhoto.caption = capMatch[1].trim();
            continue;
          }
          const rotMatch = line.match(/^\s*rotation:\s*["']?(.*?)["']?$/);
          if (rotMatch && currentPhoto) {
            currentPhoto.rotation = rotMatch[1].trim();
            continue;
          }
          if (!line.startsWith("  ") && line.trim() !== "") {
            inPhotos = false;
          }
        }
      }

      items.push({
        slug: file.replace(/\.(md|mdx)$/, ""),
        title,
        category,
        date,
        location,
        tagline,
        stamp,
        photos,
        body,
      });
    }
  }

  return items;
}

export default function FunPage() {
  const hobbies = loadHobbies();

  return <FunClientView hobbies={hobbies} />;
}

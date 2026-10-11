import fs from "fs";
import path from "path";
import { AboutClientView, ProfileData, ExperienceItem } from "./AboutClientView";

function loadAboutData(): { profile: ProfileData; experiences: ExperienceItem[] } {
  let profile: ProfileData = {
    name: "Syed Muhammad Saleh",
    title: "Software Engineer & Product Architect",
    aboutParagraphs: [
      "I am an engineer and builder obsessed with software craftsmanship. I operate at the intersection of robust backend infrastructure, thoughtful human-computer interaction, and modern generative intelligence.",
      "Currently leading technical systems architecture, I focus on building products that solve real friction, obsess over sub-second latency, and write software that feels tactile and alive.",
      "My engineering philosophy emphasizes clean distributed boundaries, predictable performance under spike loads, and intuitive UX."
    ],
    certifications: []
  };

  try {
    const profilePath = path.join(process.cwd(), "content", "profile", "main.json");
    if (fs.existsSync(profilePath)) {
      profile = JSON.parse(fs.readFileSync(profilePath, "utf-8"));
    }
  } catch (e) {}

  const expDir = path.join(process.cwd(), "content", "experience");
  const experiences: ExperienceItem[] = [];

  if (fs.existsSync(expDir)) {
    const files = fs.readdirSync(expDir);
    for (const file of files) {
      if (!file.endsWith(".md") && !file.endsWith(".mdx")) continue;
      const content = fs.readFileSync(path.join(expDir, file), "utf-8");
      const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
      if (match) {
        const rawYaml = match[1];
        const body = match[2].trim();
        const role = rawYaml.match(/role:\s*(.*)/)?.[1]?.trim() || "Engineer";
        const company = rawYaml.match(/company:\s*(.*)/)?.[1]?.trim() || "Company";
        const duration = rawYaml.match(/duration:\s*(.*)/)?.[1]?.trim() || "Present";
        const location = rawYaml.match(/location:\s*(.*)/)?.[1]?.trim() || "Remote";
        experiences.push({
          slug: file.replace(/\.(md|mdx)$/, ""),
          role,
          company,
          duration,
          location,
          description: body,
        });
      }
    }
  }

  return { profile, experiences };
}

export default function AboutPage() {
  const { profile, experiences } = loadAboutData();

  return <AboutClientView profile={profile} experiences={experiences} />;
}

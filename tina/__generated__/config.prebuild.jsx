// tina/config.ts
import { defineConfig } from "tinacms";
var branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.HEAD || "main";
var config_default = defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      mediaRoot: "uploads",
      publicFolder: "public"
    }
  },
  schema: {
    collections: [
      {
        name: "work",
        label: "Works & Case Studies",
        path: "content/works",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "summary",
            label: "Summary",
            required: true,
            ui: {
              component: "textarea"
            }
          },
          {
            type: "image",
            name: "previewImage",
            label: "Preview / Cover Image"
          },
          {
            type: "string",
            name: "liveLink",
            label: "Live Preview URL (Optional)"
          },
          {
            type: "string",
            name: "githubLink",
            label: "GitHub Source URL (Optional)"
          },
          {
            type: "string",
            name: "year",
            label: "Year / Timeline"
          },
          {
            type: "string",
            name: "role",
            label: "My Role (e.g. Lead Engineer, Founder)"
          },
          {
            type: "string",
            name: "techStack",
            label: "Tech Stack Tags",
            list: true
          },
          {
            type: "object",
            name: "gallery",
            label: "Product Images Gallery",
            list: true,
            fields: [
              {
                type: "image",
                name: "image",
                label: "Product Screenshot / Asset"
              },
              {
                type: "string",
                name: "caption",
                label: "Image Caption"
              }
            ]
          },
          {
            type: "rich-text",
            name: "body",
            label: "Case Study Content",
            isBody: true
          }
        ]
      },
      {
        name: "experience",
        label: "Experience & Roles",
        path: "content/experience",
        format: "md",
        fields: [
          {
            type: "string",
            name: "role",
            label: "Role",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "company",
            label: "Company",
            required: true
          },
          {
            type: "string",
            name: "duration",
            label: "Duration",
            required: true
          },
          {
            type: "string",
            name: "location",
            label: "Location / Remote"
          },
          {
            type: "rich-text",
            name: "description",
            label: "Role Description & Achievements",
            isBody: true
          }
        ]
      },
      {
        name: "hobby",
        label: "Fun & Hobbies",
        path: "content/fun",
        format: "md",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Activity / Hobby Title",
            isTitle: true,
            required: true
          },
          {
            type: "string",
            name: "category",
            label: "Category (e.g. Photography, Tinkering, Outdoor, Music)",
            required: true
          },
          {
            type: "string",
            name: "date",
            label: "Date or Era (e.g. 2024 - Present)"
          },
          {
            type: "string",
            name: "location",
            label: "Location (e.g. Tokyo, Studio, Trails)"
          },
          {
            type: "string",
            name: "tagline",
            label: "Editorial Subtitle"
          },
          {
            type: "object",
            name: "photos",
            label: "Album Photos",
            list: true,
            fields: [
              {
                type: "image",
                name: "image",
                label: "Photo"
              },
              {
                type: "string",
                name: "caption",
                label: "Handwritten Caption / Story"
              },
              {
                type: "string",
                name: "rotation",
                label: "Rotation Angle (e.g. -2, 3, -1)"
              }
            ]
          },
          {
            type: "rich-text",
            name: "body",
            label: "Story & Musings",
            isBody: true
          }
        ]
      },
      {
        name: "profile",
        label: "About & Profile",
        path: "content/profile",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        },
        fields: [
          {
            type: "string",
            name: "name",
            label: "Name",
            required: true
          },
          {
            type: "string",
            name: "title",
            label: "Job Title / Headline"
          },
          {
            type: "string",
            name: "shortBio",
            label: "Short Bio (Main Bento)",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "string",
            name: "aboutParagraphs",
            label: "About Me Story Paragraphs",
            list: true,
            ui: {
              component: "textarea"
            }
          },
          {
            type: "string",
            name: "resumeLink",
            label: "Resume / CV Link"
          },
          {
            type: "object",
            name: "certifications",
            label: "Certifications & Credentials",
            list: true,
            fields: [
              {
                type: "string",
                name: "name",
                label: "Certification Title",
                required: true
              },
              {
                type: "string",
                name: "issuer",
                label: "Issuing Organization",
                required: true
              },
              {
                type: "string",
                name: "date",
                label: "Date Issued"
              },
              {
                type: "image",
                name: "image",
                label: "Certification Badge / Certificate Image"
              },
              {
                type: "string",
                name: "credentialUrl",
                label: "Verification / Credential URL"
              },
              {
                type: "string",
                name: "skills",
                label: "Associated Skills",
                list: true
              }
            ]
          },
          {
            type: "string",
            name: "aiBuddyPrompt",
            label: "AI Buddy Personality & Context",
            description: "How your AI buddy should introduce and advocate for you.",
            ui: {
              component: "textarea"
            }
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};

import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vibe Talk - English Practice",
    short_name: "Vibe Talk",
    description:
      "ฝึกสนทนาภาษาอังกฤษกับ AI Agent แบบมี context หลากหลายสถานการณ์",
    start_url: "/",
    display: "standalone",
    background_color: "#F3EBE1",
    theme_color: "#D4A574",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/vibe-talk-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/vibe-talk-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

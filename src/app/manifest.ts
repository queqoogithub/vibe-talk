import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vibe Talk - English Practice",
    short_name: "Vibe Talk",
    description:
      "ฝึกสนทนาภาษาอังกฤษกับ AI Agent แบบมี context หลากหลายสถานการณ์",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F0FF",
    theme_color: "#B388FF",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/vb-logo-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/vb-logo-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

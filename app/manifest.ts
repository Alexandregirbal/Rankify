import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Rankify, Waapi's pool ranking app",
    short_name: "Rankify",
    description: "Ranking app of the Waapi pool community",
    start_url: "/",
    display: "minimal-ui",
    theme_color: "#00CDB8",
    background_color: "#ffffff",
    icons: [
      {
        src: "/logo-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/logo-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/maskable-icon.png",
        sizes: "any",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PRD §6: a short shareable link that survives replacing the file.
  redirects() {
    return Promise.resolve([
      {
        source: "/resume",
        destination: "/resume/noah-zhong-resume.pdf",
        permanent: true,
      },
    ]);
  },
};

export default nextConfig;

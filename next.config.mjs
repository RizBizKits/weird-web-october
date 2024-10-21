/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
        port: "",
        pathname:
          "/%E2%80%94Pngtree%E2%80%94grey%20dolphin%20flat%20design_6504885-LRMDl7vgYs1jPpciHrE5oNJCNtJGEE.png",
      },
      {
        protocol: "https",
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
        port: "",
        pathname: "/***",
      },
    ],
  },
};

export default nextConfig;

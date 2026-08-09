import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // The site is fully static. Cloudflare Pages can publish `out/` directly,
  // without the deprecated next-on-pages adapter or a Workers runtime.
  output: 'export',
  // outputFileTracingRoot: path.resolve(__dirname, '../../'),  // Uncomment and add 'import path from "path"' if needed
  /* config options here */
  allowedDevOrigins: ['*.dev.coze.site'],
  images: {
    // Required by static export; the project currently uses plain <img> tags,
    // so no Cloudflare image-loader behavior changes.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from 'next'

export default {
  images: {
    unoptimized: true,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },

  async redirects() {
    return []
  },

  env: {
    SC_DISABLE_SPEEDY: 'false',
  },
} satisfies NextConfig
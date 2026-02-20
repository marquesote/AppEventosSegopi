import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'miymyomckhazcrdvgfqa.supabase.co',
      },
    ],
  },
}

export default nextConfig

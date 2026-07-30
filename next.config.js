/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Keep puppeteer as a server-only external package (not bundled)
    serverComponentsExternalPackages: ['puppeteer'],
  },
  images: {
    domains: ['maps.googleapis.com', 'lh3.googleusercontent.com'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevent puppeteer from being bundled into the client
      config.resolve.alias['puppeteer'] = false
    }
    return config
  },
}

module.exports = nextConfig

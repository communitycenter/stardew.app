/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  ...nextConfig,
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
  images: {
    domains: [
      "stardewvalleywiki.com",
      "cdn.discordapp.com",
      "stardewcommunitywiki.com",
    ],
  },
};

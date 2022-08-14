/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  ...nextConfig,
  images: {
    domains: [
      "stardewvalleywiki.com",
      "cdn.discordapp.com",
      "stardewcommunitywiki.com",
    ],
  },
};

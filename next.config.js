/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  redirects: async () => {
    return [
      {
        source: "/discord",
        destination: "https://discord.gg/9K3TgZaPkT",
        permanent: true,
      },
      {
        source: "/github",
        destination: "https://github.com/stardewapp/stardew.app",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

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
				destination: "https://github.com/communitycenter/stardew.app",
				permanent: true,
			},
			{
				source: "/social",
				destination: "/relationships",
				permanent: true,
			},
			{
				source: "/artifacts",
				destination: "/museum",
				permanent: true,
			},
		];
	},
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "stardewvalleywiki.com",
				port: "",
				pathname: "/mediawiki/images/**",
			},
		],
	},
};

module.exports = nextConfig;

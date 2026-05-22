if (
	process.env.NODE_ENV === "development" &&
	process.env.STARDEW_APP_LOCAL_ONLY !== "1"
) {
	const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
	initOpenNextCloudflareForDev();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	output: "standalone",
	typescript: { ignoreBuildErrors: true },
	eslint: { ignoreDuringBuilds: true },
	rewrites: async () => {
		return [
			{
				source: "/api",
				destination: "/api/me",
			},
		];
	},
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

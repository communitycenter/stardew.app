import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const config = [
	{
		ignores: [
			".next/**",
			".open-next/**",
			".wrangler/**",
			"node_modules/**",
			"cloudflare-env.d.ts",
		],
	},
	...nextCoreWebVitals,
	...nextTypescript,
	{
		rules: {
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{
					prefer: "type-imports",
					fixStyle: "inline-type-imports",
				},
			],
			"@typescript-eslint/no-explicit-any": 0,
			"@typescript-eslint/no-require-imports": 0,
			"@typescript-eslint/no-empty-interface": 0,
		},
	},
];

export default config;

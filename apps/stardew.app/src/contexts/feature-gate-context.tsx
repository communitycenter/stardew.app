import { useRouter } from "next/router";
import { createContext, ReactNode, useCallback, useContext } from "react";

interface FeatureGateContextType {
	isFeatureEnabled: (feature: keyof typeof FEATURE_GATES) => boolean;
}

const FeatureGateContext = createContext<FeatureGateContextType | undefined>(
	undefined,
);

const FEATURE_GATES = {
	"cooking-ingredients": {
		enabled: false,
		queryParam: "cooking-ingredients",
		description: "Show the ingredients needed to cook all shown recipes",
	},
	"crafting-ingredients": {
		enabled: false,
		queryParam: "crafting-ingredients",
		description: "Show the ingredients needed to craft all shown recipes",
	},
};

export function FeatureGateProvider({ children }: { children: ReactNode }) {
	const { query } = useRouter();

	const isFeatureEnabled = useCallback(
		(feature: keyof typeof FEATURE_GATES) => {
			if (query[FEATURE_GATES[feature].queryParam] === "1") {
				return true;
			}

			if (query[FEATURE_GATES[feature].queryParam] === "0") {
				return false;
			}

			return FEATURE_GATES[feature].enabled;
		},
		[query],
	);

	return (
		<FeatureGateContext.Provider
			value={{
				isFeatureEnabled,
			}}
		>
			{children}
		</FeatureGateContext.Provider>
	);
}

export function useFeatureGate() {
	const context = useContext(FeatureGateContext);
	if (context === undefined) {
		throw new Error("useFeatureGate must be used within a FeatureGateContext");
	}
	return context;
}

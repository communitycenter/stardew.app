import { createContext, useContext, useEffect, useState } from "react";

interface Preferences {
	showBetaFeatures: boolean;
	toggleBetaFeatures: () => boolean;
}

const PreferencesContext = createContext<Preferences>({
	showBetaFeatures: false,
	toggleBetaFeatures: () => false,
});

export const PreferencesProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [showBetaFeatures, setShowBetaFeatures] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const storedBeta = window.localStorage.getItem("show_beta_features");
			if (storedBeta) setShowBetaFeatures(JSON.parse(storedBeta));
		}
	}, []);

	const toggleBetaFeatures = (): boolean => {
		const updated = !showBetaFeatures;
		setShowBetaFeatures(updated);
		if (typeof window !== "undefined") {
			window.localStorage.setItem(
				"show_beta_features",
				JSON.stringify(updated),
			);
		}
		return updated;
	};

	return (
		<PreferencesContext.Provider
			value={{ showBetaFeatures, toggleBetaFeatures }}
		>
			{children}
		</PreferencesContext.Provider>
	);
};

export const usePreferences = () => {
	return useContext(PreferencesContext);
};

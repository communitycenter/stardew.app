import { createContext, useContext, useEffect, useState } from "react";

interface Preferences {
	show: boolean;
	toggleShow: () => boolean;
	showBetaFeatures: boolean;
	toggleBetaFeatures: () => boolean;
}

const PreferencesContext = createContext<Preferences>({
	show: false,
	toggleShow: () => false,
	showBetaFeatures: false,
	toggleBetaFeatures: () => false,
});

export const PreferencesProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [show, setShow] = useState(false);
	const [showBetaFeatures, setShowBetaFeatures] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const stored = window.localStorage.getItem("show_new_content");
			const storedBeta = window.localStorage.getItem("show_beta_features");

			if (stored) setShow(JSON.parse(stored));
			if (storedBeta) setShowBetaFeatures(JSON.parse(storedBeta));
		}
	}, []);

	const toggleShow = (): boolean => {
		const updated = !show;
		setShow(updated);
		if (typeof window !== "undefined") {
			window.localStorage.setItem("show_new_content", JSON.stringify(updated));
		}
		return updated;
	};

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
			value={{ show, toggleShow, showBetaFeatures, toggleBetaFeatures }}
		>
			{children}
		</PreferencesContext.Provider>
	);
};

export const usePreferences = () => {
	return useContext(PreferencesContext);
};

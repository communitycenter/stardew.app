import { useState, useEffect, useContext, createContext } from "react";

interface Preferences {
  show: boolean;
  toggleShow: () => boolean;
}

const PreferencesContext = createContext<Preferences>({
  show: false,
  toggleShow: () => false,
});

export const PreferencesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("show_new_content");

      if (stored) setShow(JSON.parse(stored));
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

  return (
    <PreferencesContext.Provider value={{ show, toggleShow }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  return useContext(PreferencesContext);
};

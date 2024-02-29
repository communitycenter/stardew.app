import React, { useState, useEffect, useContext, createContext } from "react";

function getInitialState() {
  const pref = localStorage.getItem("show_new_content");
  return pref === "true";
}

interface Preferences {
  show: boolean;
  setShow: (show: boolean) => void;
}

const PreferencesContext = createContext<Preferences>({
  show: false,
  setShow: () => {},
});

export const PreferencesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [show, setShow] = useState(getInitialState);

  useEffect(() => {
    localStorage.setItem("show_new_content", show.toString());
  }, [show]);

  return (
    <PreferencesContext.Provider value={{ show, setShow }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => useContext(PreferencesContext);

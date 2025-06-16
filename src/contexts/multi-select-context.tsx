import { createContext, useContext, useState, ReactNode } from "react";

interface MultiSelectContextType {
  isMultiSelectMode: boolean;
  toggleMultiSelectMode: () => void;
  selectedItems: Set<string>;
  toggleItem: (id: string) => void;
  clearSelection: () => void;
  addItems: (ids: string[]) => void;
  removeItems: (ids: string[]) => void;
}

const MultiSelectContext = createContext<MultiSelectContextType | undefined>(
  undefined,
);

export function MultiSelectProvider({ children }: { children: ReactNode }) {
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const toggleMultiSelectMode = () => {
    setIsMultiSelectMode(!isMultiSelectMode);
    if (isMultiSelectMode) {
      clearSelection();
    }
  };

  const toggleItem = (id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
  };

  const addItems = (ids: string[]) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      ids.forEach((id) => newSet.add(id));
      return newSet;
    });
  };

  const removeItems = (ids: string[]) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      ids.forEach((id) => newSet.delete(id));
      return newSet;
    });
  };

  return (
    <MultiSelectContext.Provider
      value={{
        isMultiSelectMode,
        toggleMultiSelectMode,
        selectedItems,
        toggleItem,
        clearSelection,
        addItems,
        removeItems,
      }}
    >
      {children}
    </MultiSelectContext.Provider>
  );
}

export function useMultiSelect() {
  const context = useContext(MultiSelectContext);
  if (context === undefined) {
    throw new Error("useMultiSelect must be used within a MultiSelectProvider");
  }
  return context;
}

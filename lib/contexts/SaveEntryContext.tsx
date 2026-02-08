import { createContext, useCallback, useContext, useRef } from "react";

type SaveContextType = {
  onSave: () => void;
  setOnSave: (fn: () => void) => void;
};

const SaveEntryContext = createContext<SaveContextType | null>(null);

export const useSaveEntry = () => {
  const ctx = useContext(SaveEntryContext);
  if (!ctx) throw new Error("UseSaveEntry must be used inside SaveProvider");
  return ctx;
};

export const SaveEntryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const onSaveRef = useRef<() => void>(() => {});
  const setOnSave = useCallback((fn: () => void) => {
    onSaveRef.current = fn;
  }, []);
  const onSave = useCallback(() => onSaveRef.current(), []);

  return (
    <SaveEntryContext.Provider value={{ onSave, setOnSave }}>
      {children}
    </SaveEntryContext.Provider>
  );
};

import { createContext, useCallback, useContext, useRef } from "react";


export type SaveModalData = {
  title: string;
  focusArea: string;
};

type SaveContextType = {
  onSave: (data: SaveModalData) => void;
  setOnSave: (fn: (data: SaveModalData) => void) => void;
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
  const onSaveRef = useRef<(data: SaveModalData) => void>(() => {});

  const setOnSave = useCallback((fn: (data: SaveModalData) => void) => {
    onSaveRef.current = fn;
  }, []);

  const onSave = useCallback((data: SaveModalData) => {
    onSaveRef.current(data);
  }, []);

  return (
    <SaveEntryContext.Provider value={{ onSave, setOnSave }}>
      {children}
    </SaveEntryContext.Provider>
  );
};

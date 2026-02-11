import { createContext, useCallback, useContext, useRef } from "react";

export type SaveModalData = {
  title: string;
  focusArea: string;
};

export type SaveResult = { success: boolean; error?: string };

type SaveContextType = {
  onSave: (data: SaveModalData) => Promise<SaveResult | void>;
  setOnSave: (fn: (data: SaveModalData) => void | Promise<SaveResult | void>) => void;
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
  const onSaveRef = useRef<
    (data: SaveModalData) => void | Promise<SaveResult | void>
  >(() => {});

  const setOnSave = useCallback(
    (fn: (data: SaveModalData) => void | Promise<SaveResult | void>) => {
      onSaveRef.current = fn;
    },
    [],
  );

  const onSave = useCallback(async (data: SaveModalData) => {
    return await onSaveRef.current(data);
  }, []);

  return (
    <SaveEntryContext.Provider value={{ onSave, setOnSave }}>
      {children}
    </SaveEntryContext.Provider>
  );
};

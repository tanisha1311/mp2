import React, { createContext, useContext, useMemo, useState } from "react";

type Ctx = {
  ids: number[];
  setFromList: (ids: number[]) => void;
  currentIndex: number | null;
  setCurrentById: (id: number) => void;
  getPrevId: () => number | null;
  getNextId: () => number | null;
};

const ResultsContext = createContext<Ctx | null>(null);

export const ResultsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ids, setIds] = useState<number[]>([]);
  const [currentIndex, setIdx] = useState<number | null>(null);

  const value = useMemo<Ctx>(() => ({
    ids,
    setFromList: (arr) => {
      setIds(arr);
      setIdx(null);
    },
    currentIndex,
    setCurrentById: (id) => {
      const idx = ids.indexOf(id);
      setIdx(idx >= 0 ? idx : null);
    },
    getPrevId: () => {
      if (currentIndex === null || ids.length === 0) return null;
      const idx = (currentIndex - 1 + ids.length) % ids.length;
      return ids[idx];
    },
    getNextId: () => {
      if (currentIndex === null || ids.length === 0) return null;
      const idx = (currentIndex + 1) % ids.length;
      return ids[idx];
    },
  }), [ids, currentIndex]);

  return <ResultsContext.Provider value={value}>{children}</ResultsContext.Provider>;
};

export function useResults() {
  const ctx = useContext(ResultsContext);
  if (!ctx) throw new Error("useResults must be used within ResultsProvider");
  return ctx;
}

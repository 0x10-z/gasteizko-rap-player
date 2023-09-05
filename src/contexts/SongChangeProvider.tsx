import React, { createContext, useContext } from "react";

type SongChangeContextType = {
  changeSong: (direction: "forward" | "backward") => Promise<void>;
};

const SongChangeContext = createContext<SongChangeContextType | undefined>(
  undefined
);

export const useSongChange = () => {
  const context = useContext(SongChangeContext);
  if (!context) {
    throw new Error("useSongChange must be used within a SongChangeProvider");
  }
  return context;
};

type SongChangeProviderProps = {
  changeSong: (direction: "forward" | "backward") => Promise<void>;
  children: React.ReactNode; // Añade esta línea
};

export const SongChangeProvider: React.FC<SongChangeProviderProps> = ({
  changeSong,
  children,
}) => {
  return (
    <SongChangeContext.Provider value={{ changeSong }}>
      {children}
    </SongChangeContext.Provider>
  );
};

import React, { createContext, useState, useContext } from "react";

const searchBarContext = createContext();
export const SearchBarProvider = ({ children }) => {
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);

  const openSearchBar = () => {
    setIsOffCanvasOpen(true);
  };
  const closeSearchBar = () => setIsOffCanvasOpen(false);
  return (
    <searchBarContext.Provider
      value={{ isOffCanvasOpen, openSearchBar, closeSearchBar }}
    >
      {children}
    </searchBarContext.Provider>
  );
};
export const useSearchBar = () => useContext(searchBarContext);

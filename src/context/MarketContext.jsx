import { createContext, useContext, useState } from 'react';

const MarketContext = createContext();

export function MarketProvider({ children }) {
  const [activeOutpost, setActiveOutpost] = useState(null);

  return (
    <MarketContext.Provider value={{ activeOutpost, setActiveOutpost }}>
      {children}
    </MarketContext.Provider>
  );
}

export function useMarket() {
  return useContext(MarketContext);
}

import { usePrevious } from '@mantine/hooks';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';

type CurrentTcg = {
  tcg: Tcg;
  setTcg: (tcg: Tcg) => void;
};
export const TcgContext = createContext<CurrentTcg | null>(null);

export default function TcgProvider({ children }: { children: ReactNode }) {
  const tcgByLocation = useTcgByLocation();
  const previousTcgByLocation = usePrevious(tcgByLocation);

  const [tcg, setTcg] = useState<Tcg>(tcgByLocation ?? 'dlc'); // later mtg or the last used tcg

  const [currentTcg, setCurrentTcg] = useState<CurrentTcg>({
    tcg: tcg, // later mtg or the last used tcg
    setTcg: (tcg) => {
      setTcg(tcg);
      setCurrentTcg({ ...currentTcg, tcg });
    },
  });

  useEffect(() => {
    if (tcgByLocation !== undefined && previousTcgByLocation !== tcgByLocation) {
      setCurrentTcg((prev) => ({
        ...prev,
        tcg: tcgByLocation,
      }));
      return;
    }
  }, [tcgByLocation, previousTcgByLocation]);

  return <TcgContext.Provider value={currentTcg}>{children}</TcgContext.Provider>;
}

export function useTcg() {
  const context = useContext(TcgContext);
  if (!context) throw new Error('useTcg must be used within <TcgProvider>');

  return context;
}

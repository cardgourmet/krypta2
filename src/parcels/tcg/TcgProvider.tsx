import {useLocalStorage, usePrevious} from '@mantine/hooks';
import {createContext, type ReactNode, useContext, useEffect, useState} from 'react';
import {type Tcg, useTcgByLocation} from '@/parcels/tcg/useTcgByLocation.ts';

export const CGM_LAST_TCG = 'cgm-last-tcg';

type CurrentTcg = {
  tcg: Tcg;
  setTcg: (tcg: Tcg) => void;
};
export const TcgContext = createContext<CurrentTcg | null>(null);

export default function TcgProvider({ children }: { children: ReactNode }) {
  const [tcgInStorage, setTcgInStorage] = useLocalStorage<Tcg | null>({
    key: CGM_LAST_TCG,
    getInitialValueInEffect: true,
  });
  const tcgByLocation = useTcgByLocation();
  const previousTcgByLocation = usePrevious(tcgByLocation);

  // mtg is default if you first enter the homepage.
  const [tcg, setTcg] = useState<Tcg>('mtg');

  const [currentTcg, setCurrentTcg] = useState<CurrentTcg>({
    tcg: tcg,
    setTcg: (tcg) => {
      setTcg(tcg);
      setCurrentTcg({ ...currentTcg, tcg });
      setTcgInStorage(tcg);
    },
  });

  // as soon as data from storage is ready, update current tcg.
  useEffect(() => {
    if (tcgInStorage !== null) {
      setCurrentTcg((prev) => ({
        ...prev,
        tcg: tcgInStorage,
      }));
    }
  }, [tcgInStorage]);

  // as soon as location changes, check if we're in tcg context
  useEffect(() => {
    if (tcgByLocation !== undefined && previousTcgByLocation !== tcgByLocation) {
      setCurrentTcg((prev) => ({
        ...prev,
        tcg: tcgByLocation,
      }));
    }
  }, [tcgByLocation, previousTcgByLocation]);

  return <TcgContext.Provider value={currentTcg}>{children}</TcgContext.Provider>;
}

export function useTcg() {
  const context = useContext(TcgContext);
  if (!context) throw new Error('useTcg must be used within <TcgProvider>');

  return context;
}

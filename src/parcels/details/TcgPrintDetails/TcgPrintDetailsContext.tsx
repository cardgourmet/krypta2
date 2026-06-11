import { createContext, useContext } from 'react';

export type TcgPrintDetailsContextType = { lang: string };

export const TcgPrintDetailsContext = createContext<TcgPrintDetailsContextType>({ lang: 'en' });

export function usePrintDetailsContext(): TcgPrintDetailsContextType {
  return useContext(TcgPrintDetailsContext) as TcgPrintDetailsContextType;
}

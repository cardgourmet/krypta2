import { useContext } from 'react';
import { TcgOverviewWorkContext } from '@/parcels/selection/TcgOverviewWorkContext/TcgOverviewWorkContext.tsx';

export const useTcgOverviewWorkContext = () => useContext(TcgOverviewWorkContext);

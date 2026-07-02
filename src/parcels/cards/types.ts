import type { DlcDataCard, DlcDataPrint } from '../tcg/dlc/api';
import type { MtgDataCard, MtgDataPrint } from '../tcg/mtg/api';
import type { PcgDataCard, PcgDataPrint } from '../tcg/pcg/api';

export type AnyCard = DlcDataCard | MtgDataCard | PcgDataCard;
export type AnyPrint = DlcDataPrint | MtgDataPrint | PcgDataPrint;

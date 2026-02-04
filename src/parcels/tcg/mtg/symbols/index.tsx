import { Image, rem } from '@mantine/core';
import number0 from './0.svg';
import number1 from './1.svg';
import number2 from './2.svg';
import hybridBlack from './2b.svg';
import hybridGreen from './2g.svg';
import hybridRed from './2r.svg';
import hybridBlue from './2u.svg';
import hybridWhite from './2w.svg';
import number3 from './3.svg';
import number4 from './4.svg';
import number5 from './5.svg';
import number6 from './6.svg';
import number7 from './7.svg';
import number8 from './8.svg';
import number9 from './9.svg';
import number10 from './10.svg';
import number11 from './11.svg';
import number12 from './12.svg';
import number13 from './13.svg';
import number14 from './14.svg';
import number15 from './15.svg';
import number16 from './16.svg';
import black from './b.svg';
import blackGreen from './bg.svg';
import phyrexianBlack from './bp.svg';
import blackRed from './br.svg';
import colorless from './c.svg';
import colorlessBlack from './cb.svg';
import colorlessGreen from './cg.svg';
import colorlessRed from './cr.svg';
import colorlessBlue from './cu.svg';
import colorlessWhite from './cw.svg';
import energyCounter from './e.svg';
import green from './g.svg';
import phyrexianGreen from './gp.svg';
import greenBlue from './gu.svg';
import phyrexianGreenBlue from './gup.svg';
import greenWhite from './gw.svg';
import phyrexianGreenWhite from './gwp.svg';
import phyrexian from './h.svg';
import paw from './p.svg';
import untap from './q.svg';
import red from './r.svg';
import redGreen from './rg.svg';
import phyrexianRedGreen from './rgp.svg';
import phyrexianRed from './rp.svg';
import redWhite from './rw.svg';
import phyrexianRedWhite from './rwp.svg';
import snow from './s.svg';
import tap from './t.svg';
import ticket from './tk.svg';
import blue from './u.svg';
import blueBlack from './ub.svg';
import phyrexianBlue from './up.svg';
import blueRed from './ur.svg';
import white from './w.svg';
import whiteBlack from './wb.svg';
import phyrexianWhite from './wp.svg';
import whiteBlue from './wu.svg';
import letterX from './x.svg';
import letterY from './y.svg';
import letterZ from './z.svg';

const symbols = {
  '0': number0,
  '1': number1,
  '2': number2,
  '3': number3,
  '4': number4,
  '5': number5,
  '6': number6,
  '7': number7,
  '8': number8,
  '9': number9,
  '10': number10,
  '11': number11,
  '12': number12,
  '13': number13,
  '14': number14,
  '15': number15,
  '16': number16,
  '2/B': hybridBlack,
  '2/G': hybridGreen,
  '2/R': hybridRed,
  '2/U': hybridBlue,
  '2/W': hybridWhite,
  B: black,
  'B/G': blackGreen,
  'B/P': phyrexianBlack,
  'B/R': blackRed,
  C: colorless,
  'C/B': colorlessBlack,
  'C/G': colorlessGreen,
  'C/R': colorlessRed,
  'C/U': colorlessBlue,
  'C/W': colorlessWhite,
  E: energyCounter,
  G: green,
  'G/P': phyrexianGreen,
  'G/U': greenBlue,
  'G/U/P': phyrexianGreenBlue,
  'G/W': greenWhite,
  'G/W/P': phyrexianGreenWhite,
  H: phyrexian,
  P: paw,
  Q: untap,
  R: red,
  'R/G': redGreen,
  'R/G/P': phyrexianRedGreen,
  'R/P': phyrexianRed,
  'R/W': redWhite,
  'R/W/P': phyrexianRedWhite,
  S: snow,
  T: tap,
  TK: ticket,
  U: blue,
  'U/B': blueBlack,
  'U/P': phyrexianBlue,
  'U/R': blueRed,
  W: white,
  'W/B': whiteBlack,
  'W/P': phyrexianWhite,
  'W/U': whiteBlue,
  X: letterX,
  Y: letterY,
  Z: letterZ,
};

export const getSVGForSymbol = (symbol: `{${string}}`) => {
  const code = symbol
    .toUpperCase()
    .substring(1)
    .substring(0, symbol.length - 2);

  return symbols[code as keyof typeof symbols] as unknown as
    | {
        blurDataURL: string;
        blurHeight: number;
        blurWidth: number;
        height: number;
        src: string;
        width: number;
      }
    | undefined;
};

export function SymbolSVG({ symbol, size }: { symbol: `{${string}}`; size: number }) {
  const svg = getSVGForSymbol(symbol as `{${string}}`);

  return <>{svg && <Image src={svg} style={{ width: rem(size) }} />}</>;
}

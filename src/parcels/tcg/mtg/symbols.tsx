import { Image, rem } from '@mantine/core';
import number0 from './symbols/0.svg';
import number1 from './symbols/1.svg';
import number2 from './symbols/2.svg';
import hybridBlack from './symbols/2b.svg';
import hybridGreen from './symbols/2g.svg';
import hybridRed from './symbols/2r.svg';
import hybridBlue from './symbols/2u.svg';
import hybridWhite from './symbols/2w.svg';
import number3 from './symbols/3.svg';
import number4 from './symbols/4.svg';
import number5 from './symbols/5.svg';
import number6 from './symbols/6.svg';
import number7 from './symbols/7.svg';
import number8 from './symbols/8.svg';
import number9 from './symbols/9.svg';
import number10 from './symbols/10.svg';
import number11 from './symbols/11.svg';
import number12 from './symbols/12.svg';
import number13 from './symbols/13.svg';
import number14 from './symbols/14.svg';
import number15 from './symbols/15.svg';
import number16 from './symbols/16.svg';
import black from './symbols/b.svg';
import blackGreen from './symbols/bg.svg';
import phyrexianBlack from './symbols/bp.svg';
import blackRed from './symbols/br.svg';
import colorless from './symbols/c.svg';
import colorlessBlack from './symbols/cb.svg';
import colorlessGreen from './symbols/cg.svg';
import colorlessRed from './symbols/cr.svg';
import colorlessBlue from './symbols/cu.svg';
import colorlessWhite from './symbols/cw.svg';
import energyCounter from './symbols/e.svg';
import green from './symbols/g.svg';
import phyrexianGreen from './symbols/gp.svg';
import greenBlue from './symbols/gu.svg';
import phyrexianGreenBlue from './symbols/gup.svg';
import greenWhite from './symbols/gw.svg';
import phyrexianGreenWhite from './symbols/gwp.svg';
import phyrexian from './symbols/h.svg';
import paw from './symbols/p.svg';
import untap from './symbols/q.svg';
import red from './symbols/r.svg';
import redGreen from './symbols/rg.svg';
import phyrexianRedGreen from './symbols/rgp.svg';
import phyrexianRed from './symbols/rp.svg';
import redWhite from './symbols/rw.svg';
import phyrexianRedWhite from './symbols/rwp.svg';
import snow from './symbols/s.svg';
import tap from './symbols/t.svg';
import ticket from './symbols/tk.svg';
import blue from './symbols/u.svg';
import blueBlack from './symbols/ub.svg';
import phyrexianBlue from './symbols/up.svg';
import blueRed from './symbols/ur.svg';
import white from './symbols/w.svg';
import whiteBlack from './symbols/wb.svg';
import phyrexianWhite from './symbols/wp.svg';
import whiteBlue from './symbols/wu.svg';
import letterX from './symbols/x.svg';
import letterY from './symbols/y.svg';
import letterZ from './symbols/z.svg';

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

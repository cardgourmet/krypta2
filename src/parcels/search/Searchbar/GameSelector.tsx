import { IconChevronDown } from '@tabler/icons-react';
import Dropdown from '@/parcels/overview/Dropdown/Dropdown.tsx';
import { DLCIcon } from '@/parcels/tcg/dlc/Icon.tsx';
import { MTGIcon } from '@/parcels/tcg/mtg/Icon.tsx';
import { PCGIcon } from '@/parcels/tcg/pcg/Icon.tsx';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './GameSelector.module.css';

type GameSelectorProps = {
  tcg: Tcg;
  setTcg: (Tcg: Tcg) => void;
};

export function GameSelector({ tcg, setTcg }: GameSelectorProps) {
  return (
    <div className={styles.gameSelector}>
      <Dropdown
        items={{
          dlc: 'Disney Lorcana',
          mtg: 'Magic: The Gathering',
          pcg: 'Pokémon Card Game',
        }}
        selected={tcg}
        renderButtonContent={(selected) => (
          <>
            {selected === 'dlc' && (
              <>
                <DLCIcon width={20} height={20} color={'#9ba6b1'} />
                <p className={styles.gameSelectorLabel}>DISNEY LORCANA</p>
              </>
            )}
            {selected === 'mtg' && (
              <>
                <MTGIcon width={20} height={20} color={'#9ba6b1'} />
                <p className={styles.gameSelectorLabel}>MAGIC: THE GATHERING</p>
              </>
            )}
            {selected === 'pcg' && (
              <>
                <PCGIcon width={20} height={20} color={'#9ba6b1'} />
                <p className={styles.gameSelectorLabel}>POKÉMON CARD GAME</p>
              </>
            )}
            <IconChevronDown size={18} color={'#9ba6b1'} />
          </>
        )}
        onSelect={(selected) => {
          setTcg(selected as Tcg);
        }}
      />
    </div>
  );
}

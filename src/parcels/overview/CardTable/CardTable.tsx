/** biome-ignore-all lint/correctness/noNestedComponentDefinitions: <explanation> */
import {useMediaQuery} from '@mantine/hooks';
import {Link} from '@tanstack/react-router';
import {useMemo} from 'react';
import {slugify} from '@/parcels/slugify.ts';
import type {DlcSearchCardsResult, DlcSearchDataCard} from '@/parcels/tcg/dlc/api.ts';
import type {MtgDataCard, MtgSearchCardsResult, MtgSearchDataCard} from '@/parcels/tcg/mtg/api.ts';
import {renderRichText} from '@/parcels/tcg/mtg/renderRichText.tsx';
import type {PcgSearchCardsResult, PcgSearchDataCard} from '@/parcels/tcg/pcg/api.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './CardTable.module.css';

type CardTableProps = {
  tcg: Tcg;
  cards: MtgSearchCardsResult | DlcSearchCardsResult | PcgSearchCardsResult | null | undefined;
  isLoading: boolean;
};

export function CardTable({ tcg, cards, isLoading }: CardTableProps) {
  const smallScreen = useMediaQuery('(max-width: 720px)');
  const cardItems: MtgSearchDataCard[] | DlcSearchDataCard[] | PcgSearchDataCard[] | null = useMemo(() => {
    if (!cards) return null;

    if (tcg === 'dlc') {
      return (cards as DlcSearchCardsResult).data.items;
    } else if (tcg === 'pcg') {
      return (cards as PcgSearchCardsResult).data.items as PcgSearchDataCard[];
    } else if (tcg === 'mtg') {
      return (cards as MtgSearchCardsResult).data.items as MtgSearchDataCard[];
    }
    return null;
  }, [tcg, cards]);

  const tableData = useMemo(() => {
    return {
      header: ['Set', 'Number', 'Name', 'Cost', 'Type', 'Rarity', 'Artist'],
      rows: [
        {
          Set: (card: MtgDataCard) => {
            return <>{card.print.setCode}</>;
          },
          Number: (card: MtgDataCard) => {
            return <>{card.print.collectorNumber}</>;
          },
          Name: (card: MtgDataCard) => {
            return (
              <Link
                to={`/${tcg}/sets/$setCode/$collectorNumber/{-$any}`}
                params={{
                  setCode: card.print.setCode?.toLowerCase() as string,
                  collectorNumber: card.print.collectorNumber?.toLowerCase() as string,
                  any: slugify(card.name ?? ''),
                }}
              >
                {card.name}
              </Link>
            );
          },
        },
      ],
    };
  }, [tcg]);

  return (
    <>
      {!smallScreen && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Set</th>
              <th>Number</th>
              <th>Name</th>
              <th>Cost</th>
              <th>Type</th>
              <th>Rarity</th>
              <th>Artist</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading
              && cardItems
              && cardItems.map((card, index) => (
                <tr key={index} className={styles.clickableRow}>
                  <td>{card.card.print.setCode}</td>
                  <td>{card.card.print.collectorNumber}</td>
                  <td style={{ maxWidth: '24rem' }}>
                    <Link
                      to={`/${tcg}/sets/$setCode/$collectorNumber/{-$any}`}
                      params={{
                        setCode: card.card.print.setCode?.toLowerCase() as string,
                        collectorNumber: card.card.print.collectorNumber?.toLowerCase() as string,
                        any: slugify(card.card.name ?? ''),
                      }}
                    >
                      {card.card.name}
                    </Link>
                  </td>
                  <td>{renderRichText((card.card as MtgDataCard)?.print.faces[0]?.manaDisplay ?? '')}</td>
                  <td style={{ maxWidth: '20rem' }}>
                    {(card.card as MtgDataCard)?.print.faces[0]?.translations?.en?.typeLine}
                  </td>
                  <td>{card.card.print.rarity}</td>
                  <td style={{ maxWidth: '12rem' }}>{(card.card as MtgDataCard)?.print?.artist}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      {smallScreen && (
        <table className={styles.table}>
          <tbody>
            {!isLoading
              && cardItems
              && cardItems.map((card, index) => (
                <>
                  <tr key={`${index}_1`}>
                    <th>Set</th>
                    <td>{card.card.print.setCode}</td>
                  </tr>
                  <tr key={`${index}_2`}>
                    <th>Number</th>
                    <td>{card.card.print.collectorNumber}</td>
                  </tr>
                  <tr key={`${index}_3`}>
                    <th>Name</th>
                    <td style={{ maxWidth: '24rem' }}>
                      <Link
                        to={`/${tcg}/sets/$setCode/$collectorNumber/{-$any}`}
                        params={{
                          setCode: card.card.print.setCode?.toLowerCase() as string,
                          collectorNumber: card.card.print.collectorNumber?.toLowerCase() as string,
                          any: slugify(card.card.name ?? ''),
                        }}
                      >
                        {card.card.name}
                      </Link>
                    </td>
                  </tr>
                  <tr key={`${index}_4`}>
                    <th>Cost</th>
                    <td>{renderRichText((card.card as MtgDataCard)?.print.faces[0]?.manaDisplay ?? '')}</td>
                  </tr>
                  <tr key={`${index}_5`}>
                    <th>Type</th>
                    <td style={{ maxWidth: '20rem' }}>
                      {(card.card as MtgDataCard)?.print.faces[0]?.translations?.en?.typeLine}
                    </td>
                  </tr>
                  <tr key={`${index}_6`}>
                    <th>Rarity</th>
                    <td>{card.card.print.rarity}</td>
                  </tr>
                  <tr key={`${index}_7`} data-cell={'last'}>
                    <th>Artist</th>
                    <td style={{ maxWidth: '12rem' }}>{(card.card as MtgDataCard)?.print?.artist}</td>
                  </tr>
                </>
              ))}
          </tbody>
        </table>
      )}
    </>
  );

  /*

  <GourmetTable>
    <GourmetTableHeader />
    <GourmetTableBody>
      <GourmetTableRow>
        -- element to render
      </GourmetTableRow>
    </GourmetTableBody />
  </GourmetTable>


   */
}

function GourmetTable() {}

function GourmetTableHeader() {}

function GourmetTableRow() {}

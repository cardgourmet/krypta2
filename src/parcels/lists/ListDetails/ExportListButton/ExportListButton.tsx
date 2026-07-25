import { ActionIcon, Button, Group, type MantineColor, Modal, Stack, Textarea, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconUpload } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GourmetCheckbox } from '@/parcels/generic/mantine/GourmetCheckbox.tsx';
import { GourmetMultiSelect } from '@/parcels/generic/mantine/GourmetMultiSelect/GourmetMultiSelect.tsx';
import { GourmetSelect } from '@/parcels/generic/mantine/GourmetSelect/GourmetSelect.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { groupBy } from '@/parcels/groupBy.ts';
import { exportAsStringArray } from '@/parcels/lists/ListDetails/ExportListButton/exportProcessors.ts';
import type { ResolvedUserListResource, UserListWithResources } from '@/parcels/lists/types.ts';
import { useListDetailsWorkStore } from '@/parcels/selection/useListDetailsWorkStore.tsx';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import { Route } from '@/routes/@{$user}/lists/$listId.tsx';
import styles from './ExportListButton.module.css';

const exportFormatData = [
  { group: 'MTG', items: ['MTGO', 'MTGA'] },
  { group: 'PCG', items: ['Limitless', 'PTCGO', 'PokemonCard.io', 'pkmn.gg'] },
  { group: 'DLC', items: ['Dreamborn', 'lorcana.gg'] },
];

export function ExportListButton({ list }: { list: UserListWithResources }) {
  const { t } = useTranslation('lists', { keyPrefix: 'details.export' });
  const [opened, { open, close }] = useDisclosure(false);

  const allResources = useMemo(() => {
    return Object.values(list.resources ?? {})
      .flat()
      .filter((res) => res.listResource.resourceType === 'card');
  }, [list.resources]);

  const sizeByTcg = useMemo(() => {
    const grouped = groupBy(allResources, (r) => r.listResource.game as Tcg);
    const obj = {} as Record<Tcg, number>;
    for (const groupedKey in grouped) {
      obj[groupedKey as Tcg] = grouped[groupedKey as Tcg]?.length;
    }

    return obj;
  }, [allResources]);
  const possibleTcgs = useMemo(() => {
    return [...new Set(allResources.map((resource) => resource.listResource.game!))];
  }, [allResources]);
  const tcgSelectData = useMemo(() => {
    return possibleTcgs.map((tcg) => {
      const size = sizeByTcg[tcg as Tcg] ?? 0;

      return { value: tcg, label: `${tcg.toUpperCase()} (${size})` };
    });
  }, [possibleTcgs, sizeByTcg]);

  const selectionData = useListDetailsWorkStore((state) => state.data);
  const selectedResources = useMemo(() => {
    return (selectionData?.selection?.elementIds ?? [])
      .map((id) => {
        return selectionData?.selection?.elementDataById[id];
      })
      .filter((res) => res !== undefined && res.listResource.resourceType === 'card') as ResolvedUserListResource[];
  }, [selectionData?.selection?.elementDataById, selectionData?.selection?.elementIds]);
  const selectionTcgs = useMemo(() => {
    return [...new Set(selectedResources.map((res) => res!.listResource.game!))];
  }, [selectedResources]);

  const search = Route.useSearch();
  const [selectedTcgs, setSelectedTcgs] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [onlySelectSelection, setOnlySelectSelection] = useState<boolean>(false);
  useEffect(() => {
    setOnlySelectSelection(selectedResources.length > 0);
  }, [selectedResources.length]);
  useEffect(() => {
    const tcgs = search.tcgs ?? [];

    if (tcgs.length === 0 || tcgs.length === possibleTcgs.length) {
      setSelectedTcgs(possibleTcgs);
      setSelectAll(true);
      return;
    }

    setSelectedTcgs(tcgs);
    setSelectAll(false);
  }, [search.tcgs, possibleTcgs]);

  const filteredExportFormats = useMemo(() => {
    let tcgs = selectedTcgs;
    if (selectAll) {
      tcgs = possibleTcgs;
    } else if (onlySelectSelection) {
      tcgs = selectionTcgs;
    }

    return exportFormatData.filter((g) => tcgs.includes(g.group.toLowerCase() as Tcg));
  }, [possibleTcgs, onlySelectSelection, selectAll, selectedTcgs, selectionTcgs]);

  const toExportResources = useMemo(() => {
    if (selectAll) {
      return allResources;
    } else if (onlySelectSelection) {
      return selectedResources;
    }
    return allResources.filter((res) => selectedTcgs.includes(res.listResource.game!));
  }, [allResources, onlySelectSelection, selectAll, selectedResources, selectedTcgs]);

  const [format, setFormat] = useState<string>('');
  useEffect(() => {
    setFormat(filteredExportFormats.length > 0 ? filteredExportFormats[0].items[0] : '');
  }, [filteredExportFormats]);

  const exportPreview = useMemo(() => {
    const toExport = toExportResources.slice(0, 10);

    return (exportAsStringArray(toExport, format) ?? []).join('\n');
  }, [format, toExportResources]);

  const [tooltipOpened, setTooltipOpened] = useState(false);
  const [tooltipLabel, setTooltipLabel] = useState<string>('');
  const [tooltipColor, setTooltipColor] = useState<MantineColor>('gray');

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Group gap={'0.5rem'}>
            <IconUpload size={20} color={'var(--gourmet-neutral-9)'} />
            <GourmetText cgmff={'ui'} fw={500} fz={'1.15rem'}>
              {t('title')}
            </GourmetText>
          </Group>
        }
        size="xl"
      >
        <Stack>
          <Group gap={'0.5rem'} align={'stretch'}>
            <Stack w={'35%'} gap={'1.5rem'}>
              <Stack gap={'0.5rem'}>
                <GourmetText cgmff={'ui'} cgmc={'neutral-8'}>
                  {t('target')}
                </GourmetText>

                <GourmetMultiSelect
                  data={tcgSelectData}
                  value={selectedTcgs}
                  onChange={(value) => {
                    if (value.length === 0) return;

                    setSelectedTcgs(value);
                  }}
                  disabled={selectAll || onlySelectSelection}
                  placeholder={t('chooseTcgs')}
                />
                <GourmetCheckbox
                  label={t('selectAll', { count: allResources.length })}
                  checked={selectAll}
                  onChange={(res) => {
                    if (possibleTcgs.length === 1) return;
                    if (res.target.checked) {
                      setSelectedTcgs(possibleTcgs);
                      setOnlySelectSelection(false);
                    }

                    setSelectAll(res.target.checked);
                  }}
                />
                <GourmetCheckbox
                  label={t('onlySelected', { count: selectedResources.length })}
                  checked={onlySelectSelection}
                  onChange={(res) => {
                    if (res.target.checked) {
                      setSelectAll(false);
                    }
                    setOnlySelectSelection(res.target.checked);
                  }}
                  disabled={selectedResources.length === 0}
                />
              </Stack>

              <Stack gap={'0.5rem'}>
                <GourmetText cgmff={'ui'} cgmc={'neutral-8'}>
                  {t('format')}
                </GourmetText>
                <GourmetSelect
                  data={filteredExportFormats}
                  value={format}
                  allowDeselect={false}
                  disabled={filteredExportFormats.length === 0}
                  onChange={(res) => {
                    setFormat(res ?? '');
                  }}
                  placeholder={t('chooseFormat')}
                />
              </Stack>

              <GourmetText cgmff={'ui'}>{t('total', { count: toExportResources.length })}</GourmetText>
            </Stack>

            <Stack gap={'0.5rem'} style={{ flexGrow: 1 }}>
              <Group gap={'1rem'}>
                <GourmetText cgmff={'ui'} cgmc={'neutral-8'}>
                  {t('exportPreview')}
                </GourmetText>
                <GourmetText cgmff={'ui'} cgmc={'neutral-6'}>
                  {t('onlyShown')}
                </GourmetText>
              </Group>

              <Textarea value={exportPreview} autosize minRows={11} maxRows={11} className={styles.preview} />
            </Stack>
          </Group>

          <Group justify={'end'}>
            <Button color={'var(--gourmet-neutral-5)'} onClick={close}>
              <GourmetText cgmc={'neutral-9'}>{t('cancel')}</GourmetText>
            </Button>
            <Tooltip
              label={tooltipLabel}
              opened={tooltipOpened}
              color={tooltipColor}
              withArrow
              transitionProps={{ transition: 'fade-up', duration: 200 }}
            >
              <Button
                color={'var(--gourmet-blue-1)'}
                onClick={async () => {
                  const exportedData = (exportAsStringArray(toExportResources, format) ?? []).join('\n');

                  try {
                    await navigator.clipboard.writeText(exportedData);

                    setTooltipLabel(t('copied'));
                    setTooltipOpened(true);
                    setTooltipColor('green');

                    setTimeout(() => {
                      setTooltipOpened(false);
                    }, 3000);
                  } catch (e) {
                    console.error(e);
                  }
                }}
              >
                <GourmetText cgmc={'neutral-0'}>{t('copy')}</GourmetText>
              </Button>
            </Tooltip>
          </Group>
        </Stack>
      </Modal>

      <Tooltip label={'Export cards'} openDelay={500}>
        <ActionIcon className={styles.editButton} onClick={open}>
          <IconUpload color={'var(--gourmet-neutral-7'} size={20} />
        </ActionIcon>
      </Tooltip>
    </>
  );
}

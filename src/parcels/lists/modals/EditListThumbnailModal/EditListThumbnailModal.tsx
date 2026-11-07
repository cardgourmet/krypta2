import { Checkbox, Group, Image, Loader, ScrollArea, SimpleGrid, Stack, UnstyledButton } from '@mantine/core';
import { IconPhotoSearch } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { FeaturedIcon } from '@/parcels/generic/FeaturedIcon/FeaturedIcon.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { updateList } from '@/parcels/lists/api.ts';
import { TcgDropdown } from '@/parcels/lists/modals/EditListThumbnailModal/TcgDropdown.tsx';
import { ThumbnailSearchInput } from '@/parcels/lists/modals/EditListThumbnailModal/ThumbnailSearchInput.tsx';
import type { UserList, UserListThumbnailCrop, UserListThumbnailUpdate } from '@/parcels/lists/types.ts';
import { Modal } from '@/parcels/modals/Modal.tsx';
import type { ExtendModalProps } from '@/parcels/modals/types.ts';
import { sendErrorNotification } from '@/parcels/notification/sendErrorNotification.tsx';
import { backupImageUrl, createProps } from '@/parcels/overview/cards/CardGrid/CardGridEntry/createProps.ts';
import { fetchTcgCards } from '@/parcels/tcg/fetchTcgCards.tsx';
import type { TcgSearchDataCard, TcgSearchQuerySettings } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

type CurrentThumbnail = {
  url: string;
  printTranslationId?: string; // will be set when a new crop will be requested
  cropTarget?: 'full' | 'crop';
  crop?: UserListThumbnailCrop;
};

export const EditListThumbnailModal = ({ innerProps: { list }, ...props }: ExtendModalProps<{ list: UserList }>) => {
  const { t } = useTranslation('lists', { keyPrefix: 'modal' });
  const { user } = useAuth();

  const defaultThumbnail = list.thumbnail
    ? ({
        url: list.thumbnail.fullUrl!,
        crop: list.thumbnail.data.cropData as unknown as UserListThumbnailCrop,
      } as CurrentThumbnail)
    : null;
  const [currentThumbnail, setCurrentThumbnail] = useState<CurrentThumbnail | null>(defaultThumbnail);

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TcgSearchDataCard[]>([]);

  const defaultTcg = list.allowedTcgs?.[0] ?? 'mtg';
  const [currentSearchTcg, setCurrentSearchTcg] = useState<Tcg>(defaultTcg);
  const [currentSearchInput, setCurrentSearchInput] = useState<string>('');
  const [onlyFilterList, setOnlyFilterList] = useState(true);

  const performSearch = useCallback(
    async (tcg: Tcg, input: string, filterList: boolean) => {
      setIsLoading(true);

      const queryParts = [];
      if (filterList && list.slug) {
        queryParts.push(`list:${list.slug}`);
      }
      if (input) {
        queryParts.push(`name:"${input}"`);
      }

      const query = queryParts.join(' ');

      const controller = new AbortController();
      const res = await fetchTcgCards(
        tcg,
        {
          query,
          page: 1,
          uniqueBy: 'prints',
        } as TcgSearchQuerySettings,
        controller,
        user?.id,
      );

      if (res?.data) {
        setResults(res.data.items);
      } else {
        setResults([]);
      }
      setIsLoading(false);

      return () => {
        controller.abort();
      };
    },
    [list.slug, user?.id],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: should not trigger on search input change
  useEffect(() => {
    performSearch(currentSearchTcg, currentSearchInput, onlyFilterList).then((_) => {});
  }, [currentSearchTcg, onlyFilterList, performSearch]);

  const handleSubmit = (update: CurrentThumbnail) => {
    if (!user) return;

    const thumbnailUpdate: UserListThumbnailUpdate = {
      crop: update.crop,
      printTarget: update.printTranslationId
        ? {
            printTranslationId: update.printTranslationId,
            target: update.cropTarget ?? 'full',
          }
        : null,
    };

    updateList(user.id, { id: list.id, name: list.name }, thumbnailUpdate).then(({ data, error }) => {
      if (error) {
        sendErrorNotification(error);
        return;
      }

      const returnList = data?.[list.id];
      if (!returnList) return;

      props.onResolve?.(returnList as UserList);
      props.onClose?.();
    });
  };

  // TODO: add name + setcode + collector number to crop card list
  // TODO: add fade overlay to crop card list, to visualize there's more potentially (or adjust height)
  // TODO: display if there would be a second page for crop card list

  // TODO: add button to reset selection (to view the current one again, if there is one)
  // TODO: add thing to set values for crop (if wanted), and button to enable that view

  // TODO: add auto completion for names

  return (
    <Modal {...props} size={'md'}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!currentThumbnail) return;

          handleSubmit(currentThumbnail);
        }}
        style={{ display: 'contents' }}
      >
        <Modal.Content>
          <FeaturedIcon size="md" variant="secondary">
            <IconPhotoSearch />
          </FeaturedIcon>

          <Modal.Title>Edit Thumbnail</Modal.Title>

          <Stack>
            <GourmetText>Choose an image</GourmetText>
            <Group>
              <TcgDropdown currentTcg={currentSearchTcg} setCurrentTcg={setCurrentSearchTcg} />
              <ThumbnailSearchInput
                value={currentSearchInput}
                onChange={setCurrentSearchInput}
                onSearch={(value) => {
                  performSearch(currentSearchTcg, value, onlyFilterList).then((_) => {});
                }}
              />
            </Group>
            <Checkbox
              checked={onlyFilterList}
              onChange={(event) => setOnlyFilterList(event.currentTarget.checked)}
              label={'Only show prints from this list'}
            />
            <ScrollArea h={250}>
              {isLoading ? (
                <Stack align="center" justify="center" h="100%">
                  <Loader size="sm" />
                </Stack>
              ) : results.length > 0 ? (
                <SimpleGrid cols={4} spacing="xs">
                  {results.map((result) => {
                    const props = createProps(currentSearchTcg, result);
                    const cropUrl = props.cropUrl ?? props.thumbnailUrl;
                    const printTranslationId = props.printTranslationId;

                    const isSelected = currentThumbnail?.printTranslationId === printTranslationId;
                    return (
                      <UnstyledButton
                        key={result.card.print.id}
                        onClick={() =>
                          setCurrentThumbnail({
                            printTranslationId: printTranslationId,
                            url: cropUrl!,
                            crop: undefined, // Default to no crop for now
                          })
                        }
                        style={{
                          border: isSelected ? '2px solid var(--gourmet-blue-1)' : '2px solid transparent',
                          borderRadius: '4px',
                          overflow: 'hidden',
                        }}
                      >
                        <Image src={cropUrl} fallbackSrc={backupImageUrl} alt={result.card.name} fit="contain" />
                      </UnstyledButton>
                    );
                  })}
                </SimpleGrid>
              ) : (
                <GourmetText cgmc={'neutral-4'}>
                  No prints found. Your list might be empty or change the search query.
                </GourmetText>
              )}
            </ScrollArea>
          </Stack>
          <Stack>
            <GourmetText>Preview</GourmetText>
            {currentThumbnail ? (
              <Group justify="center">
                <Image src={currentThumbnail.url} fallbackSrc={backupImageUrl} fit="contain" mah={200} />
              </Group>
            ) : (
              <GourmetText cgmc={'neutral-4'} style={{ textAlign: 'center' }}>
                No thumbnail selected
              </GourmetText>
            )}
          </Stack>
        </Modal.Content>
        <Modal.Footer>
          <Modal.SecondaryButton
            onClick={() => {
              props.onReject?.();
              props.onClose?.();
            }}
          >
            {t('cancel')}
          </Modal.SecondaryButton>
          <Modal.PrimaryButton type="submit">{t('save')}</Modal.PrimaryButton>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

import { Accordion, Grid, Group, Stack, Text, UnstyledButton } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Children, isValidElement, type PropsWithChildren, type ReactNode } from 'react';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { FilterExplanationPopover } from '@/parcels/search/glossary/FilterExplanationPopover.tsx';
import type { KitchenFormProps } from '@/parcels/search/kitchen/form/types.ts';
import styles from './KitchenCategory.module.css';

export function KitchenCategory({
  title,
  icon,
  children,
}: PropsWithChildren<{
  title: string;
  icon: ReactNode;
}>) {
  const smallScreen = useMediaQuery('(max-width: 600px)');

  return (
    <Accordion
      chevronPosition="right"
      key={title}
      defaultValue={title}
      classNames={{
        item: styles.accordionItem,
        content: styles.accordionContent,
        control: styles.accordionControl,
      }}
    >
      <Accordion.Item value={title}>
        <Accordion.Control>
          <Stack gap={'0.5rem'}>
            <Group style={{ color: 'var(--gourmet-blue-1)' }}>
              {icon}
              <Text fz={'h4'} fw={'bold'} ff={'var(--cgm-title-font-family)'} c={'var(--gourmet-blue-1)'}>
                {title.toUpperCase()}
              </Text>
            </Group>
          </Stack>
        </Accordion.Control>

        <Accordion.Panel>
          <Stack gap={'xl'}>
            {Children.toArray(children)
              .filter(isValidElement)
              .filter((child) => child.props && 'k' in (child.props as object))
              .map((child) => {
                const props = child.props as KitchenFormProps<unknown>;
                const { k, title, description, filter } = props;

                return (
                  <Grid key={k} gutter={'xl'}>
                    <Grid.Col span={smallScreen ? 12 : 4}>
                      <Stack
                        gap={'0.25rem'}
                        style={{
                          backgroundColor: 'var(--gourmet-neutral-1)',
                          borderRadius: '0.25rem',
                          padding: '0.25rem 0.5rem',
                        }}
                      >
                        <Group gap={'xs'}>
                          <GourmetText cgmff={'ui'} fz={'h5'} c={'var(--gourmet-neutral-9)'}>
                            {title}
                          </GourmetText>
                          {filter !== undefined && (
                            <FilterExplanationPopover tcg={'mtg'} filter={filter}>
                              <UnstyledButton className={styles.filterButton}>
                                <GourmetText cgmff={'ui'} fz={'0.875rem'} c={'var(--gourmet-blue-5)'}>
                                  {filter}
                                </GourmetText>
                              </UnstyledButton>
                            </FilterExplanationPopover>
                          )}
                        </Group>
                        <GourmetText cgmff="ui" fz={'h6'} c={'var(--gourmet-neutral-7)'}>
                          {description}
                        </GourmetText>
                      </Stack>
                    </Grid.Col>
                    <Grid.Col span={smallScreen ? 12 : 8}>
                      <div style={{ maxWidth: '100%' }}>{child}</div>
                    </Grid.Col>
                  </Grid>
                );
              })}
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

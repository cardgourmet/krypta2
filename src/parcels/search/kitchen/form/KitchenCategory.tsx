import { Accordion, Code, Grid, Group, Stack, Text } from '@mantine/core';
import { Children, isValidElement, type PropsWithChildren, type ReactNode } from 'react';
import type { CuisineFormProps } from '@/parcels/search/kitchen/form/types.ts';
import styles from './CuisineCategory.module.css';

export function KitchenCategory({
  title,
  icon,
  children,
}: PropsWithChildren<{
  title: string;
  icon: ReactNode;
}>) {
  return (
    <Accordion
      chevronPosition="right"
      key={title}
      defaultValue={title}
      classNames={{
        item: styles.accordionItem,
        panel: styles.accordionPanel,
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
                const props = child.props as CuisineFormProps;
                const { k, title, description, filter } = props;

                return (
                  <Grid key={k} gutter={'xl'}>
                    <Grid.Col span={4}>
                      <Stack gap={'0.25rem'}>
                        <Group gap={'xs'}>
                          <Text fz={'h5'} c={'var(--gourmet-neutral-8)'}>
                            {title}
                          </Text>
                          {filter !== undefined && <Code>{filter}</Code>}
                        </Group>
                        <Text fz={'h6'} c={'var(--gourmet-neutral-6)'}>
                          {description}
                        </Text>
                      </Stack>
                    </Grid.Col>
                    <Grid.Col span={8}>
                      <div style={{ maxWidth: '75%' }}>{child}</div>
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

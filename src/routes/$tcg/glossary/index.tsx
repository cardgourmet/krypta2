import { Accordion, Group, SimpleGrid, Tooltip } from '@mantine/core';
import { IconCursorText, IconPlusEqual, IconSearch } from '@tabler/icons-react';
import { createFileRoute, notFound, stripSearchParams } from '@tanstack/react-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import z from 'zod';
import { capitalizeFirstLetter } from '@/parcels/capitalizeFirstLetter';
import { Badge } from '@/parcels/generic/Badge/Badge';
import { Input } from '@/parcels/generic/Input/Input';
import { Kicker } from '@/parcels/generic/Kicker/Kicker';
import { Tag } from '@/parcels/generic/Tag/Tag';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';
import { PageContent } from '@/parcels/layout/PageContent/PageContent';
import { PageHeader } from '@/parcels/layout/PageHeader/PageHeader';
import { useFilters } from '@/parcels/search/filter/useFilters';
import { useUserLanguage } from '@/parcels/state/useUserLanguage';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation';
import styles from './Glossary.module.css';

const paramDefaults = {
  filter: '',
};

const paramsSchema = z.object({
  filter: z.string().catch(paramDefaults.filter),
});

export const Route = createFileRoute('/$tcg/glossary/')({
  component: RouteComponent,
  beforeLoad: ({ params }) => {
    const allowed = ['mtg', 'dlc', 'pcg'];
    if (!allowed.includes(params.tcg)) throw notFound({ data: { tcg: params.tcg } });
  },
  validateSearch: paramsSchema,
  search: {
    middlewares: [stripSearchParams(paramDefaults)],
  },
});

function RouteComponent() {
  const { t } = useTranslation('search');
  const { tcg } = Route.useParams();
  const { filter: activeFilter } = Route.useSearch();
  const navigate = Route.useNavigate();
  const rawFilters = useFilters(tcg as Tcg);
  const [lang] = useUserLanguage();
  const [query, setQuery] = useState('');

  const filters = useMemo(() => {
    const filters = rawFilters.map(({ filter, translations }) => {
      const translation = translations[lang] ?? translations.en;
      return {
        description: translation.description,
        id: filter.keywords[0],
        inverted: filter.inverted,
        keywords: filter.keywords,
        operators: Array.from(new Set(filter.properties.flatMap((p) => p.operators))),
        properties: filter.properties,
        strict: filter.strictValues,
        tags: [translation.description.toLowerCase(), ...filter.keywords, translation.title.toLowerCase()],
        title: translation.title || capitalizeFirstLetter(filter.keywords[0]),
      };
    });

    filters.sort((a, b) => a.title.localeCompare(b.title));

    if (!query.trim()) return filters;
    return filters.filter((f) => f.tags.some((tag) => tag.includes(query.toLowerCase())));
  }, [lang, query, rawFilters]);

  // Scroll to the filter from the URL once on initial load (filters are loaded asynchronously)
  const hasScrolledToActiveFilter = useRef(false);
  useEffect(() => {
    if (hasScrolledToActiveFilter.current || !activeFilter) return;
    if (!filters.some((f) => f.id === activeFilter)) return;

    hasScrolledToActiveFilter.current = true;
    requestAnimationFrame(() => {
      document.getElementById(`filter-${activeFilter}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
  }, [activeFilter, filters]);

  return (
    <PageContent headerSlot={<PageHeader pageTitle="Filter Glossary" />}>
      <div className={styles.searchContainer}>
        <Input
          leadingSlot={
            <Input.Icon>
              <IconSearch />
            </Input.Icon>
          }
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('searchPlaceholder')}
          value={query}
        />
      </div>

      <Accordion
        classNames={{ item: styles.accordionItem }}
        chevronPosition="right"
        onChange={(value) => {
          // noinspection JSIgnoredPromiseFromCall
          navigate({
            search: (prev) => ({ ...prev, filter: value ?? paramDefaults.filter }),
            replace: true,
            resetScroll: false,
          });
        }}
        value={activeFilter || null}
        variant="contained"
      >
        {filters.map((filter) => (
          <Accordion.Item id={`filter-${filter.id}`} value={filter.keywords.at(0)!} key={filter.keywords.at(0)!}>
            <Accordion.Control aria-label={filter.title}>
              <Typeset block className={styles.title} weight={600}>
                {filter.title}
              </Typeset>
            </Accordion.Control>

            <Accordion.Panel>
              <div className={styles.details}>
                <Group align="center" gap="1rem" justify="space-between">
                  {filter.description && (
                    <Typeset block style={{ marginTop: '0.125rem' }} variant="secondary">
                      {filter.description}
                    </Typeset>
                  )}

                  {(filter.inverted || filter.strict) && (
                    <Group gap="0.25rem">
                      {filter.strict && (
                        <Tooltip label="This filter only allow predefined auto-complete values">
                          <Badge color="red">STRICT</Badge>
                        </Tooltip>
                      )}

                      {filter.inverted && (
                        <Tooltip label="This filter is inverted by default">
                          <Badge color="orange">INVERTED</Badge>
                        </Tooltip>
                      )}
                    </Group>
                  )}
                </Group>

                <SimpleGrid cols={2} mt="1.5rem" spacing="1.5rem">
                  <div>
                    <Kicker leadingIcon={<IconCursorText />}>Available Keywords</Kicker>
                    <div className={styles.keywords}>
                      {filter.keywords.map((k) => (
                        <Tag key={k}>{k}</Tag>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Kicker leadingIcon={<IconPlusEqual />}>Supported Operators</Kicker>
                    <div className={styles.keywords}>
                      {filter.operators.map((o) => (
                        <Tag key={o}>{o}</Tag>
                      ))}
                    </div>
                  </div>
                </SimpleGrid>
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </PageContent>
  );
}

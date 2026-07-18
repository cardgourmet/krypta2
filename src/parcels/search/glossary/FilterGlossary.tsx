import { Group, UnstyledButton } from '@mantine/core';
import { IconNotebook } from '@tabler/icons-react';
import { type Ref, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { FilterGlossaryModal } from '@/parcels/search/glossary/FilterGlossaryModal.tsx';

export function FilterGlossary({ ref, size }: { ref?: Ref<HTMLDivElement>; size?: 'sm' | 'md' }) {
  const { t } = useTranslation('search', { keyPrefix: 'glossary' });

  const [isGlossaryOpened, setIsGlossaryOpened] = useState(false);

  return (
    <>
      <FilterGlossaryModal ref={ref} opened={isGlossaryOpened} setOpened={setIsGlossaryOpened} />

      <UnstyledButton
        onClick={() => {
          setIsGlossaryOpened(true);
        }}
      >
        <Group gap={'0.15rem'}>
          <IconNotebook size={size === 'md' ? 18 : 16} color={'var(--gourmet-blue-1)'} />
          <GourmetText cgmff={'ui'} c={'var(--gourmet-blue-1)'} fz={size === 'md' ? undefined : '0.875rem'}>
            {t('title')}
          </GourmetText>
        </Group>
      </UnstyledButton>
    </>
  );
}

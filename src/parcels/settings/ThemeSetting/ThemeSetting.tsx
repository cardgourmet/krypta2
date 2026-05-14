import { Group, type MantineColorScheme, Radio, RadioGroup, Stack, useMantineColorScheme } from '@mantine/core';
import { useTranslation } from 'react-i18next';

export function ThemeSetting() {
  const { t } = useTranslation('auth', { keyPrefix: 'settings.groups.general.theme' });
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  return (
    <Stack>
      <RadioGroup
        name={'theme'}
        value={colorScheme}
        onChange={(val) => {
          setColorScheme(val as MantineColorScheme);
        }}
      >
        <Group>
          <Radio value={'light'} label={t('values.light')} />
          <Radio value={'dark'} label={t('values.dark')} />
          <Radio value={'auto'} label={t('values.auto')} />
        </Group>
      </RadioGroup>
    </Stack>
  );
}

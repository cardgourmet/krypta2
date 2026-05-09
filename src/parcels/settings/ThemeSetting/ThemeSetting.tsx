import {Group, type MantineColorScheme, Radio, RadioGroup, Stack, useMantineColorScheme} from '@mantine/core';

export function ThemeSetting() {
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
          <Radio value={'light'} label={'Light'} />
          <Radio value={'dark'} label={'Dark'} />
          <Radio value={'auto'} label={'Auto'} />
        </Group>
      </RadioGroup>
    </Stack>
  );
}

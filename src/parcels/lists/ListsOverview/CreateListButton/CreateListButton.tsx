import {Button} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {IconPlus} from '@tabler/icons-react';
import {CreateListModal} from '@/parcels/lists/ListsOverview/CreateListModal/CreateListModal.tsx';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';

export default function CreateListButton() {
  const disclosure = useDisclosure(false);
  const [_, { open }] = disclosure;

  return (
    <>
      <CreateListModal disclosure={disclosure} />

      <Button
        color={'var(--gourmet-blue-1)'}
        leftSection={<IconPlus size={20} color={'var(--gourmet-neutral-1'} />}
        h={'1.75rem'}
        p={'0 0.5rem'}
        onClick={open}
      >
        <GourmetText cgmff={'ui'} c={'var(--gourmet-neutral-1)'} fw={500}>
          Create new list
        </GourmetText>
      </Button>
    </>
  );
}

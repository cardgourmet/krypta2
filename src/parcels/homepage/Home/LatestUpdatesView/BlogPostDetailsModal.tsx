import { Group, Modal, Stack } from '@mantine/core';
import { Badge } from '@/parcels/generic/Badge/Badge.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { AvatarDisplay } from '@/parcels/homepage/AvatarDisplay/AvatarDisplay.tsx';
import type { DataPost } from '@/parcels/homepage/Home/api.ts';

export function BlogPostDetailsModal({
  post,
  opened,
  close,
  lang,
}: {
  post?: DataPost;
  opened: boolean;
  close: () => void;
  lang: string;
}) {
  const translation = post?.translations[lang] ?? post?.translations.en;
  const author = post?.author;

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={
        <Group>
          <Badge size={'md'} color={post?.type === 'blog' ? 'blue' : post?.type === 'release' ? 'green' : undefined}>
            {post?.type?.toUpperCase()}
          </Badge>
          <GourmetText cgmff={'title'} fz={'h3'} c={'var(--gourmet-neutral-9)'}>
            {translation?.title}
          </GourmetText>
        </Group>
      }
      size={'lg'}
    >
      <Stack>
        <Group gap={'0.5rem'}>
          {author && <AvatarDisplay author={author} />}
          <GourmetText fz={'0.95rem'}>
            Written by <span style={{ color: 'var(--gourmet-blue-1)' }}>@{post?.author?.username}</span>
          </GourmetText>
        </Group>

        {translation?.text && (
          <Stack>
            <GourmetText c={'var(--gourmet-neutral-8)'}>{translation?.text}</GourmetText>
          </Stack>
        )}
        {!translation?.text && <GourmetText c={'var(--gourmet-neutral-5)'}>No text found.</GourmetText>}
      </Stack>
    </Modal>
  );
}

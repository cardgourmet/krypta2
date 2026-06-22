import { Avatar, Style } from '@dicebear/core';
import definition from '@dicebear/styles/glyphs.json';
import { Group, Modal, Stack } from '@mantine/core';
import { useMemo } from 'react';
import { Badge } from '@/parcels/generic/Badge/Badge.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import type { DataPost } from '@/parcels/homepage/Home/api.ts';
import styles from './BlogPostDetailsModal.module.css';

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

  const avatarFallback = useMemo(() => {
    if (!author || author?.avatarUrl) return;

    const style = new Style(definition);
    const avatar = new Avatar(style, {
      seed: author!.id,
    });

    return avatar.toString();
  }, [author]);

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
          {author && (
            <div style={{ width: '2rem', height: '2rem' }}>
              <div className={styles.userIcon}>
                {author.avatarUrl && <img src={author.avatarUrl ?? ''} alt={author.displayName} />}
                {!author.avatarUrl && (
                  <img
                    src={`data:image/svg+xml,${encodeURIComponent(avatarFallback ?? '')}`}
                    alt={author.displayName}
                  />
                )}
              </div>
            </div>
          )}
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

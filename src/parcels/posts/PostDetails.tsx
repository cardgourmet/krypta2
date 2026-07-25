import { Group, Space, Stack } from '@mantine/core';
import Markdown from 'react-markdown';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { AvatarDisplay } from '@/parcels/homepage/AvatarDisplay/AvatarDisplay.tsx';
import { useUserLanguage } from '@/parcels/state/useUserLanguage.tsx';
import { Route } from '@/routes/posts/$postId.tsx';
import styles from './PostDetails.module.css';

export function PostDetails() {
  const [lang] = useUserLanguage();
  const postData = Route.useLoaderData();

  const translation = postData?.translations[lang] ?? postData?.translations.en;
  const author = postData?.author ?? undefined;

  return (
    <Stack>
      {translation?.title && <title>{`${translation.title} – Blog Posts – Cardgourmet`}</title>}
      {!translation?.title && <title>{`Unknown Title – Blog Posts – Cardgourmet`}</title>}

      <Stack gap={'0rem'}>
        {postData?.postedAt && (
          <GourmetText fz={'1rem'} cgmc={'neutral-7'} cgmff={'ui'}>
            Posted {new Date(postData?.postedAt).toLocaleDateString()}
          </GourmetText>
        )}
        <GourmetText fz={'h1'} cgmc={'neutral-9'} cgmff={'title'} fw={'bold'}>
          {translation?.title}
        </GourmetText>
      </Stack>

      {author && (
        <Group gap={'0.75rem'}>
          <AvatarDisplay author={author} size={'3rem'} />
          <Stack gap={'0'}>
            <GourmetText cgmc={'neutral-9'} fw={500}>
              {author.displayName}
            </GourmetText>
            <GourmetText cgmc={'neutral-7'}>@{author.username}</GourmetText>
          </Stack>
        </Group>
      )}

      <Space h={'0.5rem'} />
      <Stack>
        {!translation?.text && <GourmetText cgmc={'neutral-6'}>There is no text yet.</GourmetText>}
        {translation?.text && (
          <div className={styles.markdownBody}>
            <Markdown>{translation.text}</Markdown>
          </div>
        )}
      </Stack>
    </Stack>
  );
}

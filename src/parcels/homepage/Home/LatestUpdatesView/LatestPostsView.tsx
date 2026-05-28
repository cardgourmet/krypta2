import { Center, Group, Loader, Stack, Tooltip } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/parcels/generic/Badge/Badge.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { type DataPost, getPosts, type PostType } from '@/parcels/homepage/Home/api.ts';
import { TcgIcon } from '@/parcels/tcg/TcgIcon.tsx';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function LatestPostsView({ types }: { types: PostType[] }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<DataPost[]>([]);
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const res = await getPosts(types, 10);
        if (res.error) {
          console.error(`Failed to load ${types.join(',')} posts`, res.error);
          return;
        }

        const allPosts: DataPost[] = [];
        for (const [_, posts] of Object.entries(res.data ?? {})) {
          allPosts.push(...posts);
        }
        allPosts.sort((a, b) => {
          const aDate = new Date(a.postedAt);
          const bDate = new Date(b.postedAt);

          return (aDate.getTime() - bDate.getTime()) * -1;
        });

        setPosts(allPosts);
      } catch (error) {
        console.error(`Failed to load posts`, error);
      } finally {
        setLoading(false);
      }
    };

    // noinspection JSIgnoredPromiseFromCall
    loadPosts();
  }, [types]);

  return (
    <Stack gap={'0.5rem'}>
      {loading && (
        <Center>
          <Loader />
        </Center>
      )}

      {!loading
        && posts.map((p) => {
          const translation = p.translations.en!;
          const tcgs: Tcg[] = p.relatedTcgs as Tcg[];

          return (
            <Stack
              key={translation.title}
              style={{ border: '1px solid var(--gourmet-neutral-3)', borderRadius: '0.25rem' }}
              p={'0.5rem'}
              gap={'0.25rem'}
            >
              <Group justify={'space-between'} wrap={'nowrap'} align={'start'}>
                <Group wrap={'nowrap'} align={'start'}>
                  <Badge size={'sm'} color={p.type === 'blog' ? 'blue' : p.type === 'release' ? 'green' : undefined}>
                    {p.type.toUpperCase()}
                  </Badge>

                  <GourmetText cgmff={'title'} cgmc={'neutral-9'} fw={'500'}>
                    {translation.title}
                  </GourmetText>
                </Group>

                <Group gap={'0.1rem'} wrap={'nowrap'}>
                  {tcgs?.map((t) => {
                    return (
                      <Tooltip key={t} label={t.toUpperCase()} openDelay={500}>
                        <TcgIcon tcg={t} size={20} color={'var(--gourmet-neutral-7)'} />
                      </Tooltip>
                    );
                  })}
                </Group>
              </Group>
              {translation.hook && <Group>{translation.hook}</Group>}

              <Group justify={'space-between'}>
                <GourmetText cgmff={'ui'} fz={'0.85rem'}>
                  {new Date(p.postedAt).toLocaleDateString()}
                </GourmetText>

                {p.type === 'blog' && (
                  <Group gap={'0.15rem'}>
                    <GourmetText cgmff={'ui'} fz={'0.9rem'}>
                      Read more
                    </GourmetText>
                    <IconArrowRight size={18} />
                  </Group>
                )}
              </Group>
            </Stack>
          );
        })}
    </Stack>
  );
}

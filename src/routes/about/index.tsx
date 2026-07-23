import { Group, Space, Stack } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import Markdown from 'react-markdown';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import styles from './index.module.css';

export const Route = createFileRoute('/about/')({
  component: RouteComponent,
});

export type HelperInfo = {
  name: string;
  imageUrl: string;
};

function RouteComponent() {
  const weAre: HelperInfo[] = useMemo(() => {
    return [
      {
        name: 'Benedikt',
        imageUrl: 'https://assets.cardgourmet.com/avatars/ZjFjZ.png',
      },
      {
        name: 'Fabian',
        imageUrl: 'https://assets.cardgourmet.com/avatars/clumsy-as-usual.jpg',
      },
      {
        name: 'Tobias',
        imageUrl: 'https://assets.cardgourmet.com/avatars/OTdjM.png',
      },
    ];
  }, []);
  const helpers: HelperInfo[] = useMemo(() => {
    return [
      {
        name: 'Pia',
        imageUrl: 'https://assets.cardgourmet.com/avatars/helpers_pia.png',
      },
      {
        name: 'GumLong',
        imageUrl: 'https://assets.cardgourmet.com/avatars/helpers_gumlong.png',
      },
      {
        name: 'Marlin',
        imageUrl: 'https://assets.cardgourmet.com/avatars/helpers_marlin.png',
      },
      {
        name: 'Ryu',
        imageUrl: 'https://assets.cardgourmet.com/avatars/helpers_ryu.png',
      },
      {
        name: 'Thomas',
        imageUrl: '',
      },
      {
        name: 'Paul',
        imageUrl: '',
      },
      {
        name: 'Emma',
        imageUrl: '',
      },
      {
        name: 'Nele',
        imageUrl: '',
      },
    ];
  }, []);

  return (
    <div className={styles.body}>
      <title>{`About – Cardgourmet`}</title>
      <Markdown>{`# About us

Our main goal for Cardgourmet is to create a singular platform for cross-TCG card management. That means one page to browse and collect cards, build decks, share them with your friends and much more.

Of course this takes a lot of time and will only be possible in the long run. That's why we've decided to create a cross-TCG card browser first that will be the basis of all other upcoming features. This includes a powerful search engine, detailed card information, managing card lists and the interaction between all of these features.

Even though this is just the first step, we know that this will still take time to do right. For that reason we humbly ask you to leave as much as feedback as possible so that we can make this project awesome together.

Also, as a secondary goal, we want to enable people to make awesome stuff. That's why we will spend extra time focusing on the developer integrations, so that you will be able to get all the data via REST or even host the card database yourselves! But that's food for thought for another time.

## Who we are

We are a small developer team from Germany, doing all of this in our free time. In August 2023 we reignited our love for TCGs when we randomly stumbled upon a Magic: The Gathering Song by Jonathan Young. We thought that especially cross-TCG tools have a lot of potential, particularly developer ressources can feel incomplete or not well maintained. That is why we have been working on this project very hard since then.

A lot of this journey until now has been learning about the different TCGs and their communities. And since we are fairly new to these communities, we definitely still have a lot to learn! 
`}</Markdown>
      <Space h={'1.5rem'} />
      <Group>
        {weAre.map((h) => {
          return (
            <Stack key={h.name} gap={'0.5rem'} style={{ minWidth: '4.5rem' }} align={'center'}>
              <div style={{ width: '3.5rem', height: '3.5rem' }}>
                <div className={styles.userIcon}>
                  <img src={h.imageUrl ?? ''} alt={h.name} />
                </div>
              </div>
              <GourmetText>{h.name}</GourmetText>
            </Stack>
          );
        })}
      </Group>
      <Markdown>
        {`## Thanks to

Without the help of others this project would not be possible. We also heavily rely on third party data to supplement our own, so here is a list of projects that we use or that have inspired us (in no particular order):
- [Scryfall](https://scryfall.com/) - one of the best (if not the best) MTG database out there
- [tcgcollector](https://www.tcgcollector.com/) - great tool for tracking Pokémon cards
- [pkmncards](https://pkmncards.com/) and [malie](https://malie.io/) - Pokémon card database, especially useful for Developers
- [Moxfield](https://moxfield.com/) - awesome deck builder for MTG
- [MTGJSON](https://mtgjson.com/) - great source for MTG data, that uses Scryfall but also other sources
- [MTGPICS](https://www.mtgpics.com/) - source for English MTG set images
- [bulbapedia](https://bulbapedia.bulbagarden.net) - great source for everything PCG related
- [dreamborn](https://dreamborn.ink/de) - Disney Lorcana deck builder and card source

Also special thanks to our helpers, that have been supporting us since the beginning:`}
      </Markdown>
      <Space h={'1.5rem'} />
      <Group>
        {helpers.map((h) => {
          return (
            <Stack key={h.name} gap={'0.5rem'} style={{ minWidth: '4.5rem' }} align={'center'}>
              <div style={{ width: '3.5rem', height: '3.5rem' }}>
                <div className={styles.userIcon}>
                  <img src={h.imageUrl ?? ''} alt={h.name} />
                </div>
              </div>
              <GourmetText>{h.name}</GourmetText>
            </Stack>
          );
        })}
      </Group>
    </div>
  );
}

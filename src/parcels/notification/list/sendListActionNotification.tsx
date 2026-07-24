import type { PossibleResource } from '@/parcels/lists/api.ts';
import type { UserList, UserListResource } from '@/parcels/lists/types.ts';
import { CardAddNotification } from '@/parcels/notification/list/CardAddNotification.tsx';
import { CardRemoveNotification } from '@/parcels/notification/list/CardRemoveNotification.tsx';
import { QueryAddNotification } from '@/parcels/notification/list/QueryAddNotification.tsx';
import { QueryRemoveNotification } from '@/parcels/notification/list/QueryRemoveNotification.tsx';
import { ResourcesAddNotification } from '@/parcels/notification/list/ResourcesAddNotification.tsx';
import { ResourcesRemoveNotification } from '@/parcels/notification/list/ResourcesRemoveNotification.tsx';
import { sendNotification } from '@/parcels/notification/sendNotification.ts';
import type { ExplainSearchQuery } from '@/parcels/search/types.ts';
import type { TcgDataCard } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export type ListActionResources = {
  resources: UserListResource[];
  resolved?: Record<string, PossibleResource | undefined>;
  language?: string;
};

export function sendListActionNotification(
  list: UserList,
  action: 'add' | 'remove',
  { resources, resolved, language }: ListActionResources,
) {
  if (resources.length === 0) return;

  const resourceTypes = [...new Set(resources.map((resource) => resource.resourceType))];
  if (resourceTypes.length === 0) return;

  const resourceIds = resources.map((resource) => resource.resourceId);
  const singleResourceType = resourceTypes[0];

  if (resourceTypes.length === 1 && resources.length === 1) {
    const resolvedData = resolved?.[resourceIds[0]];

    if (singleResourceType === 'card') {
      if (action === 'add') {
        sendNotification(
          'success',
          <CardAddNotification
            tcg={resources[0].game as Tcg}
            list={list}
            card={resolvedData as TcgDataCard}
            language={language ?? 'en'}
          />,
        );
      } else if (action === 'remove') {
        sendNotification(
          'error',
          <CardRemoveNotification
            tcg={resources[0].game as Tcg}
            list={list}
            card={resolvedData as TcgDataCard}
            language={language ?? 'en'}
          />,
        );
      }
    } else if (singleResourceType === 'user_search') {
      if (action === 'add') {
        sendNotification(
          'success',
          <QueryAddNotification
            tcg={resources[0].game as Tcg}
            list={list}
            query={resolvedData as ExplainSearchQuery}
            language={language ?? 'en'}
          />,
        );
      } else if (action === 'remove') {
        sendNotification(
          'error',
          <QueryRemoveNotification
            tcg={resources[0].game as Tcg}
            list={list}
            query={resolvedData as ExplainSearchQuery}
            language={language ?? 'en'}
          />,
        );
      }
    }

    return;
  }

  if (action === 'add') {
    sendNotification(
      'success',
      <ResourcesAddNotification list={list} resourceIds={resourceIds} language={language ?? 'en'} />,
    );
  } else if (action === 'remove') {
    sendNotification(
      'error',
      <ResourcesRemoveNotification list={list} resourceIds={resourceIds} language={language ?? 'en'} />,
    );
  }
}

import {createFileRoute} from '@tanstack/react-router';
import {validate} from 'uuid';

export const Route = createFileRoute('/me/lists/$listId')({
  component: RouteComponent,
  loader: ({ params }) => {
    const listId = params.listId;
    if (validate(listId)) {
      // TODO: is a unique id!
    } else {
      // TODO: count as slug.
    }
  },
});

function RouteComponent() {
  return <div>Hello "/me/lists/$listId"!</div>;
}

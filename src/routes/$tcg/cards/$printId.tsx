import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/$tcg/cards/$printId')({
  loader: ({ params }) => {
    // TODO: check for tcg and print id and route to /tcg/sets/.../...
  },
});

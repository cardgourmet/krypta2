import {createFileRoute, notFound} from "@tanstack/react-router";

export const Route = createFileRoute('/$tcg/sets/')({
  component: RouteComponent,
  beforeLoad: ({ params }) => {
    const allowed = ['mtg', 'dlc', 'pcg'];
    if (!allowed.includes(params.tcg)) throw notFound({ data: { tcg: params.tcg } });
  },
});

function RouteComponent() {
  const params = Route.useParams();

  return <p>All Sets Overview {params.tcg}</p>;
}

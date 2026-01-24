import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dlc/advanced/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dlc/advanced/"!</div>
}

import { createFileRoute, notFound } from '@tanstack/react-router';
import { type DataPost, getPost } from '@/parcels/homepage/Home/api.ts';
import { sendErrorNotification } from '@/parcels/notification/sendErrorNotification.tsx';
import { PostDetails } from '@/parcels/posts/PostDetails.tsx';

export const Route = createFileRoute('/posts/$postId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const postRes = await getPost(params.postId);
    if (postRes.error) {
      sendErrorNotification(postRes.error);
      return undefined;
    }
    if (!postRes.data) throw notFound();
    const data = postRes.data as unknown as DataPost;
    if (data.type !== 'blog') throw notFound();

    return data;
  },
});

function RouteComponent() {
  return <PostDetails />;
}

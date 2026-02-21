import { prisma } from "@/lib/prisma";
import CreatePost from "@/components/CreatePost";
import LikeButton from "@/components/LikeButton";
export default async function FeedPage() {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      likes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div style={{ padding: 20 }}>
      <h1>Feed 🚀</h1>

      {posts.map((post) => (
        <div key={post.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <p>{post.content}</p>
          <small>By: {post.author.email}</small>
          <LikeButton
    postId={post.id}
    initialCount={post.likes.length}/>
        </div>
      ))}

      <CreatePost />

    </div>
  );
}
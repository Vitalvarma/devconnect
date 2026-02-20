import { prisma } from "@/lib/prisma";
import CreatePost from "@/components/CreatePost";
export default async function FeedPage() {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
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
        </div>
      ))}

      <CreatePost />
    </div>
  );
}
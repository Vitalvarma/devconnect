import { prisma } from "@/lib/prisma";
import CreatePost from "@/components/CreatePost";
import LikeButton from "@/components/LIkeButton";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function FeedPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Please login to view the feed</h1>
      </div>
    );
  }

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

      <Link href={`/profile/${session.user.id}`}>
        View My Profile
      </Link>

      {posts.map((post) => (
        <div
          key={post.id}
          style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}
        >
          <p>{post.content}</p>
          <small>By: {post.author.email}</small>

          <LikeButton
            postId={post.id}
            initialCount={post.likes.length}
          />

          {post.authorId === session.user.id && (
          <button
            onClick={async () => {
              await fetch("/api/posts/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ postId: post.id }),
              });
              location.reload();
            }}
            style={{ marginLeft: 10, color: "red" }}
          >
            Delete
          </button>
        )}
        </div>
      ))}

      <CreatePost />
    </div>
  );
}
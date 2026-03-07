"use server";

import { prisma } from "@/lib/prisma";
import CreatePost from "@/components/CreatePost";
import FeedList from "@/components/FeedList";
import FeedHeader from "@/components/FeedHeader";
import UnauthenticatedFeed from "@/components/UnauthenticatedFeed";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  Box,
  Typography,
} from "@mui/material";

export default async function FeedPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return <UnauthenticatedFeed />;
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
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      {/* Header */}
      <FeedHeader userId={session.user.id} />

      {/* Create Post */}
      <Box sx={{ mb: 4 }}>
        <CreatePost />
      </Box>

      {/* Posts */}
      {posts.length === 0 ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No posts yet. Be the first to share something!
          </Typography>
        </Box>
      ) : (
        <FeedList posts={posts} userId={session.user.id}/>
      )}
    </Box>
  );
}

import { prisma } from "@/lib/prisma";
import CreatePost from "@/components/CreatePost";
import LikeButton from "@/components/LIkeButton";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import DeleteButton from "@/components/deleteButton";
import {
  Box,
  Typography,
  Card,
  CardHeader,
  Avatar,
  CardContent,
  Button,
  Divider,
} from "@mui/material";
import {
  Person as PersonIcon,
} from "@mui/icons-material";

export default async function FeedPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          textAlign: "center",
        }}
      >
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Please login to view the feed
        </Typography>
        <Button component={Link} href="/login" variant="contained">
          Login
        </Button>
      </Box>
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
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Feed 🚀
        </Typography>
        <Button
          component={Link}
          href={`/profile/${session.user.id}`}
          variant="outlined"
          startIcon={<PersonIcon />}
        >
          My Profile
        </Button>
      </Box>

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
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {posts.map((post) => (
            <Card
              key={post.id}
              sx={{
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardHeader
                avatar={
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                    }}
                    aria-label="recipe"
                  >
                    {post.author.name?.[0] ||
                      post.author.email?.[0]?.toUpperCase() ||
                      "U"}
                  </Avatar>
                }
                action={
                  post.authorId === session.user.id && (
                    <DeleteButton postId={post.id} />
                  )
                }
                title={
                  <Typography
                    component={Link}
                    href={`/profile/${post.author.email}`}
                    sx={{
                      fontWeight: 600,
                      textDecoration: "none",
                      color: "text.primary",
                      "&:hover": {
                        color: "primary.main",
                      },
                    }}
                  >
                    {post.author.name || post.author.email}
                  </Typography>
                }
                subheader={
                  new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                }
              />
              <CardContent>
                <Typography
                  variant="body1"
                  sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                >
                  {post.content}
                </Typography>
              </CardContent>
              <Divider />
              <Box sx={{ p: 1, display: "flex", justifyContent: "flex-end" }}>
                <LikeButton postId={post.id} initialCount={post.likes.length} />
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}


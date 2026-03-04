import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import FollowButton from "@/components/FollowButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Divider,
  Grid,
} from "@mui/material";
import Link from "next/link";

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  let user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      followers: true,
      following: true,
      posts: {
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      },
    },
  });

  if (!user) {
    user = await prisma.user.findUnique({
      where: {
        email: id,
      },
      include: {
        followers: true,
        following: true,
        posts: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
      },
    });
  }

  if (!user) {
    return notFound();
  }

  const isFollowing = user.followers.some(
    (follow) => follow.followerId === session?.user?.id
  );

  const isOwnProfile = session?.user?.id === user.id || session?.user?.email === user.email;

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      <Card
        sx={{
          mb: 4,
          overflow: "visible",
          position: "relative",
        }}
      >
        <Box
          sx={{
            height: 120,
            background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
            borderRadius: "12px 12px 0 0",
          }}
        />

        <CardContent sx={{ pt: 0, position: "relative" }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              border: "4px solid white",
              bgcolor: "primary.main",
              fontSize: "3rem",
              fontWeight: 700,
              position: "absolute",
              top: -60,
              left: 24,
              boxShadow: 3,
            }}
          >
            {user.name?.[0] || user.email[0].toUpperCase()}
          </Avatar>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mb: 2,
              mt: 4,
            }}
          >
            {isOwnProfile ? (
              <Link href="/profile/edit">
                <Button variant="outlined" color="primary">
                  Edit Profile
                </Button>
              </Link>
            ) : (
              <FollowButton userId={user.id} initialState={isFollowing} />
            )}
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, mt: 6 }}>
            {user.name || "No name set"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {user.email}
          </Typography>

          {user.bio && (
            <Typography variant="body1" sx={{ mb: 3 }}>
              {user.bio}
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>
                  {user.followers.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Followers
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>
                  {user.following.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Following
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>
                  {user.posts.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Posts
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {user.posts.length > 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Recent Posts
            </Typography>
            {user.posts.map((post) => (
              <Box
                key={post.id}
                sx={{
                  p: 2,
                  mb: 1,
                  borderRadius: 1,
                  bgcolor: "background.default",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {post.content}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(post.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}


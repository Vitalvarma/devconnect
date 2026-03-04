"use client";

import Link from "next/link";
import DeleteButton from "./deleteButton";
import LikeButton from "./LIkeButton";
import {
  Box,
  Typography,
  Card,
  CardHeader,
  Avatar,
  CardContent,
  Divider,
} from "@mui/material";


interface Author {
  id: string;
  name: string | null;
  email: string;
}

interface Like {
  id: string;
}

interface Post {
  id: string;
  content: string;
  createdAt: Date;
  authorId: string;
  author: Author;
  likes: Like[];
}

interface FeedListProps {
  posts: Post[];
  userId: string;
}

export default function FeedList({ posts, userId }: FeedListProps) {
  return (
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
              post.authorId === userId && (
                <DeleteButton postId={post.id} />
              )
            }
            title={
              <Typography
                component={Link}
                href={`/profile/${post.author.id}`}
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
  );
}


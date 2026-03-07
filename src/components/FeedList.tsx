"use client";

import Link from "next/link";
import DeleteButton from "./deleteButton";
import LikeButton from "./LikeButton";
import Image from "next/image";
import CommentBox from "./CommentBox";
import Comments from "./Comments";
import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardHeader,
  Avatar,
  CardContent,
  Divider,
  IconButton,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";


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
  image: string | null;
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
  const [viewComments, setViewComments] = useState<{ [key: string]: boolean }>({});

  const toggleComments = (postId: string) => {
    setViewComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

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
              sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", mb: 2 }}
            >
              {post.content}
            </Typography>
            
            {post.image && (
              <Box
                sx={{
                  width: "100%",
                  maxHeight: 400,
                  overflow: "hidden",
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <Image
                  src={post.image}
                  alt="Post image"
                  width={800}
                  height={400}
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    maxHeight: 400,
                  }}
                />
              </Box>
            )}
          </CardContent>
          <Divider />
          <Box sx={{ p: 1, display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => toggleComments(post.id)} color="primary">
              <ChatBubbleOutlineIcon />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {viewComments[post.id] ? "Hide comments" : "Show comments"}
            </Typography>
          </Box>
          {viewComments[post.id] && (
            <>
              <Box sx={{ p: 2 }}>
                <Comments postId={post.id} />
              </Box>
              <Box sx={{ p: 2 }}>
                <CommentBox postId={post.id} />
              </Box>
            </>
          )}
          <Box sx={{ p: 1, display: "flex", justifyContent: "flex-end" }}>
            <LikeButton postId={post.id} initialCount={post.likes.length} />
          </Box>
        </Card>
      ))}
    </Box>
  );
}


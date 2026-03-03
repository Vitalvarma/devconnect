"use client";

import { useState } from "react";
import { IconButton, Typography, Box } from "@mui/material";
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";

interface Props {
  postId: string;
  initialCount: number;
}

export default function LikeButton({ postId, initialCount }: Props) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      });

      const data = await res.json();

      if (data.message === "Liked") {
        setCount((prev) => prev + 1);
        setLiked(true);
      } else if (data.message === "Unliked") {
        setCount((prev) => prev - 1);
        setLiked(false);
      }
    } catch (error) {
      console.error("Like error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
      }}
    >
      <IconButton
        onClick={handleLike}
        disabled={loading}
        sx={{
          color: liked ? "error.main" : "text.secondary",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.1)",
            color: "error.main",
          },
        }}
      >
        {liked ? (
          <FavoriteIcon color="error" />
        ) : (
          <FavoriteBorderIcon />
        )}
      </IconButton>
      <Typography
        variant="body2"
        color={liked ? "error.main" : "text.secondary"}
        sx={{ fontWeight: 500 }}
      >
        {count}
      </Typography>
    </Box>
  );
}


"use client";

import { useState } from "react";
import { Button } from "@mui/material";
import {
  PersonAdd as PersonAddIcon,
  Check as CheckIcon,
} from "@mui/icons-material";

interface Props {
  userId: string;
  initialState: boolean;
}

export default function FollowButton({ userId, initialState }: Props) {
  const [isFollowing, setIsFollowing] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/users/follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (data.message === "Followed") {
        setIsFollowing(true);
      } else if (data.message === "Unfollowed") {
        setIsFollowing(false);
      }
    } catch (error) {
      console.error("Follow error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isFollowing ? "outlined" : "contained"}
      color={isFollowing ? "inherit" : "primary"}
      onClick={handleFollow}
      disabled={loading}
      startIcon={isFollowing ? <CheckIcon /> : <PersonAddIcon />}
      sx={{
        minWidth: 120,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
        },
      }}
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  );
}


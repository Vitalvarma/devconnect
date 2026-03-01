"use client";

import { useState } from "react";

interface Props {
  userId: string;
  initialState: boolean;
}

export default function FollowButton({ userId, initialState }: Props) {
const [isFollowing, setIsFollowing] = useState(initialState);
  const handleFollow = async () => {
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
    } else {
      setIsFollowing(false);
    }
  };

  return (
    <button onClick={handleFollow}>
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}
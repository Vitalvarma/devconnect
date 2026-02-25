"use client";

import { useState } from "react";

interface Props {
  postId: string;
  initialCount: number;
}

export default function LikeButton({ postId, initialCount }: Props) {
  const [count, setCount] = useState(initialCount);

  const handleLike = async () => {
    const res = await fetch("/api/posts/like", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId }),
    });

    const data = await res.json();

    if (data.message === "Liked") {
      setCount((prev) => prev + 1);
    } else {
      setCount((prev) => prev - 1);
    }
  };

  return (
    <button onClick={handleLike}>
      ❤️ {count}
    </button>
  );
}
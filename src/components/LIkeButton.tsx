"use client";

import { useState } from "react";

export default function LikeButton({
  postId,
  initialCount,
}: {
  postId: string;
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);

  const handleLike = async () => {
    const res = await fetch("/api/like", {
      method: "POST",
      body: JSON.stringify({ postId }),
    });

    const data = await res.json();

    if (data.liked) {
      setCount(count + 1);
    } else {
      setCount(count - 1);
    }
  };

  return (
    <button onClick={handleLike}>
      ❤️ {count}
    </button>
  );
}
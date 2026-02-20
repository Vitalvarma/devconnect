"use client";

import { useState } from "react";

export default function CreatePost() {
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({ content }),
    });

    setContent("");
    window.location.reload();
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <br />

      <button onClick={handleSubmit}>
        Post
      </button>
    </div>
  );
}
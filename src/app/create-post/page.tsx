"use client";

import { useState } from "react";

export default function CreatePost() {
  const [content, setContent] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const res = await fetch("/api/posts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();
    setMessage(data.message);
    setContent("");
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Create Post
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
      >
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-3 rounded"
        />

        <button className="bg-blue-600 text-white p-2 rounded">
          Post
        </button>
      </form>

      {message && (
        <p className="mt-3">{message}</p>
      )}
    </div>
  );
}
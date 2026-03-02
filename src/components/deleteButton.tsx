"use client";

interface Props {
  postId: string;
}

export default function DeleteButton({ postId }: Props) {
  const handleDelete = async () => {
    await fetch("/api/posts/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    });

    window.location.reload();
  };

  return (
    <button
      onClick={handleDelete}
      style={{ marginLeft: 10, color: "red" }}
    >
      Delete
    </button>
  );
}
"use client";

import { IconButton, Tooltip } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";

interface Props {
  postId: string;
}

export default function DeleteButton({ postId }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await fetch("/api/posts/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <Tooltip title="Delete post">
      <IconButton
        onClick={handleDelete}
        sx={{
          color: "error.main",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.1)",
            bgcolor: "error.light",
            color: "white",
          },
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  );
}


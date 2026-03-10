"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Send as SendIcon,
  Create as CreateIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { CldUploadWidget } from "next-cloudinary";

export default function CreatePost() {
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Please write something before posting!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, image }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Post created successfully!");
        setContent("");
        setImage("");
      } else {
        setError(data.message || "Failed to create post");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        transition: "box-shadow 0.2s",
        "&:hover": {
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <CreateIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Create Post
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="What's on your mind? Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
            disabled={loading}
            id="create-post-textfield"
          />

          <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
            <CldUploadWidget
              uploadPreset="devconnect_posts"
              onSuccess={(result) => {
                const info = result.info as { secure_url?: string } | undefined;
                if (info?.secure_url) {
                  setImage(info.secure_url);
                }
              }}
            >
               {({ open }: { open: () => void }) => {
                return (
                  <Button
                    variant="outlined"
                    startIcon={<ImageIcon />}
                    onClick={() => open()}
                    disabled={loading}
                  >
                    {image ? "Change Image" : "Add Image"}
                  </Button>
                );
              }}
            </CldUploadWidget>
            
            {image && (
              <Box sx={{ position: "relative", width: 100, height: 100 }}>
                <Image
                  src={image}
                  alt="Preview"
                  width={100}
                  height={100}
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                />
                <Button
                  size="small"
                  color="error"
                  onClick={() => setImage("")}
                  sx={{ position: "absolute", top: -8, right: -8, minWidth: "auto", p: 0.5 }}
                >
                  ✕
                </Button>
              </Box>
            )}
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="submit"
              variant="contained"
              endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              disabled={loading || !content.trim()}
            >
              {loading ? "Posting..." : "Post"}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}

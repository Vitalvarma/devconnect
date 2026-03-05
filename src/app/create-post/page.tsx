import CreatePost from "@/components/CreatePost";
import { Box, Typography } from "@mui/material";

export default function CreatePostPage() {
  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Create Post
      </Typography>
      <CreatePost />
    </Box>
  );
}

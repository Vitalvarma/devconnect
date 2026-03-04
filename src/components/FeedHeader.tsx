"use client";

import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";
import {
  Person as PersonIcon,
} from "@mui/icons-material";

interface FeedHeaderProps {
  userId: string;
}

export default function FeedHeader({ userId }: FeedHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        Feed 🚀
      </Typography>
      <Button
        component={Link}
        href={`/profile/${userId}`}
        variant="outlined"
        startIcon={<PersonIcon />}
      >
        My Profile
      </Button>
    </Box>
  );
}

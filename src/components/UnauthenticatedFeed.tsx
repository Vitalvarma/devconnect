"use client";

import Link from "next/link";
import { Box, Typography, Button } from "@mui/material";

export default function UnauthenticatedFeed() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h5" color="text.secondary" gutterBottom>
        Please login to view the feed
      </Typography>
      <Button 
        component={Link} 
        href="/login" 
        variant="contained"
      >
        Login
      </Button>
    </Box>
  );
}


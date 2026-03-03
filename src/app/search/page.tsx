"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Paper,
  Divider,
} from "@mui/material";
import {
  Search as SearchIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import Link from "next/link";

interface User {
  id: string;
  name: string | null;
  email: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (value: string) => {
    setQuery(value);

    if (value.trim().length === 0) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);

    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setResults(data || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Search Users 🔍
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 4,
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
        }}
      >
        <TextField
          fullWidth
          placeholder="Search by name or email"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </Paper>

      {hasSearched && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {results.length} {results.length === 1 ? "result" : "results"} found
          </Typography>

          {results.length === 0 ? (
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 2,
              }}
            >
              <PersonIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                No users found matching &quot;{query}&quot;
              </Typography>
            </Paper>
          ) : (
            <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
              <List>
                {results.map((user, index) => (
                  <Box key={user.id}>
                    <ListItem
                      component={Link}
                      href={`/profile/${user.id}`}
                      sx={{
                        textDecoration: "none",
                        transition: "background-color 0.2s",
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                        py: 2,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 48,
                            height: 48,
                          }}
                        >
                          {user.name?.[0] || user.email[0].toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {user.name || "No name"}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < results.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </Paper>
          )}
        </>
      )}

      {!hasSearched && (
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 2,
          }}
        >
          <SearchIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Start typing to search for users
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
            Search by name or email address
          </Typography>
        </Paper>
      )}
    </Box>
  );
}


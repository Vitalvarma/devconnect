"use client";

import { useState, useEffect, useCallback } from "react";
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
  Save as SaveIcon,
  Person as PersonIcon,
  Image as ImageIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { CldUploadWidget } from "next-cloudinary";

export default function EditProfile() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile/me");
      if (res.ok) {
        const data = await res.json();
        setName(data.name || '');
        setBio(data.bio || '');
        setImage(data.image || '');
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio, image }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Profile updated!");
        fetchProfile();
      } else {
        setError(data.message || "Update failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Edit Profile
      </Typography>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <PersonIcon color="primary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Profile Information
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Bio"
              placeholder="Tell us about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              multiline
              rows={4}
              variant="outlined"
              sx={{ mb: 3 }}
              disabled={loading}
            />

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
                Profile Image <ImageIcon sx={{ ml: 0.5 }} />
              </Typography>
              {image && (
                <Box sx={{ 
                  mb: 2,
                  width: 150,
                  height: 150,
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: 3,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundImage: `url(${image})`,
                }} />
              )}
              <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary" }}>
                {image ? "Current image" : "No image set"}
              </Typography>

              <CldUploadWidget
                uploadPreset="devconnect_profiles"
                onSuccess={(result) => {
                  const info = result.info as { secure_url?: string };
                  if (info?.secure_url) {
                    setImage(info.secure_url);
                    // Auto save profile
                    fetch("/api/profile/update", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ image: info.secure_url })
                    }).then(res => {
                      if (res.ok) setMessage("Profile image updated!");
                    }).catch(() => setError("Failed to save"));
                  }
                }}
              >
                {({ open }: { open: () => void }) => (
                  <Button
                    variant="outlined"
                    startIcon={<CloudUploadIcon />}
                    onClick={() => open()}
                    disabled={loading}
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    Upload Profile Image
                  </Button>
                )}
              </CldUploadWidget>

              <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary" }}>
                Powered by Cloudinary
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="submit"
                variant="contained"
                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}


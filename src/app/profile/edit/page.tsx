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
} from "@mui/icons-material";

export default function EditProfile() {
  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [currentImage, setCurrentImage] = useState<string>("");
  const [initialImage, setInitialImage] = useState<string>("");

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile/me");
      if (res.ok) {
        const data = await res.json();
        setName(data.name || '');
        setBio(data.bio || '');
        setImage(data.image || '');
        setPreview(data.image || '');
        setCurrentImage(data.image || '');
        setInitialImage(data.image || '');
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  const uploadImage = async () => {
    if (!file) return image;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
        setFile(null);
        return data.url;
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
    return image;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      let finalImage = image;
      if (file || preview !== initialImage) {
        finalImage = await uploadImage();
      }

      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, bio, image: finalImage }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Profile updated successfully!");
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Edit Profile
      </Typography>

      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 3,
            }}
          >
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
              placeholder="Tell us about yourself..."
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
                Profile Image <ImageIcon sx={{ verticalAlign: "middle", ml: 0.5 }} />
              </Typography>
              {preview && (
                <Box 
                  sx={{ 
                    mb: 2,
                    width: 150,
                    height: 150,
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: (theme) => theme.shadows[3],
                    backgroundImage: `url(${preview})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }} 
                />
              )}
              {currentImage && !preview && (
                <Box 
                  sx={{ 
                    mb: 2,
                    width: 150,
                    height: 150,
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: (theme) => theme.shadows[3],
                    backgroundImage: `url(${currentImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }} 
                />
              )}
              <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: "text.secondary" }}>
                Current image
              </Typography>
              <label 
                htmlFor="profile-image-upload" 
                style={{ 
                  width: "100%", 
                  padding: "12px", 
                  border: "1px solid #d1d5db", 
                  borderRadius: "8px",
                  background: "white",
                  display: "block",
                  cursor: loading ? "not-allowed" : "pointer",
                  color: loading ? "#9ca3af" : "#374151",
                  textAlign: "center"
                }}
              >
                {loading ? "Uploading..." : "Choose new profile image"}
              </label>
              <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
                style={{ display: "none" }}
              />
              <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: "text.secondary" }}>
                Supported: JPG, PNG, WebP (max 5MB)
              </Typography>
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


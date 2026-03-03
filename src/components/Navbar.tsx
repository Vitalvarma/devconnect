"use client";

import { useSession, signOut } from "next-auth/react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  useTheme,
  Container,
  Divider,
  ListItemIcon,
} from "@mui/material";
import {
  Home as HomeIcon,
  Feed as FeedIcon,
  Search as SearchIcon,
  AddCircle as AddPostIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navItems = [
    { label: "Home", href: "/", icon: <HomeIcon /> },
    { label: "Feed", href: "/feed", icon: <FeedIcon /> },
    { label: "Search", href: "/search", icon: <SearchIcon /> },
    { label: "Post", href: "/create-post", icon: <AddPostIcon /> },
  ];

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: "divider",
        backgroundColor: "background.paper",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
          {/* Logo */}
          <Box
            component={Link}
            href="/"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" sx={{ color: "white", fontWeight: 700 }}>
                D
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: { xs: "none", sm: "block" },
              }}
            >
              DevConnect
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                component={Link}
                href={item.href}
                startIcon={item.icon}
                sx={{
                  color: "text.primary",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* User Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {status === "loading" ? (
              <Typography variant="body2" color="text.secondary">
                Loading...
              </Typography>
            ) : session ? (
              <>
                <IconButton
                  component={Link}
                  href={`/profile/${session.user?.email}`}
                  sx={{ mr: 1 }}
                >
                  <Avatar
                    src={session.user?.image || undefined}
                    alt={session.user?.name || "User"}
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "primary.main",
                    }}
                  >
                    {session.user?.name?.[0] || session.user?.email?.[0]?.toUpperCase()}
                  </Avatar>
                </IconButton>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={handleClick}
                  sx={{ display: { xs: "none", sm: "flex" } }}
                >
                  {session.user?.name || session.user?.email?.split("@")[0]}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  slotProps={{
                    paper: {
                      elevation: 3,
                      sx: {
                        mt: 1.5,
                        minWidth: 200,
                        borderRadius: 2,
                        overflow: "visible",
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem
                    component={Link}
                    href={`/profile/${session.user?.email}`}
                  >
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    Profile
                  </MenuItem>
                  <MenuItem component={Link} href="/profile/edit">
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    Edit Profile
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => signOut()}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  component={Link}
                  href="/login"
                  color="inherit"
                  sx={{ color: "text.primary" }}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  href="/signup"
                  variant="contained"
                  color="primary"
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}


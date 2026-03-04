"use client";

import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Container,
  Avatar,
  Stack,
} from "@mui/material";
import {
  Code as CodeIcon,
  People as PeopleIcon,
  Chat as ChatIcon,
  Security as SecurityIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  const features = [
    {
      icon: <CodeIcon sx={{ fontSize: 40 }} />,
      title: "Share Code",
      description:
        "Share your code snippets, projects, and technical achievements with the community.",
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      title: "Connect",
      description:
        "Follow other developers, build your network, and learn from the best.",
    },
    {
      icon: <ChatIcon sx={{ fontSize: 40 }} />,
      title: "Engage",
      description:
        "Like, comment, and interact with posts to build meaningful connections.",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: "Secure",
      description:
        "Your data is protected with industry-standard security practices.",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          textAlign: "center",
          background: "linear-gradient(180deg, #60a5fa15 0%, transparent 100%)",
          borderRadius: 4,
          mb: 6,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 2,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome to DevConnect
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 4, fontWeight: 400 }}
          >
            Connect with developers, share your knowledge, and grow together
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            {session ? (
              <Button
                component={Link}
                href="/feed"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                }}
              >
                Go to Feed
              </Button>
            ) : (
              <>
                <Button
                  component={Link}
                  href="/signup"
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                  }}
                >
                  Get Started
                </Button>
                <Button
                  component={Link}
                  href="/login"
                  variant="outlined"
                  size="large"
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                  }}
                >
                  Sign In
                </Button>
              </>
            )}
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          sx={{ mb: 1, fontWeight: 700 }}
        >
          Features
        </Typography>
        <Typography
          variant="body1"
          textAlign="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          Everything you need to connect with the developer community
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  py: 4,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: "auto",
                      mb: 2,
                      bgcolor: "primary.main",
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ mb: 1, fontWeight: 600 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          mt: 10,
          py: 8,
          textAlign: "center",
          backgroundColor: "primary.main",
          borderRadius: 4,
          color: "white",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
            Ready to join the community?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Create an account today and start connecting with developers from
            around the world.
          </Typography>
          {!session && (
            <Button
              component={Link}
              href="/signup"
              variant="contained"
              size="large"
              sx={{
                bgcolor: "white",
                color: "primary.main",
                "&:hover": {
                  bgcolor: "grey.100",
                },
                px: 4,
                py: 1.5,
              }}
            >
              Sign Up Now
            </Button>
          )}
        </Container>
      </Box>
    </Box>
  );
}


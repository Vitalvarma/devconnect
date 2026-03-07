import { Box, Typography, CircularProgress, IconButton, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
}

export default function Comments({ postId }: { postId: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments/get?postId=${postId}`);
        if (!res.ok) {
          console.error("Failed to fetch comments:", res.status, res.statusText);
          return;
        }
        const data = await res.json();
        if (data.success) {
          setComments(data.comments);
        } else {
          console.error("Failed to fetch comments:", data.message);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    const loadComments = async () => {
      setLoading(true);
      await fetchComments();
      setLoading(false);
    };

    loadComments();
  }, [postId]);

  const handleEditStart = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  const handleEditSave = async (commentId: string) => {
    if (!editContent.trim()) return;
    
    try {
      const res = await fetch("/api/comments/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId, content: editContent.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Failed to edit comment:", errorData.message);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setComments(comments.map(c => 
          c.id === commentId ? { ...c, content: editContent.trim(), updatedAt: new Date() } : c
        ));
        setEditingCommentId(null);
        setEditContent("");
      } else {
        console.error("Failed to edit comment:", data.message);
      }
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    
    setDeletingCommentId(commentId);
    
    try {
      const res = await fetch("/api/comments/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Failed to delete comment:", errorData.message);
        setDeletingCommentId(null);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setComments(comments.filter(c => c.id !== commentId));
      } else {
        console.error("Failed to delete comment:", data.message);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setDeletingCommentId(null);
    }
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOwnComment = (authorId: string) => {
    return session?.user?.id === authorId;
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (comments.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No comments yet. Be the first to comment!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Comments ({comments.length})
      </Typography>
      {comments.map((comment) => (
        <Box
          key={comment.id}
          sx={{
            p: 1.5,
            mb: 1,
            bgcolor: "grey.100",
            borderRadius: 1,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
              {comment.author.name || comment.author.email}
            </Typography>
            {session && isOwnComment(comment.author.id) && (
              <Box>
                {editingCommentId === comment.id ? (
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditSave(comment.id)}
                      color="primary"
                    >
                      <SaveIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={handleEditCancel}
                      color="error"
                    >
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditStart(comment)}
                      disabled={deletingCommentId !== null}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDelete(comment.id)}
                      disabled={deletingCommentId !== null}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            )}
          </Box>
          
          {editingCommentId === comment.id ? (
            <TextField
              fullWidth
              multiline
              minRows={2}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              sx={{ mt: 1 }}
              size="small"
            />
          ) : (
            <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
              {comment.content}
            </Typography>
          )}
          
          <Typography variant="caption" color="text.secondary">
            {formatDate(comment.createdAt)}
            {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
              <> (edited)</>
            )}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}


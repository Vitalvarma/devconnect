import { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function CommentBox({ postId }: { postId: string }) {
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!comment.trim() || submitting) return;
        setSubmitting(true);
        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ comment, postId }),
            });
            if (!res.ok) {
                console.error("Failed to submit comment:", res.status, res.statusText);
                setSubmitting(false);
                return;
            }
            const data = await res.json();
            if (data.success) {
                setComment("");
                // Optionally refresh comments here or emit an event
                window.location.reload();
            }
        } catch (error) {
            console.error("Comment submission error:", error);
        } finally {
            setSubmitting(false);
        }
    };
    
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                padding: 2,
                border: "1px solid #ccc",
                borderRadius: 2,
            }}
        >
            <Typography variant="h6">Add a Comment</Typography>
            <TextField
                label="Your Comment"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit} disabled={submitting || !comment.trim()}>
                {submitting ? "Submitting..." : "Submit"}
            </Button>
        </Box>
    );
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    try {
        const { commentId, content } = await req.json();
        
        if (!commentId || !content?.trim()) {
            return NextResponse.json({ message: "Comment ID and content are required" }, { status: 400 });
        }

        // Check if comment exists and belongs to the user
        const existingComment = await prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!existingComment) {
            return NextResponse.json({ message: "Comment not found" }, { status: 404 });
        }

        if (existingComment.authorId !== session.user.id) {
            return NextResponse.json({ message: "You can only edit your own comments" }, { status: 403 });
        }

        const updatedComment = await prisma.comment.update({
            where: { id: commentId },
            data: { content: content.trim() },
        });

        return NextResponse.json({ success: true, comment: updatedComment }, { status: 200 });
    } catch (error) {
        console.error("Error updating comment:", error);
        return NextResponse.json({ success: false, message: "Failed to update comment" }, { status: 500 });
    }
}


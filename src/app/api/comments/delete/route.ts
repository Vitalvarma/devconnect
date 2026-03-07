import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    try {
        const { commentId } = await req.json();
        
        if (!commentId) {
            return NextResponse.json({ message: "Comment ID is required" }, { status: 400 });
        }

        // Check if comment exists and belongs to the user
        const existingComment = await prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!existingComment) {
            return NextResponse.json({ message: "Comment not found" }, { status: 404 });
        }

        if (existingComment.authorId !== session.user.id) {
            return NextResponse.json({ message: "You can only delete your own comments" }, { status: 403 });
        }

        await prisma.comment.delete({
            where: { id: commentId },
        });

        return NextResponse.json({ success: true, message: "Comment deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting comment:", error);
        return NextResponse.json({ success: false, message: "Failed to delete comment" }, { status: 500 });
    }
}


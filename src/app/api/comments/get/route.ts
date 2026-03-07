import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const postId = new URL(req.url).searchParams.get("postId");
    if (!postId) {
        return NextResponse.json({ message: "Post ID is required" }, { status: 400 });
    }
    try {
        const comments = await prisma.comment.findMany({
            where: { postId: postId },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json({ success: true, comments }, { status: 200 });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch comments" }, { status: 500 });
    }
}
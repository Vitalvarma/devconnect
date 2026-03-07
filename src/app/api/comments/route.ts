import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    try{
        const { comment,postId } = await req.json();
        const newComment = {
            content: comment,
            createdAt: new Date().toISOString(),
        };
        
        await prisma.comment.create({
            data: {
                content: newComment.content,
                authorId: session.user.id,
                postId: postId,
            },
        });

        return new Response(JSON.stringify({ success: true, comment: newComment }), {  status: 200 });
    }
    catch(error){
        console.error("Error handling comment submission:", error);
        return new Response(JSON.stringify({ success: false, message: "Failed to submit comment" }), { status: 500 });
    }
}


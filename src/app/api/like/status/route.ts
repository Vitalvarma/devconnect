import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
    const session =await getServerSession(authOptions);
    if(!session?.user?.id || !session?.user?.email){
        return;
    }

    const url = new URL(req.url);
    const postId = url.searchParams.get('postId') as string;

    const existingLike = await prisma.like.findUnique({
        where:{
            userId_postId: {
                userId: session.user.id,
                postId: postId,
            }
        }
    });

    return NextResponse.json({liked:!!existingLike});
}
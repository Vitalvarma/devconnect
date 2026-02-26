import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { postId } = await req.json();

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  if (post.authorId !== session.user.id) {
    return NextResponse.json(
      { message: "Forbidden" },
      { status: 403 }
    );
  }

  await prisma.post.delete({
    where: { id: postId },
  });

  return NextResponse.json({ message: "Post deleted" });
}
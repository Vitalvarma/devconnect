import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession();

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { postId } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email! },
  });

  if (!user) return new Response("User not found", { status: 404 });

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_postId: {
        userId: user.id,
        postId,
      },
    },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: { id: existingLike.id },
    });
    return Response.json({ liked: false });
  }

  await prisma.like.create({
    data: {
      userId: user.id,
      postId,
    },
  });

  return Response.json({ liked: true });
}
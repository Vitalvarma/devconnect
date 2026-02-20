import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession();

  if (!session || !session.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { content } = await req.json();

  const post = await prisma.post.create({
    data: {
      content,
      author: {
        connect: { email: session.user.email },
      },
    },
  });

  return Response.json(post);
}
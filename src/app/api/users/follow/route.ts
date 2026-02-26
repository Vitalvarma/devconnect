import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { userId } = await req.json();

  if (userId === session.user.id) {
    return NextResponse.json(
      { message: "Cannot follow yourself" },
      { status: 400 }
    );
  }

  const existingFollow = await prisma.following.findUnique({
    where: {
      followerId_followingId: {
        followerId: session.user.id,
        followingId: userId,
      },
    },
  });

  if (existingFollow) {
    await prisma.following.delete({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: userId,
        },
      },
    });

    return NextResponse.json({ message: "Unfollowed" });
  }

  await prisma.following.create({
    data: {
      followerId: session.user.id,
      followingId: userId,
    },
  });

  return NextResponse.json({ message: "Followed" });
}
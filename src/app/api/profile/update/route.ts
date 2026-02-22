import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { bio, skills, location, github } = body as {
      bio?: string;
      skills?: string;
      location?: string;
      github?: string;
    };

    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        bio: bio || "",
        skills: skills
          ? skills.split(",").map((s) => s.trim())
          : [],
        location: location || "",
        github: github || "",
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
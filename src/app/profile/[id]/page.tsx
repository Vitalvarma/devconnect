import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import FollowButton from "@/components/FollowButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default async function ProfilePage({
  params,
}: ProfilePageProps) {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: {
      id: params.id,
    },
    include: {
    followers: true,
    following: true,
  },
  });

  if (!user) {
    return notFound();
  }
  const isFollowing = user.followers.some(
  (follow) => follow.followerId === session?.user?.id
);

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-4">
        {user.name}
      </h1>
      <FollowButton userId={user.id} 
      initialState={isFollowing}
      />
      {user.bio && (
        <p className="mb-4 text-gray-700">
          {user.bio}
        </p>
      )}
      <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
  <p>
    <strong>{user.followers.length}</strong> Followers
  </p>
  <p>
    <strong>{user.following.length}</strong> Following
  </p>
</div>
    </div>
  );
}
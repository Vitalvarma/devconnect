import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default async function ProfilePage({
  params,
}: ProfilePageProps) {
  const user = await prisma.user.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!user) {
    return notFound();
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-4">
        {user.name}
      </h1>

      {user.bio && (
        <p className="mb-4 text-gray-700">
          {user.bio}
        </p>
      )}
    </div>
  );
}
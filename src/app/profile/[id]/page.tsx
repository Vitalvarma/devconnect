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

      {user.location && (
        <p className="mb-2">
          📍 {user.location}
        </p>
      )}

      {user.skills.length > 0 && (
        <div className="mb-4">
          <h2 className="font-semibold mb-2">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {user.github && (
        <a
          href={user.github}
          target="_blank"
          className="text-blue-600 underline"
        >
          GitHub Profile
        </a>
      )}
    </div>
  );
}
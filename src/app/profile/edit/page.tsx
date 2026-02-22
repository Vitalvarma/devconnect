"use client";

import { useState } from "react";

export default function EditProfile() {
  const [bio, setBio] = useState<string>("");
  const [skills, setSkills] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [github, setGithub] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const res = await fetch("/api/profile/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bio,
        skills,
        location,
        github,
      }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Edit Profile
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3"
      >
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="border p-2"
        />

        <input
          type="text"
          placeholder="Skills (comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="border p-2"
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2"
        />

        <input
          type="text"
          placeholder="GitHub"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          className="border p-2"
        />

        <button className="bg-blue-600 text-white p-2">
          Save Changes
        </button>
      </form>

      {message && (
        <p className="mt-3">{message}</p>
      )}
    </div>
  );
}
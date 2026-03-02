"use client";

import { useState } from "react";
import Link from "next/link";

interface User {
  id: string;
  name: string | null;
  email: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);

  const handleSearch = async (value: string) => {
    setQuery(value);

    const res = await fetch(`/api/users/search?q=${value}`);
    const data = await res.json();
    setResults(data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Search Users 🔍</h1>

      <input
        type="text"
        placeholder="Search by name or email"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ padding: 8, width: "300px", marginBottom: 20 }}
      />

      {results.map((user) => (
        <div key={user.id} style={{ marginBottom: 10 }}>
          <Link href={`/profile/${user.id}`}>
            {user.name || user.email}
          </Link>
        </div>
      ))}
    </div>
  );
}
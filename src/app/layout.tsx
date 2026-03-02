import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "sans-serif", margin: 0 }}>
        <nav
          style={{
            padding: 16,
            borderBottom: "1px solid #ddd",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Link href="/">DevConnect</Link>

          <div style={{ display: "flex", gap: 20 }}>
            <Link href="/feed">Feed</Link>
            <Link href="/search">Search</Link>
            <Link href="/create-post">Post</Link>
          </div>
        </nav>

        <main style={{ maxWidth: 800, margin: "40px auto" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
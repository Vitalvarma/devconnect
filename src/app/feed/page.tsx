import { getServerSession } from "next-auth";

export default async function FeedPage() {
  const session = await getServerSession();

  if (!session) {
    return <div>Please login first.</div>;
  }

  return <h1>Welcome to Feed 🚀</h1>;
}

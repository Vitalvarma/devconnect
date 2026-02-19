"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@mui/material";
import Link from "next/link";


export default function Navbar() {
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <>
          <span>{session.user?.email}</span>
          <Button onClick={() => signOut()}>
            Logout
          </Button>
        </>
      ) : (
        <Link href="/login" passHref>
  <Button color="inherit">
    Login
  </Button>
</Link>  
)}
    </>
  );
}

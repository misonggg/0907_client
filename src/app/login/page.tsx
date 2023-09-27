"use client";
import React from "react";
import Login from "@/components/Login";
import { useAuthState } from "@/context/auth";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function page() {
  const { authenticated } = useAuthState();
  const router = useRouter();

  if (authenticated) router.push("/");

  return (
    <div className="flex flex-col items-center justify-center w-full bg-white">
      <h1 className="pb-3 text-lg font-semibold">로그인</h1>
      <Login />
    </div>
  );
}

export default page;

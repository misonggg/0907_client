"use client";
import Register from "@/components/Register";
import { useAuthState } from "@/context/auth";
import { useRouter } from "next/navigation";
import React from "react";

function page() {
  const { authenticated } = useAuthState();
  const router = useRouter();

  if (authenticated) {
    router.push("/");
  }

  return (
    <div className="flex flex-col items-center justify-center bg-white w-full h-grow">
      <h1 className="py-3 text-lg font-semibold">회원가입</h1>
      <Register />
    </div>
  );
}

export default page;

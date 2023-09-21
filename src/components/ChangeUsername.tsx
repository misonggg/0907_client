"use client";
import { useAuthState } from "@/context/auth";
import axios from "axios";
import { GetServerSideProps } from "next";
import { usePathname, useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import InputGroup from "./ui/InputGroup";

function ChangeUsername() {
  const { authenticated, user } = useAuthState();
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<any>("");
  const router = useRouter();
  const pathname = usePathname();
  const usernameMatch = pathname.match(/^\/u\/([^/]+)/);
  const username = usernameMatch ? usernameMatch[1] : null;

  if (!authenticated) {
    // router.push("/");
  }

  if (user?.username !== username) {
    // router.push("/");
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `http://localhost:4000/api/users/${user?.username}/changeUsername`,
        {
          name,
        },
        { withCredentials: true }
      );

      console.log("name : ", name);

      router.push(`/u/${res.data.name}`);
    } catch (error: any) {
      console.log("error : ", error);
      setErrors(error.response.data || {});
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-10">
      <p className="mb-6">유저 네임 변경</p>
      <form onSubmit={handleSubmit}>
        <div>
          <p className="text-sm text-gray-400 py-1">
            닉네임 다른 유저와 중복될 수 없습니다.
          </p>
          <InputGroup
            placeholder="닉네임"
            value={name}
            setValue={setName}
            error={errors.name}
          />
        </div>
        <button className="px-2 py-1 bg-blue-500 text-white mt-3 w-full">
          변경하기
        </button>
      </form>
    </div>
  );
}

export default ChangeUsername;

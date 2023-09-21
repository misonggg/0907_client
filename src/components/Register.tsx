"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import InputGroup from "./ui/InputGroup";

function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>("");

  let router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // const username = email.split("@")[0];

      // 클릭하면 post로 백엔드에 보내줌. 보내는 요청 경로임
      const res = await axios.post("http://localhost:4000/api/auth/register", {
        email,
        password,
        username,
      });

      router.push("/login");
    } catch (error: any) {
      console.log("error : ", error);
      setErrors(error.response.data || {});
    }
  };

  return (
    <div className="flex flex-col w-full">
      <form onSubmit={handleSubmit} className="">
        <InputGroup
          placeholder="닉네임"
          value={username}
          setValue={setUsername}
          error={errors.username}
        />
        <InputGroup
          placeholder="이메일"
          value={email}
          setValue={setEmail}
          error={errors.email}
        />
        <InputGroup
          placeholder="비밀번호"
          type={password}
          value={password}
          setValue={setPassword}
          error={errors.password}
        />
        <button className="px-2 py-1 bg-blue-500 text-white mt-3 w-full">
          회원가입하기
        </button>
      </form>
      <small className="py-3">
        이미 가입하셨나요?
        <Link href="/login" className="text-blue-500">
          로그인
        </Link>
      </small>
    </div>
  );
}

export default Register;

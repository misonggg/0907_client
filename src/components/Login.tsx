"use client";
import InputGroup from "@/components/ui/InputGroup";
import Link from "next/link";
import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuthDispatch, useAuthState } from "@/context/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<any>("");
  const dispatch = useAuthDispatch();

  let router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // 클릭하면 post로 백엔드에 보내줌. 보내는 요청 경로임
      const res = await axios.post(
        "http://localhost:4000/api/auth/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      // 로그인이 성공하면 만들어둔 context에 유저 정보를 저장함
      dispatch("LOGIN", res.data?.user);
      console.log("확인", res.data);

      router.push("/");
    } catch (error: any) {
      console.log("error : ", error);
      setErrors(error.response.data || {});
    }
  };

  return (
    <div className="flex flex-col w-full h-grow px-3 md:max-w-xl">
      <form onSubmit={handleSubmit} className="">
        <InputGroup
          placeholder="이메일"
          value={email}
          setValue={setEmail}
          error={errors.email}
        />
        <InputGroup
          placeholder="비밀번호"
          value={password}
          setValue={setPassword}
          error={errors.password}
        />
        <button className="p-2 rounded-full bg-blue-500 text-white mt-3 w-full">
          로그인하기
        </button>
      </form>
      <small className="py-1 pt-2">
        아직 아이디가 없나요?
        <Link href="/register" className="text-blue-500">
          회원가입
        </Link>
      </small>
      <small className="py-3">
        비밀번호를 까먹었다면,
        <Link href="/register" className="text-blue-500">
          비밀번호 찾기
        </Link>
      </small>
    </div>
  );
}

export default Login;

"use client";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import InputGroup from "./ui/InputGroup";

function CreateSubs() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<any>("");
  let router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:4000/api/subs",
        {
          name,
          title,
          description,
        },
        { withCredentials: true }
      );

      router.push(`/c/${res.data.name}`);
    } catch (error: any) {
      console.log("error : ", error);
      setErrors(error.response.data || {});
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-2 md:pt-5 w-full">
      <div className="flex flex-col items-center justify-center w-full">
        <p className="font-semibold mb-5">커뮤니티 생성</p>
        <form onSubmit={handleSubmit} className="w-full px-3 md:w-3/5 lg:w-2/5">
          <div>
            <p className="text-sm text-gray-400 py-1 pl-3">
              커뮤니티 이름은 변경할 수 없습니다.
            </p>
            <InputGroup
              placeholder="커뮤니티 이름"
              value={name}
              setValue={setName}
              error={errors.name}
            />
          </div>
          <div>
            <p className="text-sm text-gray-400 py-1 pl-3">
              커뮤니티를 한 줄로 설명해주세요.
            </p>
            <InputGroup
              placeholder="커뮤니티 한줄"
              value={title}
              setValue={setTitle}
              error={errors.title}
            />
          </div>
          <div>
            <p className="text-sm text-gray-400 py-1 pl-3">
              해당 커뮤니티에 대한 보다 자세한 설명을 입력해주세요.
            </p>
            <InputGroup
              placeholder="커뮤니티 설명"
              value={description}
              setValue={setDescription}
              error={errors.description}
            />
          </div>
          <button className="px-3 py-2 rounded-full bg-blue-500 text-white mt-3 w-full">
            커뮤니티 생성하기
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateSubs;

// 로그인 안 된 사람은 커뮤니티 생성 페이지에 접근 X
// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//   try {
//     const cookie = req.headers.cookie;

//     if (!cookie) throw new Error('Missing auth token cookie');

//     await axios.get('http://localhost:4000/api/auth/me', {
//       headers: { cookie },
//     });

//     return { props: {} };
//   } catch (error) {
//     // 요청에서 던져준 쿠키를 이용해 인증처리할 때 에러가나면 로그인 페이지로 이동시킴
//     res.writeHead(307, { Location: '/login' }).end();
//     return { props: {} };
//   }
// };

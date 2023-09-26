"use client";
import { useAuthState } from "@/context/auth";
import { Comment, Post } from "@/types";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import SubsPostCard from "./SubsPostCard";
import { FcVoicePresentation } from "react-icons/fc";
import dayjs from "dayjs";
import Link from "next/link";
import { ClipLoader } from "react-spinners";

function UserDetail() {
  const { authenticated, user } = useAuthState();
  const router = useRouter();
  const [ownUser, setOnUser] = useState(false);
  // 정규식을 사용하여 커뮤니티 이름을 추출
  const pathname = usePathname();
  const usernameMatch = pathname.match(/\/u\/(.+)/);
  const username = usernameMatch ? usernameMatch[1] : "";
  const decordedUsername = usernameMatch
    ? decodeURIComponent(usernameMatch[1])
    : "";

  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };
  const [pageIndex, setPageIndex] = useState(0);
  const currentPage = pageIndex + 1;

  const apiUrl = username
    ? `http://localhost:4000/api/users/${username}?page=${pageIndex}`
    : null;

  const apiUrl2 = `http://localhost:4000/api/users/${user?.username}/upload`;

  const { data, error, mutate } = useSWR<any>(apiUrl, fetcher);

  // 현재 유저네임과 path username이 동일하면 setUser 가 true가 됨
  useEffect(() => {
    setOnUser(authenticated && data?.user.username === user?.username);
  }, [user]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;

    const file = e.target.files[0];
    console.log("file", file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileInputRef.current!.name);

    try {
      await axios.post(apiUrl2, formData, {
        headers: { "Content-Type": "ulipart/form-data" },
      });

      mutate(apiUrl2);
    } catch (error) {
      console.log(error);
    }
  };

  const openFileInput = (type: string) => {
    if (!ownUser) return;
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.name = type;
      fileInput.click();
    }
  };

  const moveChangeUsernamePage = () => {
    if (!ownUser) return;
    router.push(`/u/${user?.username}/change`);
  };

  const deleteUser = async () => {
    await axios.post(
      `http://localhost:4000/api/users/${user?.username}/delete`
    );
  };

  return (
    <div className="w-full flex flex-col">
      {!data && !error && (
        <p className="absolute top-1/2 left-1/2">
          <ClipLoader color="#000000" size={40} />
        </p>
      )}
      <div>
        {data && data.user && (
          <div className="flex flex-row items-center pb-3 px-2 py-2">
            <input
              type="file"
              hidden={true}
              ref={fileInputRef}
              onChange={uploadImage}
            />
            <img
              src={data.user!.imageUrl}
              alt="유저 이미지 "
              className="w-16 h-16 rounded-full cursor-pointer"
              onClick={() => openFileInput("image")}
            />
            <div className="flex flex-col ml-2">
              <p
                onClick={moveChangeUsernamePage}
                className="font-semibold text-lg"
              >
                {data.user!.username}
              </p>
              <p className="text-sm">
                {dayjs(data.user!.createdAt).format("YYYY년 MM월 DD일 가입")}
              </p>
            </div>
          </div>
        )}
        {data && data.user.username == user?.username && (
          <button
            className="bg-red-400 px-2 py-1 text-white text-sm rounded-full ml-5"
            onClick={() => deleteUser()}
          >
            탈퇴하기
          </button>
        )}
      </div>
      <div className="w-full flex flex-row overflow-hidden">
        <div className="w-full p-2">
          <p className="font-semibold px-2 py-3">🔥 유저 활동 내역</p>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {data && data?.userData ? (
              data.userData.map((data: any) => {
                if (data.type === "Post") {
                  const post: Post = data;
                  return (
                    <SubsPostCard
                      key={post.identifier}
                      post={post}
                      subMutate={mutate}
                    />
                  );
                } else {
                  const comment: Comment = data;
                  return (
                    <div
                      key={comment.identifier}
                      className="flex flex-col p-3 border-b border-gray-300 gap-1"
                    >
                      <Link
                        href={`/c/${comment.post?.subname}/${comment.post?.identifier}`}
                      >
                        <p className="text-xs">
                          댓글이 작성된 커뮤니티 : {comment.post?.subname}
                        </p>
                        <p className="text-blue-500 text-xs">
                          {comment.post?.title}
                        </p>
                        <div className="flex flex-row items-center">
                          <FcVoicePresentation className="text-2xl mr-1 shrink-0" />
                          <p className="line-clamp-2 overflow-hidden">
                            {comment.body}
                          </p>
                        </div>
                      </Link>
                    </div>
                  );
                }
              })
            ) : (
              <p className="p-2 text-gray-500">
                해당 유저가 존재하지 않습니다.
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between my-5 px-5">
        <button
          onClick={() => {
            if (pageIndex > 0) {
              setPageIndex(pageIndex - 1);
            }
          }}
          className="px-3 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:opacity-60"
        >
          이전페이지
        </button>
        <p className="text-bold p-2 mx-5">{currentPage}</p>
        <button
          onClick={() => setPageIndex(pageIndex + 1)}
          className="px-3 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:opacity-60"
        >
          다음페이지
        </button>
      </div>
    </div>
  );
}

export default UserDetail;

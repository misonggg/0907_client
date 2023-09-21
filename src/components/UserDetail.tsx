"use client";
import { useAuthState } from "@/context/auth";
import { Comment, Post } from "@/types";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import SubsPostCard from "./SubsPostCard";

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

  const apiUrl = username
    ? `http://localhost:4000/api/users/${username}`
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
    <div className="w-full flex flex-row">
      {!data && !error && <p>Loading...</p>}
      <div>
        {data && data.user.username == user?.username && (
          <button
            className="bg-blue-500 px-2 py-1 text-white"
            onClick={() => deleteUser()}
          >
            탈퇴하기
          </button>
        )}
        {data && data.user && (
          <div>
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
            <p onClick={moveChangeUsernamePage}>{data.user!.username}</p>
            <p>{data.user!.createdAt}</p>
          </div>
        )}
      </div>
      <div className="w-full flex flex-row">
        <div className="w-full p-2">
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
                    className="flex flex-col border border-gray-400 my-4"
                  >
                    <p className="text-xs">{comment.username}</p>
                    <p className="text-xs">댓글 내용 : {comment.body}</p>
                    <p className="text-xs text-blue-500">
                      {comment.post?.title}
                    </p>
                    <p className="text-xs">{comment.post?.subname}</p>
                  </div>
                );
              }
            })
          ) : (
            <p>해당 유저가 존재하지 않습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDetail;

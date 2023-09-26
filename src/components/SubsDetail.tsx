"use client";
import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";
import { useAuthState } from "@/context/auth";
import dayjs from "dayjs";
import { Post } from "@/types";
import SubsPostCard from "./SubsPostCard";
import Link from "next/link";
import SubsSideBar from "./SubsSideBar";
import { ClipLoader } from "react-spinners";

function SubsDetail() {
  const router = useRouter();
  const [ownSub, setOnSub] = useState(false);
  const { authenticated, user, isAdmin } = useAuthState();
  const [isFollowing, setIsFollowing] = useState(false);

  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };

  // 정규식을 사용하여 커뮤니티 이름을 추출
  const pathname = usePathname();
  const subNameMatch = pathname.match(/\/c\/([^/]+)$/);
  const subName = subNameMatch ? subNameMatch[1] : null;

  // 페이지네이션
  const [pageIndex, setPageIndex] = useState(0);
  const currentPage = pageIndex + 1;

  const {
    data: sub,
    error,
    mutate,
  } = useSWR(
    subName
      ? `http://localhost:4000/api/subs/${subName}?page=${pageIndex}`
      : null,
    fetcher
  );

  // 아직 사용 중이 아님
  const { data: joinedUsers, error: joinedUsersError } = useSWR(
    subName ? `http://localhost:4000/api/subs/${subName}/joinedUsers` : null,
    fetcher
  );

  // 현재 유저네임과 서브의 유저네임이 동일하면 setOnSub가 true가 됨
  useEffect(() => {
    if (!sub || !user) return;
    setOnSub(authenticated && user.username === sub.username);
  }, [sub]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;

    const file = e.target.files[0];
    console.log("file", file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", fileInputRef.current!.name);

    try {
      await axios.post(
        `http://localhost:4000/api/subs/${sub.name}/upload`,
        formData,
        {
          headers: { "Content-Type": "ulipart/form-data" },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const openFileInput = (type: string) => {
    if (!ownSub) return;
    const fileInput = fileInputRef.current;
    if (fileInput) {
      fileInput.name = type;
      fileInput.click();
    }
  };

  let renderPosts;

  if (!sub) {
    renderPosts = (
      <p className="absolute top-1/2 left-1/2">
        <ClipLoader color="#000000" size={40} />
      </p>
    );
  } else if (sub.posts.length === 0) {
    renderPosts = <p className="px-2 py-4 mt-10">작성된 포스트가 없습니다.</p>;
  } else {
    renderPosts = sub.posts.map((post: Post) => (
      <SubsPostCard key={post.identifier} post={post} subMutate={mutate} />
    ));
  }

  const deleteSub = async (subname: any) => {
    const confirmation = window.confirm("정말로 삭제하시겠습니까?");

    if (confirmation) {
      try {
        await axios.delete(`http://localhost:4000/api/subs/${subName}`);
        return router.push("/");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const followSub = async (subName: any) => {
    if (!authenticated) {
      const confirmation = window.confirm(
        "로그인이 필요합니다. 로그인하시겠습니까?"
      );
      if (confirmation) {
        router.push("/login");
      }
      return;
    }

    try {
      await axios.post(`http://localhost:4000/api/subs/${subName}`);
      console.log("함수 동작");
      // isFollowing을 true로 설정해줌
      mutate();
      return;
    } catch (error) {
      console.log(error);
    }
  };

  console.log("sub?.joinedUsers : ", sub?.joinedUsers);

  return (
    <div className="w-full flex-grow flex flex-col bg-white">
      <div className="w-full ">
        {sub && (
          <div className="">
            <div className="relative">
              <input
                type="file"
                hidden={true}
                ref={fileInputRef}
                onChange={uploadImage}
              />
              <div className="bg-gray-400 relative">
                {sub.bannerUrl ? (
                  <img
                    src={sub.bannerUrl}
                    alt=""
                    className="w-full h-20 md:h-40 cursor-pointer object-cover mb-1"
                    onClick={() => openFileInput("banner")}
                  />
                ) : (
                  <div
                    className="h-20 md:h-40 w-full bg-blue-200 object-cover cursor-pointer mb-1"
                    onClick={() => openFileInput("banner")}
                  ></div>
                )}
              </div>
              <div className="flex items-center ml-3">
                {sub.imageUrl && (
                  <img
                    src={sub.imageUrl}
                    alt=""
                    className="w-20 h-20 md:w-28 md:h-28 shrink-0 object-cover overflow-hidden rounded-full cursor-pointer mr-3"
                    onClick={() => openFileInput("image")}
                  />
                )}
                <div className="flex flex-col">
                  <div className="">
                    <h1 className="font-bold text-lg">{sub.title}</h1>
                    <h1 className="text-sm">{sub.name}</h1>
                  </div>
                  {/* 현재 유저와 서브의 유저가 동일할 때만 삭제 버튼 렌더링 */}
                  <div className="">
                    {(ownSub || isAdmin) && (
                      <button
                        className="bg-red-400 text-white text-sm px-3 py-1 md:py-2 w-fit h-fit mt-1 rounded-full hover:opacity-60 mr-2"
                        onClick={() => deleteSub(subName)}
                      >
                        삭제하기
                      </button>
                    )}
                    <button
                      className="bg-blue-400 text-white text-sm px-3 py-1 md:py-2 w-fit h-fit mt-1 rounded-full hover:opacity-60"
                      onClick={() => followSub(subName)}
                    >
                      팔로우하기
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-5 px-2">
                <div className="flex flex-col mb-2">
                  <div className="flex flex-row items-center mr-4">
                    <p className="mb-1 mr-4">
                      🎂 {dayjs(sub?.createdAt).format("YYYY년 MM월 DD일")}
                    </p>
                    <p className="text-sm text-gray-500 mr-1">by</p>
                    <Link
                      href={`/u/${sub.username}`}
                      className="cursor-pointer hover:font-bold"
                    >
                      <p>@ {sub?.username}</p>
                    </Link>
                  </div>
                  <div className="flex flex-row">
                    <div className="flex flex-row items-center mr-5">
                      <p>{sub?.postCount || 0}</p>
                      <p className="text-sm text-gray-500">
                        개의 포스트가 있어요.
                      </p>
                    </div>
                    <div className="flex flex-row items-center">
                      <p>{sub?.joinedUsers?.length || 0}</p>
                      <p className="text-sm text-gray-500">명이 함께 합니다.</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-gray-600 md:max-w-xl mb-2">
                  {sub?.description}
                </p>
                <div className="mb-4">
                  <Link
                    href={`/c/${sub?.name}/new`}
                    className="px-2 py-1 bg-gray-200 cursor-pointer hover:font-bold rounded-full text-sm"
                  >
                    이 커뮤니티에 포스트 생성하기 ✏️
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-gray-300 grid md:grid-cols-2 grid-cols-1 gap-1">
        {renderPosts}
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

export default SubsDetail;

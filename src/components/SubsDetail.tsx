"use client";
import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";
import { useAuthState } from "@/context/auth";
import SubsSideBar from "./SubsSideBar";
import SubsPostList from "./SubsPostCard";
import { useSearchParams } from "next/navigation";
import { Post } from "@/types";
import SubsPostCard from "./SubsPostCard";

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

  const {
    data: sub,
    error,
    mutate,
  } = useSWR(
    subName ? `http://localhost:4000/api/subs/${subName}` : null,
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
    renderPosts = <p>로딩 중입니다.</p>;
  } else if (sub.posts.length === 0) {
    renderPosts = <p>작성된 포스트가 없습니다.</p>;
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

  return (
    <div className="w-full flex flex-col">
      <div className="w-full">
        {/* 현재 유저와 서브의 유저가 동일할 때만 삭제 버튼 렌더링 */}
        {(ownSub || isAdmin) && (
          <button
            className="bg-blue-500 p-1 text-white"
            onClick={() => deleteSub(subName)}
          >
            삭제하기
          </button>
        )}
        <button
          className="bg-red-400 text-white px-2 py-1 ml-3"
          onClick={() => followSub(subName)}
        >
          팔로우하기
        </button>
        {/* 존재하지 않을 때 컴포넌트 랜더링 */}
        {sub && (
          <div className="">
            <div className="">
              <input
                type="file"
                hidden={true}
                ref={fileInputRef}
                onChange={uploadImage}
              />
              <div className="bg-gray-400">
                {sub.bannerUrl ? (
                  <img
                    src={sub.bannerUrl}
                    alt=""
                    className="w-full h-40 cursor-pointer object-cover"
                    onClick={() => openFileInput("banner")}
                  />
                ) : (
                  // <div
                  //   className="h-56 w-full"
                  //   style={{
                  //     backgroundImage: `url(${sub.bannerUrl})`,
                  //     backgroundRepeat: "no-repeat",
                  //     backgroundSize: "cover",
                  //     backgroundPosition: "center",
                  //   }}
                  //   onClick={() => openFileInput("banner")}
                  // ></div>
                  <div
                    className="h-40 w-full bg-blue-200 object-cover cursor-pointer"
                    onClick={() => openFileInput("banner")}
                  ></div>
                )}
              </div>
              <div>
                {sub.imageUrl && (
                  <img
                    src={sub.imageUrl}
                    alt=""
                    className="w-20 h-20 rounded-full cursor-pointer"
                    onClick={() => openFileInput("image")}
                  />
                )}
              </div>
              <div>
                <h1 className="font-bold text-lg">{sub.title}</h1>
                <h1 className="text-sm">{sub.name}</h1>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-row">
        <div className="w-4/5">{renderPosts}</div>
        <div className="w-1/5">
          <SubsSideBar sub={sub} />
        </div>
      </div>
    </div>
  );
}

export default SubsDetail;

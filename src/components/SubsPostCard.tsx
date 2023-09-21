"use client";
import { Post } from "@/types";
import classNames from "classnames";
import Link from "next/link";
import React from "react";
import dayjs from "dayjs";
import { useAuthState } from "@/context/auth";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";

type Props = {
  post: Post;
  subMutate?: () => void;
};

function SubsPostCard({ post, subMutate }: Props) {
  const router = useRouter();
  const pathname = decodeURIComponent(usePathname());
  const isInSubPage = pathname.includes("/c/");

  const { authenticated } = useAuthState();
  const vote = async (value: number) => {
    if (!authenticated) router.push("/login");

    if (value === post.userVote) value = 0;

    let identifier = post.identifier;

    try {
      await axios.post("http://localhost:4000/api/votes", {
        identifier,
        value,
      });
      if (subMutate) subMutate();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="border border-gray-400 p-2 m-1 w-full">
      <p>포스트 카드</p>
      <div className="w-full">
        {post.sub && (
          <img src={post.sub.imageUrl} alt="" className="w-10 h-10" />
        )}
        <Link
          href={`/c/${post.subname}/${post.identifier}`}
          className="hover:opacity-50 cursor-pointer"
        >
          1: {post.title}
        </Link>
        <p dangerouslySetInnerHTML={{ __html: `바디 : ${post.body}` }}></p>
        {/* <p className="text-sm">2 : {post.body}</p> */}
        <p className="text-sm">3 : {post.commentCount}</p>
        <p className="text-sm">
          4 : {dayjs(post.createdAt).format("YYYY.MM.DD")}
        </p>
        <p className="text-sm">5 : {post.identifier}</p>
        <p className="text-sm">6 섭 네임 : {post.subname}</p>

        <Link
          href={`/u/${post.username}`}
          className="text-sm font-bold text-red-500"
        >
          {post.username}
        </Link>
      </div>

      <div className="flex flex-col items-start m-2">
        <button
          className={classNames("m-1", {
            "text-red-500": post.userVote === 1,
          })}
          onClick={() => vote(1)}
        >
          좋아요
        </button>
        <p>{post.voteScore}</p>
        <button
          className={classNames("m-1", {
            "text-blue-500": post.userVote === -1,
          })}
          onClick={() => vote(-1)}
        >
          싫어요
        </button>
        {isInSubPage && (
          <div className="my-2">이 페이지는 subs내에 있습니다.</div>
        )}
      </div>
    </div>
  );
}

export default SubsPostCard;

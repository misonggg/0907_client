"use client";
import { Post } from "@/types";
import classNames from "classnames";
import Link from "next/link";
import React from "react";
import dayjs from "dayjs";
import { useAuthState } from "@/context/auth";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import {
  FcHome,
  FcDislike,
  FcLike,
  FcDownRight,
  FcVoicePresentation,
} from "react-icons/fc";

type Props = {
  post: Post;
  subMutate?: () => void;
};

function SubsPostCard({ post, subMutate }: Props) {
  const router = useRouter();
  const pathname = decodeURIComponent(usePathname());

  const { authenticated } = useAuthState();
  const vote = async (value: number) => {
    if (!authenticated) {
      const confirmation = window.confirm(
        "로그인이 필요합니다. 로그인하시겠습니가?"
      );
      if (confirmation) {
        router.push("/login");
      }
      return;
    }

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
    <div className="w-full p-3 border-b border-gray-300 items-center">
      <div className="flex flex-col">
        <Link href={`/c/${post.subname}/${post.identifier}`} className="mb-1">
          <p className="w-full block font-semibold line-clamp-1 truncate">
            {post.title}
          </p>
          <p className="w-full block text-sm line-clamp-1 truncate">
            {post.body}
          </p>
        </Link>
        <div className="flex">
          <div>
            <p className="cursor-pointer mr-8 flex items-center">
              <FcVoicePresentation className="mr-1 text-xl" />
              <p className="">댓글 {post.commentCount}</p>
            </p>
          </div>
          <div className="flex items-center">
            <button
              className={classNames("hover:opacity-50 text-lg", {
                "bg-red-200 p-0.5 rounded-full": post.userVote === 1,
              })}
              onClick={() => vote(1)}
            >
              <FcLike />
            </button>
            <p className="px-2">{post.voteScore}</p>
            <button
              className={classNames("hover:opacity-50 text-lg", {
                "bg-blue-200 p-0.5 rounded-full": post.userVote === -1,
              })}
              onClick={() => vote(-1)}
            >
              <FcDislike />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubsPostCard;

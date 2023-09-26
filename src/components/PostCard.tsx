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

function PostCard({ post, subMutate }: Props) {
  const router = useRouter();
  const pathname = decodeURIComponent(usePathname());
  // const isInSubPage = pathname.includes("/c/");

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
    <div className="w-full p-3 border-b border-gray-300 max-h-[1300px] object-cover overflow-hidden items-center">
      <div className="w-full">
        {post.sub && (
          <div className="flex flex-row justify-between md:items-center mb-2">
            <div className="flex flex-row items-center mb-1 md:mb-0">
              <img
                src={post.sub.imageUrl}
                alt="서브 이미지"
                className="w-10 h-10 rounded-full mr-1"
              />
              <Link href={`/u/${post.username}`} className="font-bold">
                {post.username}
              </Link>
            </div>
            <div className="flex flex-row items-center">
              <div className="md:block hidden">
                <div className="flex flex-row items-center mr-5 bg-gray-100 px-2 rounded-full">
                  <FcHome className="mr-1" />
                  <Link href={`/c/${post.subname}`}>
                    <p className="mr-0.5 hover:font-bold cursor-pointer">
                      {post.subname}
                    </p>
                  </Link>
                  <p className="text-xs">에서 쓰여짐</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                {dayjs(post.createdAt).format("HH:MM YYYY-MM-DD")}
              </p>
            </div>
          </div>
        )}
        <div className="flex flex-col mb-6">
          <p className="py-1 font-semibold mb-2">{post.title}</p>
          <Link
            href={`/c/${post.subname}/${post.identifier}`}
            className="cursor-pointer"
          >
            <p
              id="gradientFade"
              dangerouslySetInnerHTML={{ __html: `${post.body}` }}
              className="md:text-sm max-h-[301px] md:max-h-[601px] overflow-hidden relative"
            ></p>

            {/* 그라디언트 테스트 */}
            {/* <p
              // id="gradientFade"
              className="md:hidden block z-20 absolute bottom-0"
            >
              dd
            </p> */}
          </Link>
        </div>
        <div className="flex flex-col md:flex-row items-center w-full">
          <div className="block md:hidden w-full">
            <div className="flex flex-row items-center w-fit mr-5 mb-1 justify-start bg-gray-100 px-2 rounded-full">
              <FcHome className="mr-1" />
              <Link href={`/c/${post.subname}`}>
                <p className="mr-0.5 hover:font-bold cursor-pointer">
                  {post.subname}
                </p>
              </Link>
              <p className="text-xs">에서 쓰여짐</p>
            </div>
          </div>
          <div className="flex w-full">
            <Link
              href={`/c/${post.subname}/${post.identifier}`}
              className="cursor-pointer mr-8 flex items-center"
            >
              <FcVoicePresentation className="mr-1 text-xl" />
              <p className="">댓글 {post.commentCount}</p>
            </Link>
            <div className="flex items-center">
              <button
                className={classNames("hover:opacity-50 text-lg", {
                  "bg-red-200 p-0.5 rounded-full": post.userVote === 1,
                })}
                onClick={() => vote(1)}
              >
                <FcLike className={classNames()} />
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
      <style jsx>{`
        #gradientFade {
          position: relative;
          overflow: hidden;
        }

        #gradientFade::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 40px;
          background: linear-gradient(
            rgba(255, 255, 255, 0),
            rgba(255, 255, 255, 1)
          );
        }
      `}</style>
    </div>
  );
}

export default PostCard;

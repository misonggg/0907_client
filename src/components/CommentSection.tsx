"use client";
import { Comment } from "@/types";
import Link from "next/link";
import React from "react";
import dayjs from "dayjs";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuthState } from "@/context/auth";
import { BiSolidCoffeeTogo, BiSolidEditAlt } from "react-icons/bi";
import {
  FcHome,
  FcDislike,
  FcLike,
  FcDownRight,
  FcVoicePresentation,
} from "react-icons/fc";

type Props = {
  comment: Comment;
  vote: (value: number, comment?: Comment) => void;
  postIdentifier: string;
  mutate: () => void;
};
function CommentSection({ comment, vote, postIdentifier, mutate }: Props) {
  const router = useRouter();
  const { authenticated, user } = useAuthState();
  const deleteComment = async (commentIdentifier: any) => {
    const confirmation = window.confirm("정말로 삭제하시겠습니까?");

    if (confirmation) {
      try {
        await axios.delete(
          `http://localhost:4000/api/posts/${postIdentifier}/comments`,
          {
            data: { identifier: commentIdentifier },
          }
        );

        mutate();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const editCommentPage = async () => {
    router.push(`/comment/edit/${comment.identifier}`);
  };

  return (
    <div className="border-b border-gray-200 px-3 py-2 relative bg-white">
      <div className="flex" key={comment.identifier}>
        <div className="flex flex-col">
          <div className="flex flex-col">
            <div className="flex flex-row items-center">
              {/* 추후 유저 이미지로 대체 */}
              <p className="w-4 h-4 md:w-6 md:h-6 bg-gray-200 rounded-full mr-1"></p>
              <p className="font-semibold mr-4">{comment.username}</p>
              <p className="text-xs text-gray-400">
                {dayjs(comment.createdAt).format("MM/DD HH:mm")}
              </p>
            </div>
            <p className="text-sm py-1">{comment.body}</p>
          </div>

          {authenticated && comment.username === user?.username && (
            <div>
              <button
                className="bg-red-300 p-1 text-white w-fit mr-2 text-sm rounded-full hover:bg-red-400"
                onClick={() => deleteComment(comment.identifier)}
              >
                <BiSolidCoffeeTogo />
              </button>
              <button
                className="bg-blue-300 p-1 text-white w-fit mr-2 text-sm rounded-full hover:bg-blue-400"
                onClick={() => editCommentPage()}
              >
                <BiSolidEditAlt />
              </button>
            </div>
          )}
        </div>
        {/* <div className="flex items-center absolute right-2">
          <button
            className={classNames("hover:opacity-50 text-lg", {
              "bg-red-200 p-0.5 rounded-full": comment.userVote === 1,
            })}
            onClick={() => vote(1)}
          >
            <FcLike />
          </button>
          <p className="px-2">{comment.voteScore}</p>
          <button
            className={classNames("hover:opacity-50 text-lg", {
              "bg-blue-200 p-0.5 rounded-full": comment.userVote === -1,
            })}
            onClick={() => vote(-1)}
          >
            <FcDislike />
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default CommentSection;

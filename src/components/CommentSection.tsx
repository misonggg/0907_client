"use client";
import { Comment } from "@/types";
import Link from "next/link";
import React from "react";
import dayjs from "dayjs";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuthState } from "@/context/auth";

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
    <div>
      <div
        className="flex flex-row border border-gray-300 m-1 w-full"
        key={comment.identifier}
      >
        <div className="flex flex-col w-4/5">
          <Link href={`/u/${comment.username}`}>{comment.username}</Link>
          <p>{comment.voteScore}</p>
          <p>포스트 identifier : {comment.post?.identifier}</p>
          <p>{dayjs(comment.createdAt).format("YYYY-MM-DD HH:mm")}</p>
          <p>{comment.body}</p>
          <p>{comment.identifier}</p>
          <p className="text-blod text-red-400">{comment.userVote}</p>
          {authenticated && comment.username === user?.username && (
            <div>
              <button
                className="bg-blue-500 p-1 text-white w-20 mr-4"
                onClick={() => deleteComment(comment.identifier)}
              >
                삭제하기
              </button>
              <button
                className="bg-blue-500 p-1 text-white w-20"
                onClick={() => editCommentPage()}
              >
                수정하기
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col w-1/5 items-center">
          <button
            className={classNames("m-1", {
              "text-red-500": comment.userVote === 1,
            })}
            onClick={() => vote(1, comment)}
          >
            좋아요
          </button>
          <p>{comment.voteScore}</p>
          <button
            className={classNames("m-1", {
              "text-blue-500": comment.userVote === -1,
            })}
            onClick={() => vote(-1, comment)}
          >
            싫어요
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommentSection;

"use client";
import { Comment } from "@/types";
import Link from "next/link";
import React, { FormEvent, useState } from "react";
import dayjs from "dayjs";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuthState } from "@/context/auth";
import { BiSolidCoffeeTogo, BiSolidEditAlt } from "react-icons/bi";
import { IoMdReturnRight } from "react-icons/io";

type Props = {
  comment: Comment;
  vote: (value: number, comment?: Comment) => void;
  postIdentifier: string;
  mutate: () => void;
};
function CommentSection({ comment, vote, postIdentifier, mutate }: Props) {
  const router = useRouter();
  const { authenticated, user } = useAuthState();
  const [newComment, setNewComment] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false); // 대댓글 작성 폼 표시 여부
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

  const editCommentPage = (identifier: string) => {
    router.push(`/comment/edit/${identifier}`);
  };

  // axios 요청은 'http://loacalhost:4000/api/posts/${identifier}/comments/${parentId}로 보낼 거임'
  const handleReplyComment = async (e: FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === "") {
      return;
    }

    try {
      // axios 요청으로 대댓글을 서버에 저장합니다.
      await axios.post(
        `http://localhost:4000/api/posts/${postIdentifier}/comments/${comment.identifier}`,
        {
          body: newComment,
          parentId: comment.identifier,
        }
      );

      // 대댓글이 성공적으로 저장된 후, UI를 업데이트합니다.
      mutate();
      setNewComment("");
      toggleReplyComment();
    } catch (error) {
      console.error("대댓글 작성 중 에러가 발생했습니다:", error);
    }
  };

  const toggleReplyComment = () => {
    setShowReplyForm(!showReplyForm); // 대댓글 작성 폼 표시 상태를 토글합니다.
  };

  return (
    <div className="border-b border-gray-200 px-3 py-2 relative bg-white w-full">
      <div className="flex" key={comment.identifier}>
        <div className="flex flex-col">
          <div className="flex flex-col">
            <div className="flex flex-row items-center w-full">
              {/* 추후 유저 이미지로 대체하려면 하고 빼려면 뺌 */}
              {/* <p className="w-4 h-4 md:w-6 md:h-6 bg-gray-200 rounded-full mr-1"></p> */}
              <p className="font-semibold mr-4">{comment.username}</p>
              <p className="text-xs text-gray-400">
                {dayjs(comment.createdAt).format("MM/DD HH:mm")}
              </p>
            </div>
            <p className="text-sm py-1 w-full">{comment.body}</p>
            {/* 대댓글 랜더링 */}
            {comment.childComments?.map((childComment: Comment) => (
              <div className="ml-3 py-2" key={childComment.identifier}>
                <div className="flex flex-row">
                  <div className="w-4 items-center shrink-0 mr-1 text-gray-300 mt-1">
                    <IoMdReturnRight />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <p className="font-semibold mr-3">
                        {childComment.username}
                      </p>
                      <p className="text-xs text-gray-400">
                        {dayjs(childComment.createdAt).format("MM/DD HH:mm")}
                      </p>
                    </div>
                    <p className="text-sm py-1">{childComment.body}</p>
                  </div>
                </div>

                {/* 대댓글 삭제 */}
                {authenticated && comment.username === user?.username && (
                  <div className="ml-6">
                    <button
                      className="bg-red-300 p-1 text-white w-fit mr-2 text-sm rounded-full hover:bg-red-400"
                      onClick={() => deleteComment(childComment.identifier)}
                    >
                      <BiSolidCoffeeTogo />
                    </button>
                    <button
                      className="bg-blue-300 p-1 text-white w-fit mr-2 text-sm rounded-full hover:bg-blue-400"
                      onClick={() => editCommentPage(childComment.identifier)}
                    >
                      <BiSolidEditAlt />
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div className="w-full">
              <button
                className="text-xs mb-1 text-blue-400"
                onClick={toggleReplyComment}
              >
                {showReplyForm ? "대댓글창 닫기" : "대댓글 달기"}
              </button>
              {showReplyForm && ( // 대댓글 작성 폼의 표시 여부를 기반으로 조건부 렌더링합니다.
                <form
                  onSubmit={handleReplyComment}
                  className="flex flex-col w-full"
                >
                  <textarea
                    className="w-full border border-gray-300 rounded-md bg-gray-100 p-1 md:p-2 focus:outline-none focus:border-black"
                    onChange={(e) => setNewComment(e.target.value)}
                    value={newComment}
                  ></textarea>
                  <button
                    className="bg-blue-400 text-sm text-white px-3 py-1 rounded-full w-fit self-end mt-2"
                    disabled={newComment.trim() === ""}
                  >
                    대댓글 게시하기
                  </button>
                </form>
              )}
            </div>
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
                onClick={() => editCommentPage(comment.identifier)}
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

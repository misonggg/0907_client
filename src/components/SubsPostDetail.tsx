"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import useSWR from "swr";
import { Comment, Post } from "@/types";
import SubsSideBar from "./SubsSideBar";
import Link from "next/link";
import dayjs from "dayjs";
import { useAuthState } from "@/context/auth";
import classNames from "classnames";
import CommentSection from "./CommentSection";
import {
  FcHome,
  FcDislike,
  FcLike,
  FcDownRight,
  FcVoicePresentation,
} from "react-icons/fc";

function SubsPostDetail() {
  const { authenticated, user, isAdmin } = useAuthState();
  const [newComment, setNewComment] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const identifier = pathname.split("/").pop() || "";
  // const sub = decodeURIComponent(pathname.split("/").slice(2, -1).join("/"));
  const [ownSub, setOnSub] = useState(false);

  const apiUrl = identifier
    ? `http://localhost:4000/api/posts/${identifier}`
    : null;

  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };

  // 포스트 가져오는 부분
  const {
    data: post,
    error,
    mutate: postMutate,
  } = useSWR<Post>(apiUrl, fetcher);

  // 코멘트 가져오는 부분
  const { data: comments, mutate: commentMutate } = useSWR<Comment[]>(
    `${apiUrl}/comments`,
    fetcher
  );

  useEffect(() => {
    if (!post || !user) return;
    setOnSub(authenticated && user.username === post.username);
  }, [post]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === "") {
      return;
    }

    try {
      await axios.post(
        `http://localhost:4000/api/posts/${post?.identifier}/comments`,
        {
          body: newComment,
        }
      );
      commentMutate();
      setNewComment("");
    } catch (error) {
      console.log(error);
    }
  };

  const vote = async (value: number, comment?: Comment) => {
    // 로그인 여부 확인
    if (!authenticated) {
      const confirmation = window.confirm(
        "로그인이 필요합니다. 로그인하시겠습니까?"
      );
      if (confirmation) {
        // 확인을 누르면 로그인 페이지로 이동
        router.push("/login");
      }
      return; // 투표 처리를 중단
    }

    // 이미 클릭한 vote 버튼을 누르면 reset
    if (
      (!comment && value === post?.userVote) ||
      (comment && comment.userVote === value)
    ) {
      value = 0;
    }

    try {
      await axios.post("http://localhost:4000/api/votes", {
        identifier,
        commentIdentifier: comment?.identifier,
        value,
      });
      postMutate();
      commentMutate();
    } catch (error) {
      console.log(error);
    }
  };

  const deletePost = async (postIdentifier: any) => {
    const confirmation = window.confirm("정말로 삭제하시겠습니까?");

    if (confirmation) {
      try {
        await axios.delete(
          `http://localhost:4000/api/posts/${post?.identifier}`
        );
        router.push("/");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const editPostPage = async () => {
    router.push(`${pathname}/edit`);
  };

  return (
    <div className="flex flex-row w-full">
      <div className="md:w-4/5 w-full flex flex-col">
        <div className="p-2 flex flex-col">
          {post && (
            <div className="flex flex-col">
              <div className="flex flex-row mb-3">
                <div className="flex flex-row px-2 py-1 bg-gray-200 w-fit rounded-full items-center mr-2">
                  <img
                    src={post.sub?.imageUrl}
                    alt="포스트 커뮤니티 이미지"
                    className="w-6 h-6 rounded-full mr-1"
                  />
                  <Link
                    href={`/c/${post.subname}`}
                    className="text-sm hover:underline"
                  >
                    {post.subname}
                  </Link>
                </div>
                <p className="font-semibold md:text-lg">{post.title}</p>
              </div>
              <div className="flex flex-row items-center pb-3 border-b border-gray-300">
                <div className="flex flex-row items-center mr-3 pl-2">
                  {/* 나중에 유저 이미지로 바꿔주기 */}
                  <img
                    src={post.sub?.imageUrl}
                    alt="포스트 커뮤니티 이미지"
                    className="w-6 h-6 rounded-full mr-1"
                  />
                  <Link
                    href={`/u/${post.username}`}
                    className="font-semibold text-sm hover:underline"
                  >
                    {post.username}
                  </Link>
                </div>
                <p className="text-gray-400 text-sm mr-3">
                  {dayjs(post.createdAt).format("YYYY-MM-DD HH:mm")}
                </p>
                <p className="text-sm">📍 {post.voteScore}</p>
              </div>
              <div className="py-3">
                {(ownSub || isAdmin) && (
                  <div className="flex justify-end mb-2">
                    <button
                      className="bg-red-400 px-2 py-1 text-white w-fit mr-2 text-sm rounded-full"
                      onClick={() => deletePost(post?.identifier)}
                    >
                      삭제하기
                    </button>
                    <button
                      className="bg-blue-500 px-2 py-1 text-white w-fit text-sm rounded-full"
                      onClick={() => editPostPage()}
                    >
                      수정하기
                    </button>
                  </div>
                )}
                <p
                  dangerouslySetInnerHTML={{ __html: `${post.body}` }}
                  className=""
                ></p>
              </div>
            </div>
          )}
          {/* <div className="flex items-center mt-3 justify-center">
            <button
              onClick={() => vote(1)}
              className="flex hover:opacity-50 items-center"
            >
              <p className="text-xs mr-1">좋아요</p>
              <FcLike
                className={classNames(
                  "text-3xl flex items-center p-1 bg-white rounded-full",
                  {
                    "bg-red-200 ": post?.userVote === 1,
                  }
                )}
              />
            </button>
            <p className="px-3 text-xl">{post?.voteScore}</p>
            <button
              onClick={() => vote(-1)}
              className="flex hover:opacity-50 items-center"
            >
              <FcDislike
                className={classNames(
                  "text-3xl items-center p-1 bg-white rounded-full",
                  {
                    "bg-blue-200": post?.userVote === -1,
                  }
                )}
              />
              <p className="text-xs ml-1">싫어요</p>
            </button>
          </div> */}
          <div className="flex items-center mt-3 justify-center">
            <button
              className={classNames(
                "hover:opacity-50 flex items-center px-2 py-1",
                {
                  "bg-red-100  rounded-full": post?.userVote === 1,
                }
              )}
              onClick={() => vote(1)}
            >
              <p className="text-xs mr-1">좋아요</p>
              <FcLike className="text-3xl" />
            </button>
            <p className="px-2">{post?.voteScore}</p>
            <button
              className={classNames(
                "hover:opacity-50 flex items-center px-2 py-1",
                {
                  "bg-blue-100 rounded-full": post?.userVote === -1,
                }
              )}
              onClick={() => vote(-1)}
            >
              <FcDislike className="text-3xl" />
              <p className="text-xs ml-1">싫어요</p>
            </button>
          </div>
        </div>

        {/* 댓글 */}
        <div className="p-1 w-full">
          {/* 댓글 리스트 */}
          {post &&
            comments
              ?.filter((c) => c.parentId === null)
              .map((comment) => (
                <CommentSection
                  comment={comment}
                  vote={vote}
                  postIdentifier={post!.identifier}
                  mutate={commentMutate}
                  key={comment.identifier}
                />
              ))}
          {authenticated ? (
            <div className="my-4 px-2">
              <div className="flex items-center px-2">
                <Link href={`/u/${user?.username}`} className="hover:underline">
                  {user?.username}
                </Link>
                <p className="text-gray-400 text-sm">으로 댓글 작성</p>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col">
                <textarea
                  className="w-full border border-gray-300 rounded-md bg-gray-100 p-1 md:p-2 focus:outline-none focus:border-black"
                  onChange={(e) => setNewComment(e.target.value)}
                  value={newComment}
                ></textarea>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded-full w-fit self-end mt-2"
                  disabled={newComment.trim() == ""}
                >
                  게시하기
                </button>
              </form>
            </div>
          ) : (
            <div className="p-4">
              <p className=" text-gray-500">로그인을 하고 댓글을 남겨보세용.</p>
              <Link href="/login" className="text-blue-500">
                로그인하러 가기
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="w-1/5 hidden md:block">
        {post?.sub && <SubsSideBar sub={post.sub} />}
      </div>
    </div>
  );
}

export default SubsPostDetail;

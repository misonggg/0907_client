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
    <div className="flex flex-col w-full">
      {(ownSub || isAdmin) && (
        <div>
          <button
            className="bg-blue-500 p-1 text-white w-20 mr-2"
            onClick={() => deletePost(post?.identifier)}
          >
            삭제하기
          </button>
          <button
            className="bg-blue-500 p-1 text-white w-20"
            onClick={() => editPostPage()}
          >
            수정하기
          </button>
        </div>
      )}
      <button>팔로우</button>
      <div className="w-4/5 p-3 m-10 border border-gray-400 flex flex-col">
        {post && (
          <>
            <p dangerouslySetInnerHTML={{ __html: `바디 : ${post.body}` }}></p>
            <p>코멘트 카운트 : {post.commentCount}</p>
            <p>유저 보트 : {post.userVote}</p>
            <p>아이덴티피어 : {post.identifier}</p>
            <p>슬러그 : {post.slug}</p>
            <p>{dayjs(post.createdAt).format("YYYY-MM-DD HH:mm")}</p>
            <p>섭네임 : {post.sub?.name}</p>
            <p>포스트 타이틀 : {post.title}</p>
            <Link href={`/u/${post.username}`} className="hover:underline">
              쓴 사람 : {post.username}
            </Link>
          </>
        )}
        <div className="flex flex-col items-center">
          <button
            className={classNames("m-1", {
              "text-red-500": post?.userVote === 1,
            })}
            onClick={() => vote(1)}
          >
            좋아요
          </button>
          <p>{post?.voteScore}</p>
          <button
            className={classNames("m-1", {
              "text-blue-500": post?.userVote === -1,
            })}
            onClick={() => vote(-1)}
          >
            싫어요
          </button>
        </div>
      </div>
      {/* 댓글 */}
      <div className="flex flex-col border border-gray-400 m-2 p-2">
        {authenticated ? (
          <div>
            <Link href={`/u/${user?.username}`} className="hover:underline">
              유저네임 {user?.username}으로 댓글 작성
            </Link>
            <form onSubmit={handleSubmit}>
              <textarea
                className="w-full border border-gray-400 focus:outline-none focus:border-black"
                onChange={(e) => setNewComment(e.target.value)}
                value={newComment}
              ></textarea>
              <button
                className="bg-gray-500 text-white px-2 py-1"
                disabled={newComment.trim() == ""}
              >
                게시하기
              </button>
            </form>
          </div>
        ) : (
          <div>
            <p>로그인을 하고 댓글을 남겨보세용.</p>
            <Link href="/login">로그인하러 가기</Link>
          </div>
        )}
      </div>
      {/* 댓글 리스트 */}
      {post &&
        comments?.map((comment) => (
          <CommentSection
            comment={comment}
            vote={vote}
            postIdentifier={post!.identifier}
            mutate={commentMutate}
            key={comment.identifier}
          />
        ))}

      <div className="w-1/5">{post?.sub && <SubsSideBar sub={post.sub} />}</div>
    </div>
  );
}

export default SubsPostDetail;

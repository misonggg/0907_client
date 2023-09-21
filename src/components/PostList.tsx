"use client";
import { Post } from "@/types";
import React, { useState } from "react";
import useSWRInfinite from "swr/infinite";
import useSWR, { mutate } from "swr";
import axios from "axios";
import SubsPostCard from "./SubsPostCard";

function PostList() {
  // 무한 로딩 부분
  // const getKey = (pageIndex: number, previousPageData: Post[]) => {
  //   if (previousPageData && !previousPageData.length) return null;
  //   const endpoint = `http://localhost:4000/api/posts?page=${pageIndex}`;
  //   return endpoint;
  // };

  // const {
  //   data,
  //   error,
  //   size: page,
  //   setSize: setPage,
  //   isValidating,
  //   mutate,
  // } = useSWRInfinite<Post[]>(getKey);

  // 페이지네이션
  const [pageIndex, setPageIndex] = useState(0);
  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };

  const { data, error, mutate } = useSWR(
    `http://localhost:4000/api/posts?page=${pageIndex}`,
    fetcher
  );

  const isInitialLoading = !data && !error; // 데이터와 에러가 없다면 받아오는 중이니 로딩임
  //DB에서 가져온 데이터를 포스트에 넣어줌
  const posts: Post[] = data ? ([] as Post[]).concat(...data) : [];

  const currentPage = pageIndex + 1;

  return (
    <div className="w-full">
      {isInitialLoading && <p>로딩 중</p>}
      {/* 무한 로딩 부분 */}
      {/* {posts?.map((post) => (
        <SubsPostCard post={post} key={post.identifier} />
      ))} */}
      <div className="flex flex-col">
        {posts?.map((post) => (
          <div key={post.identifier}>
            <SubsPostCard
              post={post}
              key={post.identifier}
              subMutate={mutate}
            />
          </div>
        ))}
        <div className="flex flex-row">
          <button
            onClick={() => {
              if (pageIndex > 0) {
                setPageIndex(pageIndex - 1);
              }
            }}
            className="p-2 bg-blue-500 text-white"
          >
            Previous
          </button>
          <p className="text-bold p-2 mx-5">{currentPage}</p>
          <button
            onClick={() => setPageIndex(pageIndex + 1)}
            className="p-2 bg-blue-500 text-white"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostList;

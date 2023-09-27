"use client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { usePathname } from "next/navigation";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { FcSearch } from "react-icons/fc";
import Link from "next/link";

function SearchPage() {
  const pathname = usePathname();
  const pathParts = pathname.split("search/");
  const searchKeyword = pathParts[1];
  const keyword = decodeURIComponent(searchKeyword);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const fetcher = async (url: string) => {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  };

  const apiUrl = `http://localhost:4000/api/search/${keyword}`;

  const { data, error, mutate } = useSWR<any>(apiUrl, fetcher);

  const handleSearch = async () => {
    router.push(`/search/${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="w-full flex-grow md:max-w-lg pt-2 px-2 mx-auto">
      <div className="w-full">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="mb-6"
        >
          <div className="flex items-center mb-3">
            <FcSearch className="text-xl mr-2" />
            <p className="font-semibold">
              찾고 싶은 유저 또는 커뮤니티를 입력해보세요.
            </p>
          </div>
          <input
            type="text"
            placeholder="검색어를 입력하세요."
            className="border border-blue-500 focus:outline-none rounded-full px-3 py-1 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div>
          <p className="mb-2">😎 유저 검색 결과</p>
          {/* 검색 결과가 없을 경우 대비해서 조건부 렌더링 */}
          {data?.users.length > 0 ? (
            data.users.map((user: any) => (
              <div
                key={user.id}
                className="border-b border-gray-400 py-2 flex flex-row items-center mb-2"
              >
                <img
                  src={user.imageUrl}
                  alt="유저이미지"
                  className="h-12 w-12 object-cover rounded-full mr-2"
                />
                <div className="flex flex-col">
                  <Link
                    href={`/u/${user.username}`}
                    className="font-semibold hover:underline"
                  >
                    {user.username}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {dayjs(user.createdAt).format("YYYY년 MM월 DD일 가입")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="py-1 text-gray-400">검색 결과가 없습니다. 😵</p>
          )}
          <p className="mt-10 mb-2">😎 커뮤니티 검색 결과</p>
          {/* 검색 결과가 없을 경우 대비해서 조건부 렌더링 */}
          {data?.subs.length > 0 ? (
            data.subs.map((sub: any) => (
              <div
                key={sub.id}
                className="border-b border-gray-400 py-2 flex flex-row items-center mb-2"
              >
                <img
                  src={sub.imageUrl}
                  alt="커뮤니티 이미지"
                  className="h-12 w-12 object-cover rounded-full mr-2"
                />
                <div className="flex flex-col">
                  <div className="flex">
                    <Link
                      href={`/c/${sub.name}`}
                      className="font-semibold hover:underline mr-2"
                    >
                      {sub.name}
                    </Link>
                    <p>[ 👨‍👩‍👧‍👧 {sub.joinedUsers?.length || 0} ]</p>
                  </div>
                  <p className="text-sm text-gray-500">
                    {dayjs(sub.createdAt).format("YYYY년 MM월 DD일 생성")}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="py-1 text-gray-400">검색 결과가 없습니다. 😵</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;

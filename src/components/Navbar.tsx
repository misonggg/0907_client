"use client";
import { useAuthDispatch, useAuthState } from "@/context/auth";
import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { FcSearch } from "react-icons/fc";
import { FaStream } from "react-icons/fa";
import { FaX } from "react-icons/fa6";

function Navbar() {
  const { loading, authenticated, user } = useAuthState();
  const dispatch = useAuthDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogOut = () => {
    axios
      .post("http://localhost:4000/api/auth/logout")
      .then(() => {
        dispatch("LOGOUT");
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSearch = async () => {
    router.push(`/search/${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="flex justify-between p-2 relative h-12 md:h-14 items-center ">
      <Link href="/" className="text-2xl ml-3 font-bold">
        TAR
      </Link>

      {/* 피씨용 */}
      <div className="flex">
        <div className="hidden md:block">
          <div className="border border-blue-500 rounded-full flex items-center">
            <FcSearch className="text-xl ml-1" />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <input
                type="text"
                placeholder="유저 또는 커뮤니티 검색"
                className="text-sm focus:outline-none rounded-full px-1 py-2 w-30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        </div>
      </div>
      <div className="hidden md:block">
        <div className="flex">
          {user && (
            <div className="flex flex-row items-center mr-10">
              <img
                src={user?.imageUrl}
                className="w-10 h-10 rounded-full object-cover mr-1"
              />
              <div className="flex flex-col">
                <p className="font-semibold">{user?.username}</p>
                <p className="text-gray-500 text-xs">{user?.email}</p>
              </div>
            </div>
          )}
          {authenticated ? (
            <button
              onClick={handleLogOut}
              className="bg-red-400 text-white px-2 py-1 text-sm rounded-full mx-1"
            >
              로그아웃
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="bg-blue-400 text-white px-2 py-1 text-sm rounded-full mx-1"
              >
                로그인
              </Link>
              <Link
                href="/register"
                className="bg-orange-400 text-white px-2 py-1 text-sm rounded-full mx-1"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
      {/* 모바일 메뉴 토글*/}
      <div className="block md:hidden p-2">
        <div>
          {/* <div ref={toggleButtonRef}> */}
          <FaStream
            className="text-xl relative"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          />
          {/* </div> */}
          {showMobileMenu && (
            <div
              className="absolute gap-3 top-0 right-0 bg-white w-4/5 flex flex-col border border-gray-300 p-2 drop-shadow-xl rounded-lg items-center"
              // ref={mobileMenuRef}
            >
              <FaX
                className="text-3xl p-1 m-1 self-end"
                onClick={() => setShowMobileMenu(false)}
              />
              <div className="self-start w-full flex flex-col gap-3 mb-2">
                <div className="flex items-center w-full py-2 border-b border-gray-300">
                  <img
                    src={user?.imageUrl}
                    className="w-10 h-10 rounded-full object-cover mr-2"
                  />
                  <div className="flex flex-col">
                    <p className="font-semibold">{user?.username}</p>
                    <p className="text-gray-500 text-sm">{user?.email}</p>
                  </div>
                </div>
                <Link href={`/c/${user?.username}/posts`} className="mx-1 mt-2">
                  내가 팔로우한 커뮤니티 모아보기
                </Link>
                <Link href="/search" className="mx-1">
                  검색하러 가기
                </Link>
                <Link href={`/u/${user?.username}`} className="mx-1">
                  내 페이지
                </Link>
                {!authenticated ? (
                  <div className="flex flex-col slef-start border-t border-gray-300 pt-2">
                    <Link href="/login" className="">
                      로그인
                    </Link>
                    <Link href="/register" className="">
                      회원가입
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleLogOut}
                    className="text-red-400 border-t border-gray-300 pt-2"
                  >
                    로그아웃
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;

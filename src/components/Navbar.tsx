"use client";
import { useAuthDispatch, useAuthState } from "@/context/auth";
import useSWR from "swr";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function Navbar() {
  const { loading, authenticated, user } = useAuthState();
  const dispatch = useAuthDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [searchResults, setSearchResults] = useState([]);

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
    // router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    router.push(`/search/${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="flex justify-between p-2 relative h-12 md:h-14 items-center ">
      <Link href="/" className="text-xl ml-3 font-bold">
        홈
      </Link>
      <p>로그인한 유저 : {user?.username}</p>
      <div>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          className="bg-gray-200 px-3 py-1 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>검색</button>
      </div>
      {authenticated ? (
        <button onClick={handleLogOut}>로그아웃</button>
      ) : (
        <>
          <Link href="/login">로그인</Link>
          <Link href="/register">회원가입</Link>
        </>
      )}
    </div>
  );
}

export default Navbar;

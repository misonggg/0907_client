"use client";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";

function EditComment() {
  const [body, setBody] = useState("");
  const router = useRouter();

  const pathname = usePathname();
  const parts = pathname.split("/");
  const identifier = parts[parts.length - 1];

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/posts/comment/${identifier}`
      );
      const commentData = res.data;
      setBody(commentData.body);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (body.trim() === "") {
      alert("내용을 입력하세요.");
      return;
    }

    try {
      await axios.post(
        `
      http://localhost:4000/api/posts/${identifier}/comment/edit`,
        {
          identifier,
          body,
        }
      );
      router.back();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full pt-5 px-3 max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="">
        <input
          type="text"
          placeholder="댓글 내용"
          className="p-2 border border-gray-300 w-full rounded-lg"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="flex justify-end self-end">
          <button className="bg-blue-500 rounded-full text-white px-2 py-1 w-20 mt-3 hover:opacity-60">
            수정 완료
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditComment;

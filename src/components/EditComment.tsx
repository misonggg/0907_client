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
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="댓글 내용"
          className="p-2 border border-gray-300"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-2 py-1 w-20">
          수정 완료
        </button>
      </form>
    </div>
  );
}

export default EditComment;

"use client";
import { useAuthState } from "@/context/auth";
import { Post } from "@/types";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

function SubsPostNew() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { authenticated, user } = useAuthState();
  const router = useRouter();

  const pathname = usePathname();
  const encodedSubNameMatch = pathname.match(/\/c\/([^/]+)\/new$/);
  const encodedSubName = encodedSubNameMatch ? encodedSubNameMatch[1] : null;

  // 한글 값을 디코딩하여 실제 subName 추출
  const subName = encodedSubName ? decodeURIComponent(encodedSubName) : null;

  if (!authenticated) {
    router.push("/login");
  }

  const submitPost = async (e: FormEvent) => {
    e.preventDefault();

    if (title.trim() === "") {
      alert("제목을 입력하세요.");
      return;
    }

    if (body.trim() === "") {
      alert("내용을 입력하세요.");
      return;
    }

    if (title.trim() === "" || !subName) return;

    try {
      const { data: post } = await axios.post<Post>(
        `http://localhost:4000/api/posts`,
        {
          title: title.trim(),
          body,
          sub: subName,
        }
      );
      router.push(`/c/${subName}/${post.identifier}`);
    } catch (error) {
      console.log(error);
    }
  };

  // 테스트 부분
  const quillRef = useRef<ReactQuill>(null);

  const imageHandler = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.addEventListener("change", async () => {
      const file = input.files ? input.files[0] : null;

      if (file) {
        try {
          const formData = new FormData();
          formData.append("img", file);

          // 이미지를 업로드하고 이미지 URL을 받아올 백엔드 엔드포인트의 주소를 입력하세요
          const result = await axios.post(
            "http://localhost:4000/api/posts/upload",
            formData
          );
          const IMG_URL = result.data.url;
          const IMG_URL2 = `http://localhost:4000/${IMG_URL}`;

          const editor = quillRef.current?.getEditor();
          if (editor) {
            // 이미지를 에디터에 삽입합니다.
            editor.clipboard.dangerouslyPasteHTML(
              editor.getLength(),
              `<img src="${IMG_URL2}" alt="Uploaded Image" /><br/>`
            );
          }
        } catch (error) {
          console.log("실패했어요ㅠ", error);
        }
      }
    });
  };

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          ["image"],
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      // imageResize: {},
    };
  }, []);

  return (
    <div className="w-full md:max-w-2xl mx-auto flex flex-col px-2">
      <div className="flex items-center">
        <p className="py-2 font-semibold md:text-lg mr-1">✏️ {subName}</p>
        <p className="text-gray-400 text-sm md:text-md">에서 포스트 생성하기</p>
      </div>
      <form onSubmit={submitPost} className="relative">
        <input
          type="text"
          placeholder="제목"
          maxLength={30}
          className="w-full border border-gray-300 outline-none focus:border-black mb-10 px-2 py-1"
          value={title}
          onChange={(e) => {
            if (e.target.value.length <= 20) {
              setTitle(e.target.value);
            }
          }}
        />
        <p
          style={{ top: 10, right: 10 }}
          className="absolute text-sm text-blue-500 select-none mb-1"
        >
          {title.trim().length} / 20
        </p>
        <ReactQuill
          ref={quillRef}
          value={body}
          onChange={(value) => setBody(value)}
          placeholder={"내용을 작성해주세요."}
          style={{ height: "500px" }}
          modules={modules}
          className="mb-16"
        />
        <button className="bg-blue-500 text-white rounded-full px-2 py-1 w-20 items-center mb-3 self-end">
          게시하기
        </button>
      </form>
    </div>
  );
}

export default SubsPostNew;

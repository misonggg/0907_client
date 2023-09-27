"use client";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill";
import dynamic from "next/dynamic";

function EditPost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const router = useRouter();

  const pathname = usePathname();
  const parts = pathname.split("/");
  const postIdentifier = parts[parts.length - 2];

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/posts/${postIdentifier}`
      );
      const postData = res.data;
      setTitle(postData.title);
      setBody(postData.body);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData(); // 컴포넌트가 로드될 때 데이터를 가져옴
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (title.trim() === "") {
      alert("제목을 입력하세요.");
      return;
    }

    if (body.trim() === "") {
      alert("내용을 입력하세요.");
      return;
    }

    // if (title.trim() === "" || !postIdentifier) return;

    try {
      await axios.post(
        `http://localhost:4000/api/posts/${postIdentifier}/edit`,
        {
          postIdentifier,
          title,
          body,
        }
      );
      router.push(`/c/${postIdentifier}`);
    } catch (error) {
      console.error(error);
    }
  };

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
    <div className="w-full flex flex-col px-3 md:max-w-2xl mx-auto">
      <p className="py-2 text-lg font-semibold">게시물 수정하기</p>
      <form onSubmit={handleSubmit} className="relative flex flex-col">
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
          style={{ top: 8, right: 12 }}
          className="absolute text-sm text-blue-500 select-none"
        >
          {title.trim().length}/20
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
        <div className="flex self-end">
          <button className="bg-blue-500 rounded-full text-white px-2 py-1 hover:opacity-60">
            수정 완료
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditPost;

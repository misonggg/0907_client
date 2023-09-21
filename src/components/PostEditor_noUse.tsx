"use client";
import React, { useRef, useState } from "react";
import ReactQuill from "react-quill";

function PostEditor() {
  const [text, setText] = useState<string>("");
  const quillRef = useRef<ReactQuill>(null);

  const handleTextChange = (value: string) => {
    setText(value);
  };

  // 원랜 handleSubmit 해줘야 하지만 이건 컴포넌트로 따로 뺐으니까 부모에서 처리해줌

  // 이미지 업로드 핸들러
  const handleImageUpload = async (file: any) => {
    // try {
    //   // 파일 업로드를 위한 FormData 생성
    //   const formData = new FormData();
    //   formData.append("file", file);
    //   // 이미지를 서버에 업로드
    //   const response = await axios.post("/api/upload", formData);
    //   // 이미지 업로드가 성공한 경우, 이미지 URL을 에디터에 삽입
    //   const imageUrl = response.data.url;
    //   const quill = quillRef.current.getEditor();
    //   const range = quill.getSelection();
    //   quill.insertEmbed(range.index, "image", imageUrl);
    // } catch (error) {
    //   console.error("이미지 업로드 중 오류 발생:", error);
    // }
  };

  // Quill 컴포넌트의 모듈 설정
  const modules = {
    toolbar: {
      container: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ align: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
      handlers: {
        image: () => {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");
          input.onchange = () => {
            if (input.files && input.files[0]) {
              handleImageUpload(input.files[0]);
            }
          };
          input.click();
        },
      },
    },
  };

  return (
    <div>
      <ReactQuill
        className="bg-gray-300"
        ref={quillRef}
        value={text}
        onChange={handleTextChange}
        placeholder={"내용을 작성해주세요."}
        style={{ height: "500px" }}
        modules={{
          toolbar: [["bold", "italic", "underline", "strike"], ["image"]],
        }}
      />
    </div>
  );
}

export default PostEditor;

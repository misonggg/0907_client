'use client';
import CreateSubs from '@/components/CreateSubs';
import { useAuthState } from '@/context/auth';
import { useRouter } from 'next/navigation';
import React from 'react';

function page() {
  const { authenticated, user } = useAuthState();
  const router = useRouter();

  // 로그인하지 않은 사용자를 로그인 페이지로 리다이렉트
  if (!authenticated) {
    router.push('/login'); // 로그인 페이지로 보냄
    return null; // 리다이렉트 후, 렌더링을 중지합
  }

  return (
    <div>
      <h1 className="mb-4">커뮤니티 만들기</h1>
      <CreateSubs />
    </div>
  );
}

export default page;

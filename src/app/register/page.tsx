'use client';
import Register from '@/components/Register';
import { useAuthState } from '@/context/auth';
import { useRouter } from 'next/navigation';
import React from 'react';

function page() {
  const { authenticated } = useAuthState();
  const router = useRouter();

  if (authenticated) {
    router.push('/');
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="py-3">회원가입</h1>
      <Register />
    </div>
  );
}

export default page;

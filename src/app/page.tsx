import FollowingSubs from "@/components/FollowingSubs";
import PostList from "@/components/PostList";
import TopSubs from "@/components/TopSubs";
import { useAuthState } from "@/context/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { authOptions } from "./pages/auth/[...nextauth]";

export default function Home() {
  return (
    <section className="flex flex-row w-full">
      {/* <div className="w-1/5">
      </div> */}
      <div className="w-4/5">
        <PostList />
      </div>
      <div className="w-1/5 flex flex-col">
        {/* <Link href="/p/new">
          <button className="bg-blue-500 px-3 py-1 text-white">
            포스트 하기
          </button>
        </Link> */}
        <FollowingSubs />
        <TopSubs />
      </div>
    </section>
  );
}

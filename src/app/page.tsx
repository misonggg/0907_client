import FollowingSubs from "@/components/FollowingSubs";
import PostList from "@/components/PostList";
import TopSubs from "@/components/TopSubs";

export default function Home() {
  return (
    <section className="flex flex-row w-full">
      <div className="md:w-1/5 px-2 md:block hidden">
        <p>광고영역</p>
      </div>
      <div className="md:w-3/5 w-full bg-white">
        <PostList />
      </div>
      <div className="md:w-1/5 flex flex-col md:px-2">
        <div className="md:block hidden">
          {/* <Link href="/p/new">
          <button className="bg-blue-500 px-3 py-1 text-white">
            포스트 하기
          </button>
        </Link> */}
          <FollowingSubs />
          <TopSubs />
        </div>
      </div>
    </section>
  );
}

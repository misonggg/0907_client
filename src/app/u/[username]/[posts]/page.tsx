import FollowingSubs from "@/components/FollowingSubs";
import FollowingSubsPostList from "@/components/FollowingSubsPostList";
import React from "react";

function page() {
  return (
    <div className="w-full flex flex-row">
      <div className="w-4/5">
        <FollowingSubsPostList />
      </div>
      <div className="w-1/5">
        <FollowingSubs />
      </div>
    </div>
  );
}

export default page;

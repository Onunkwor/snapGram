import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import RightSideBar from "@/components/shared/RightSideBar";
// import { useToken } from "@/context/tokenContext";
// import UserStories from "@/components/shared/UserStories";
import { useGetPosts } from "@/lib/react-query/queriesAndMutation";
import { IPost } from "@/types";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Home = () => {
  // const token = useToken();
  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isPending: isPostLoading,
  } = useGetPosts();

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return (
    <div className="flex flex-1">
      <div className="home-container h-screen overflow-y-scroll">
        {/* <div className="w-[350px] md:w-[400px]">
          <UserStories />
        </div> */}
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.pages?.map((pageIndex: []) =>
                pageIndex.map((post: IPost, index: number) => (
                  <li key={index}>
                    <PostCard post={post} />
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
        {hasNextPage && (
          <div ref={ref}>
            <Loader />
          </div>
        )}
      </div>
      <div className="w-465 hidden lg:block h-screen overflow-x-hidden overflow-y-scroll custom-scrollbar">
        <RightSideBar />
      </div>
    </div>
  );
};

export default Home;

import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import RightSideBar from "@/components/shared/RightSideBar";
import UserStories from "@/components/shared/UserStories";
import { useGetPosts } from "@/lib/react-query/queriesAndMutation";
import { Models } from "appwrite";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Home = () => {
  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isPending: isPostLoading,
  } = useGetPosts();

  // console.log(posts);

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="w-[350px] md:w-[400px] custom">
          <UserStories />
        </div>
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts?.pages[0]?.documents.map((post: Models.Document, i) => (
                <li key={i}>
                  <PostCard post={post} />
                </li>
                
              ))}
            </ul>
          )}
        </div>
        {hasNextPage && (
          <div ref={ref}>
            <Loader />
          </div>
        )}
      </div>
      <div className="w-465 hidden lg:block overflow-x-hidden overflow-y-scroll custom-scrollbar">
        <RightSideBar />
      </div>
    </div>
  );
};

export default Home;

// import Loader from "@/components/shared/Loader";
// import PostCard from "@/components/shared/PostCard";
// import RightSideBar from "@/components/shared/RightSideBar";
// import UserStories from "@/components/shared/UserStories";
const Home = () => {
  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="w-[350px] md:w-[400px] custom">
          {/* <UserStories /> */}
        </div>
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home feed</h2>
        </div>
        {/* {hasNextPage && (
          <div ref={ref}>
            <Loader />
          </div>
        )} */}
      </div>
      {/* <div className="w-465 hidden lg:block overflow-x-hidden overflow-y-scroll custom-scrollbar">
        <RightSideBar />
      </div> */}
    </div>
  );
};

export default Home;

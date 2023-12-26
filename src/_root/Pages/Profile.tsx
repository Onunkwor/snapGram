// import GridPostList from "@/components/shared/GridPostList";
import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import {
  useDeleteFollowing,
  useFollowUser,
  useGetCurrentUser,
  useGetUserById,
  useGetUserLikedPosts,
  useGetUserPosts,
} from "@/lib/react-query/queriesAndMutation";
import { IFollowing } from "@/types";
import { Models } from "appwrite";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const { data: currentUser } = useGetCurrentUser();
  const [activeTab, setActiveTab] = useState("posts");
  const { data: userPosts } = useGetUserPosts(id);
  const likedPostsIds = currentUser?.liked.map(
    (post: Models.Document) => post.$id
  );
  const { data } = useGetUserLikedPosts(likedPostsIds);
  const {
    data: user,
    isPending: isUserLoading,
    refetch,
  } = useGetUserById(id || "");
  useEffect(() => {
    refetch();
  }, [id]);
  const isCurrentUser = currentUser?.$id === user?.$id;

  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  useEffect(() => {
    setIsFollowing(
      user &&
        user.followers.some((user: IFollowing) => {
          return user.userId === currentUser?.$id;
        })
    );
  }, [currentUser, user]);
  // console.log(currentUser);
  
  const { mutate: followUser, isPending: isFollowingLoading } = useFollowUser();
  const { mutate: deleteFollowing, isPending: isDeletingFollowing } =
    useDeleteFollowing();
  const followersList = user?.followers?.map(
    (follower: Models.Document) => follower.userId
  );
  const handleFollowUser = () => {
    const newFollowing = [...followersList];
    const isCurrentUserDefined = currentUser && currentUser.$id;
    const alreadyFollowing = newFollowing.includes(currentUser?.$id);

    if (alreadyFollowing && isCurrentUserDefined) {
      const followingIndex = currentUser.following.findIndex(
        (follower: Models.Document) => follower.userId === user?.$id
      );
      const followerIndex = user?.followers.findIndex(
        (follower: Models.Document) => follower.userId === currentUser?.$id
      );

      if (followerIndex !== -1 && followingIndex !== -1) {
        const followerIdToDelete = user?.followers[followerIndex].$id;
        const followingIdToDelete = currentUser.following[followingIndex].$id;

        deleteFollowing({
          followingRecordId: followingIdToDelete,
          followerRecordId: followerIdToDelete,
        });
        setIsFollowing(false);
      }
    } else {
      if (!user?.userName || !currentUser) {
        throw new Error("User does not have a userName");
      }

      followUser({
        userName: user.userName,
        userId: user.$id,
        loggedInUserId: currentUser.$id,
        loggedInUserName: currentUser.userName,
      });
      setIsFollowing(true);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex-center w-full justify-center">
        <Loader />
      </div>
    );
  }
  return (
    <div className="overflow-scroll custom-scrollbar w-full">
      <div className="flex mt-12 md:ml-12 ml-6">
        <img
          src={user?.imageUrl}
          alt="user"
          className="lg:w-[150px] lg:h-[150px] w-16 h-16 rounded-full"
        />
        <div className="flex flex-col md:ml-8 gap-2 ml-4 justify-center ">
          <div className="flex items-center justify-center">
            <h1 className="font-semibold lg:text-4xl text-md">{user?.name}</h1>
            {isCurrentUser ? (
              <Link to={`/update-profile/${user?.$id}`}>
                <Button className="ml-2 text-white text-xs md:text-md cursor-pointer flex gap-2 p-2 px-4 bg-[#101012] rounded-lg">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 "
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M17.9139 1.875H20.25C20.8713 1.875 21.375 2.37868 21.375 3C21.375 3.62132 20.8713 4.125 20.25 4.125H18C14.4327 4.125 11.8703 4.12739 9.92036 4.38956C8.00276 4.64737 6.84668 5.13771 5.99219 5.99219C5.13771 6.84668 4.64737 8.00276 4.38956 9.92036C4.12739 11.8703 4.125 14.4327 4.125 18C4.125 21.5673 4.12739 24.1297 4.38956 26.0796C4.64737 27.9972 5.13771 29.1533 5.99219 30.0078C6.84668 30.8623 8.00276 31.3526 9.92036 31.6104C11.8703 31.8726 14.4327 31.875 18 31.875C21.5673 31.875 24.1297 31.8726 26.0796 31.6104C27.9972 31.3526 29.1533 30.8623 30.0078 30.0078C30.8623 29.1533 31.3526 27.9972 31.6104 26.0796C31.8726 24.1297 31.875 21.5673 31.875 18V15.75C31.875 15.1287 32.3787 14.625 33 14.625C33.6213 14.625 34.125 15.1287 34.125 15.75V18.0861C34.125 21.5487 34.125 24.2622 33.8404 26.3794C33.549 28.5465 32.941 30.2566 31.5988 31.5988C30.2566 32.941 28.5465 33.549 26.3794 33.8404C24.2622 34.125 21.5487 34.125 18.0861 34.125H17.9139C14.4513 34.125 11.7378 34.125 9.62056 33.8404C7.45345 33.549 5.74342 32.941 4.4012 31.5988C3.05899 30.2566 2.45098 28.5465 2.15962 26.3794C1.87497 24.2622 1.87498 21.5487 1.875 18.0861V17.9139C1.87498 14.4513 1.87497 11.7378 2.15962 9.62056C2.45098 7.45345 3.05899 5.74342 4.4012 4.4012C5.74342 3.05899 7.45345 2.45098 9.62056 2.15962C11.7378 1.87497 14.4513 1.87498 17.9139 1.875ZM25.1558 3.41387C27.2076 1.36204 30.5343 1.36204 32.5861 3.41387C34.638 5.4657 34.638 8.79237 32.5861 10.8442L22.614 20.8164C22.0571 21.3734 21.7082 21.7223 21.3189 22.0259C20.8603 22.3836 20.3642 22.6902 19.8392 22.9404C19.3935 23.1528 18.9254 23.3088 18.1782 23.5578L13.8214 25.0101C13.017 25.2782 12.1302 25.0689 11.5307 24.4693C10.9311 23.8698 10.7218 22.983 10.9899 22.1786L12.4422 17.8218C12.6912 17.0746 12.8472 16.6065 13.0596 16.1608C13.3098 15.6358 13.6164 15.1397 13.9741 14.6811C14.2777 14.2918 14.6267 13.9429 15.1837 13.386L25.1558 3.41387ZM30.9951 5.00486C29.822 3.83171 27.9199 3.83171 26.7468 5.00486L26.1819 5.56979C26.2159 5.71359 26.2635 5.88491 26.3298 6.076C26.5448 6.69558 26.9516 7.51157 27.72 8.27999C28.4884 9.04841 29.3044 9.4552 29.924 9.67015C30.1151 9.73645 30.2864 9.78409 30.4302 9.81814L30.9951 9.25321C32.1683 8.08006 32.1683 6.17801 30.9951 5.00486ZM28.6577 11.5906C27.8838 11.2578 26.9822 10.7242 26.129 9.87098C25.2758 9.01777 24.7422 8.11623 24.4094 7.34228L16.8263 14.9254C16.2015 15.5502 15.9565 15.7979 15.7482 16.0649C15.4911 16.3946 15.2706 16.7513 15.0907 17.1288C14.945 17.4344 14.833 17.7644 14.5536 18.6026L13.9058 20.5461L15.4539 22.0942L17.3974 21.4464C18.2356 21.167 18.5656 21.0549 18.8712 20.9093C19.2487 20.7294 19.6054 20.5089 19.9351 20.2518C20.2021 20.0435 20.4498 19.7985 21.0746 19.1737L28.6577 11.5906Z"
                      fill="#FFB620"
                    />
                  </svg>
                  Edit Profile
                </Button>
              </Link>
            ) : (
              <Button className="bg-[#877EFF] ml-12" onClick={handleFollowUser}>
                {isFollowingLoading || isDeletingFollowing ? (
                  <Loader />
                ) : isFollowing ? (
                  <>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 1.0415C7.8139 1.0415 6.0417 2.81371 6.0417 4.99984C6.0417 7.18596 7.8139 8.95817 10 8.95817C12.1862 8.95817 13.9584 7.18596 13.9584 4.99984C13.9584 2.81371 12.1862 1.0415 10 1.0415ZM7.2917 4.99984C7.2917 3.50407 8.50426 2.2915 10 2.2915C11.4958 2.2915 12.7084 3.50407 12.7084 4.99984C12.7084 6.49561 11.4958 7.70817 10 7.70817C8.50426 7.70817 7.2917 6.49561 7.2917 4.99984Z"
                        fill="#fff"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 10.2082C8.07207 10.2082 6.2958 10.6464 4.97957 11.3868C3.68293 12.1161 2.70836 13.2216 2.70836 14.5832L2.70831 14.6681C2.70737 15.6363 2.70619 16.8515 3.77204 17.7195C4.2966 18.1466 5.03043 18.4504 6.02187 18.6511C7.01608 18.8523 8.31189 18.9582 10 18.9582C11.6882 18.9582 12.984 18.8523 13.9782 18.6511C14.9696 18.4504 15.7035 18.1466 16.228 17.7195C17.2939 16.8515 17.2927 15.6363 17.2918 14.6681L17.2917 14.5832C17.2917 13.2216 16.3171 12.1161 15.0205 11.3868C13.7043 10.6464 11.928 10.2082 10 10.2082ZM3.95836 14.5832C3.95836 13.8737 4.47618 13.1041 5.5924 12.4763C6.68903 11.8594 8.24609 11.4582 10 11.4582C11.754 11.4582 13.311 11.8594 14.4077 12.4763C15.5239 13.1041 16.0417 13.8737 16.0417 14.5832C16.0417 15.673 16.0081 16.2865 15.4387 16.7502C15.1299 17.0016 14.6138 17.2471 13.7302 17.4259C12.8494 17.6042 11.6452 17.7082 10 17.7082C8.35484 17.7082 7.15065 17.6042 6.26986 17.4259C5.3863 17.2471 4.87013 17.0016 4.56135 16.7502C3.99196 16.2865 3.95836 15.673 3.95836 14.5832Z"
                        fill="#fff"
                      />
                    </svg>
                    Unfollow
                  </>
                ) : (
                  <>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 1.0415C7.8139 1.0415 6.0417 2.81371 6.0417 4.99984C6.0417 7.18596 7.8139 8.95817 10 8.95817C12.1862 8.95817 13.9584 7.18596 13.9584 4.99984C13.9584 2.81371 12.1862 1.0415 10 1.0415ZM7.2917 4.99984C7.2917 3.50407 8.50426 2.2915 10 2.2915C11.4958 2.2915 12.7084 3.50407 12.7084 4.99984C12.7084 6.49561 11.4958 7.70817 10 7.70817C8.50426 7.70817 7.2917 6.49561 7.2917 4.99984Z"
                        fill="#fff"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 10.2082C8.07207 10.2082 6.2958 10.6464 4.97957 11.3868C3.68293 12.1161 2.70836 13.2216 2.70836 14.5832L2.70831 14.6681C2.70737 15.6363 2.70619 16.8515 3.77204 17.7195C4.2966 18.1466 5.03043 18.4504 6.02187 18.6511C7.01608 18.8523 8.31189 18.9582 10 18.9582C11.6882 18.9582 12.984 18.8523 13.9782 18.6511C14.9696 18.4504 15.7035 18.1466 16.228 17.7195C17.2939 16.8515 17.2927 15.6363 17.2918 14.6681L17.2917 14.5832C17.2917 13.2216 16.3171 12.1161 15.0205 11.3868C13.7043 10.6464 11.928 10.2082 10 10.2082ZM3.95836 14.5832C3.95836 13.8737 4.47618 13.1041 5.5924 12.4763C6.68903 11.8594 8.24609 11.4582 10 11.4582C11.754 11.4582 13.311 11.8594 14.4077 12.4763C15.5239 13.1041 16.0417 13.8737 16.0417 14.5832C16.0417 15.673 16.0081 16.2865 15.4387 16.7502C15.1299 17.0016 14.6138 17.2471 13.7302 17.4259C12.8494 17.6042 11.6452 17.7082 10 17.7082C8.35484 17.7082 7.15065 17.6042 6.26986 17.4259C5.3863 17.2471 4.87013 17.0016 4.56135 16.7502C3.99196 16.2865 3.95836 15.673 3.95836 14.5832Z"
                        fill="#fff"
                      />
                    </svg>
                    Follow
                  </>
                )}
              </Button>
            )}
          </div>
          <p className="text-[#7878A3]">@{user?.userName}</p>
          <div className="flex mt-2 gap-3">
            <div className="flex flex-col">
              <p className="text-[#877EFF] lg:text-xl text-base font-medium">
                {user?.posts.length}
              </p>
              <p className="lg:text-lg font-extralight text-sm">Posts</p>
            </div>
            <div className="flex flex-col">
              <p className="text-[#877EFF] lg:text-xl text-base font-medium">
                {user?.following.length}
              </p>
              <p className="lg:text-lg  font-extralight text-sm">Following</p>
            </div>
            <div className="flex flex-col">
              <p className="text-[#877EFF] lg:text-xl text-base font-medium">
                {user?.followers.length}
              </p>
              <p className="lg:text-lg  font-extralight text-sm">Followers</p>
            </div>
          </div>
          <p>{user?.bio}</p>
        </div>
      </div>
      {isCurrentUser && (
        <div
          className={`w-[350px] bg-[#101012] ml-8 mt-8 flex justify-around rounded-md`}
        >
          <Button
            onClick={() => setActiveTab("posts")}
            className={`${
              activeTab === "posts" ? "bg-[#877eff] " : ""
            } rounded-md w-1/2 `}
          >
            {" "}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <g clipPath="url(#clip0_1607_406)">
                <path
                  d="M1.66675 9.99984C1.66675 6.07147 1.66675 4.10728 2.88714 2.88689C4.10752 1.6665 6.07171 1.6665 10.0001 1.6665C13.9285 1.6665 15.8926 1.6665 17.113 2.88689C18.3334 4.10728 18.3334 6.07147 18.3334 9.99984C18.3334 13.9282 18.3334 15.8924 17.113 17.1128C15.8926 18.3332 13.9285 18.3332 10.0001 18.3332C6.07171 18.3332 4.10752 18.3332 2.88714 17.1128C1.66675 15.8924 1.66675 13.9282 1.66675 9.99984Z"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
                <circle
                  cx="13.3334"
                  cy="6.66667"
                  r="1.66667"
                  stroke="#fff"
                  strokeWidth="1.5"
                />
                <path
                  d="M1.66675 10.4169L3.1264 9.13976C3.8858 8.47529 5.03031 8.5134 5.74382 9.22691L9.31859 12.8017C9.89128 13.3744 10.7928 13.4525 11.4554 12.9868L11.7039 12.8121C12.6574 12.142 13.9475 12.2196 14.8138 12.9993L17.5001 15.4169"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_1607_406">
                  <rect width="20" height="20" fill="white" />
                </clipPath>
              </defs>
            </svg>
            Posts
          </Button>
          <Button
            onClick={() => setActiveTab("likes")}
            className={`${
              activeTab === "likes" ? "bg-[#877eff] " : ""
            } rounded-md w-1/2 `}
          >
            {" "}
            <svg
              width="18"
              height="16"
              viewBox="0 0 18 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.66225 1.61569C2.27333 2.26398 1.25581 3.80596 1.25581 5.64473C1.25581 7.52328 2.00865 8.97125 3.08787 10.2122C3.97735 11.2349 5.0541 12.0826 6.1042 12.9092C6.35361 13.1056 6.60152 13.3007 6.84506 13.4968C7.28546 13.8513 7.67832 14.1624 8.05698 14.3884C8.43584 14.6144 8.7408 14.7177 9 14.7177C9.2592 14.7177 9.56416 14.6144 9.94302 14.3884C10.3217 14.1624 10.7145 13.8513 11.1549 13.4968C11.3985 13.3007 11.6464 13.1056 11.8958 12.9092C12.9459 12.0825 14.0226 11.2349 14.9121 10.2122C15.9914 8.97125 16.7442 7.52328 16.7442 5.64473C16.7442 3.80596 15.7267 2.26398 14.3377 1.61569C12.9884 0.985873 11.1754 1.15266 9.4524 2.98057C9.33403 3.10615 9.17069 3.1771 9 3.1771C8.82931 3.1771 8.66597 3.10615 8.5476 2.98057C6.82465 1.15266 5.01159 0.985873 3.66225 1.61569ZM9 1.64529C7.06433 -0.123128 4.8968 -0.370511 3.14017 0.449413C1.28488 1.31539 0 3.3262 0 5.64473C0 7.92348 0.929718 9.66185 2.14888 11.0637C3.1252 12.1863 4.32019 13.1258 5.37557 13.9556C5.61482 14.1437 5.84688 14.3261 6.06761 14.5038C6.49645 14.849 6.95683 15.2172 7.42339 15.4955C7.88974 15.7738 8.42199 16 9 16C9.57801 16 10.1103 15.7738 10.5766 15.4955C11.0432 15.2171 11.5035 14.849 11.9324 14.5038C12.1531 14.3261 12.3852 14.1437 12.6244 13.9556C13.6798 13.1258 14.8748 12.1863 15.8511 11.0637C17.0703 9.66185 18 7.92348 18 5.64473C18 3.3262 16.7151 1.31539 14.8598 0.449413C13.1032 -0.370511 10.9357 -0.123128 9 1.64529Z"
                fill="#fff"
              />
            </svg>
            Likes
          </Button>
        </div>
      )}
      <ul className="md:ml-10 mt-10 ml-6 ">
        <li>
          {isCurrentUser && activeTab === "posts" && (
            // Render user's posts if the user is viewing their own profile and activeTab is "posts"
            <GridPostList posts={userPosts?.documents} />
          )}
          {isCurrentUser && activeTab === "likes" && (
            // Render user's liked posts if the user is viewing their own profile and activeTab is "likes"
            <GridPostList posts={data} />
          )}
          {!isCurrentUser && (
            // Render other user's posts if the user is viewing someone else's profile
            <GridPostList posts={userPosts?.documents} />
          )}
        </li>
      </ul>
    </div>
  );
};

export default Profile;

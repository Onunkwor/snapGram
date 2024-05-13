import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
  useDeleteFollowing,
  useFollowUser,
  useGetEntirePost,
  useGetUserById,
} from "@/lib/react-query/queriesAndMutation";
import { IPost } from "@/types";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Profile = () => {
  const { id: encodedId } = useParams<{ id: string }>();

  const id = encodedId ? atob(encodedId) : "";
  // console.log(id);

  const currentUser = useUserContext();
  const [activeTab, setActiveTab] = useState("posts");
  const { data: allPosts } = useGetEntirePost();
  const {
    data: user,
    isPending: isUserLoading,
    refetch,
  } = useGetUserById(id || "");

  const userPosts = allPosts?.filter((post: IPost) => post.creator._id === id);
  const data = allPosts?.filter((post: IPost) => {
    return (post.likes || []).includes(id ?? "");
  });
  const userSavedPost = allPosts?.filter((post: IPost) => {
    return (post.saved || []).includes(id ?? "");
  });

  useEffect(() => {
    refetch();
  }, [id, refetch]);
  const isCurrentUser = currentUser?._id === user?._id;

  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  useEffect(() => {
    setIsFollowing(
      user &&
        user.followers?.some((user: string) => {
          return user === currentUser?._id;
        })
    );
  }, [currentUser, user]);

  const { mutate: followUser, isPending: isFollowingLoading } = useFollowUser();
  const { mutate: deleteFollowing, isPending: isDeletingFollowing } =
    useDeleteFollowing();
  const followersList = user?.followers?.map((follower: string) => follower);
  const handleFollowUser = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) return;
    const newFollowing = [...followersList];
    const isCurrentUserDefined = currentUser && currentUser._id;
    const alreadyFollowing = newFollowing.includes(currentUser?._id);

    if (alreadyFollowing && isCurrentUserDefined) {
      const followingList: string[] = currentUser.following.filter(
        (follower: string) => follower !== user._id
      );
      const followerList: string[] = user.followers.filter(
        (follower: string) => follower !== currentUser?._id
      );

      deleteFollowing({
        currentUser: currentUser?._id,
        user: user?._id,
        followingRecordList: followingList,
        followerRecordList: followerList,
      });
      setIsFollowing(false);
    } else {
      if (!user.username || !currentUser) {
        throw new Error("User does not have a userName");
      }

      followUser({
        followingRecord: user._id,
        followersRecord: currentUser._id,
      });
      setIsFollowing(true);
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex-center w-full justify-center h-screen">
        <Loader />
      </div>
    );
  }
  return (
    <div className="overflow-y-scroll custom-scrollbar w-full h-screen">
      <div className="flex mt-12 md:ml-12 ml-6">
        <img
          src={user?.photo}
          alt="user"
          className="lg:w-[150px] lg:h-[150px] w-16 h-16 rounded-full"
        />
        <div className="flex flex-col md:ml-8 gap-2 ml-4 justify-center ">
          <div className="flex items-center justify-center">
            <h1 className="font-semibold lg:text-4xl text-md">
              {user?.username}
            </h1>
            {isCurrentUser ? (
              <Link to={`/update-profile/${user?._id}`}>
                <Button className="ml-2 text-white text-xs md:text-md cursor-pointer gap-2 p-2 px-4 bg-[#101012] rounded-lg hidden">
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
          <p className="text-[#7878A3]">@{user?.username}</p>
          <div className="flex mt-2 gap-3">
            <div className="flex flex-col">
              <p className="text-[#877EFF] lg:text-xl text-base font-medium">
                {userPosts?.length}
              </p>
              <p className="lg:text-sm font-extralight text-xs">Posts</p>
            </div>
            <div className="flex flex-col">
              <p className="text-[#877EFF] lg:text-xl text-base font-medium">
                {user?.following?.length}
              </p>
              <p className="lg:text-sm  font-extralight text-xs">Following</p>
            </div>
            <div className="flex flex-col">
              <p className="text-[#877EFF] lg:text-xl text-base font-medium">
                {user?.followers?.length}
              </p>
              <p className="lg:text-sm  font-extralight text-xs">Followers</p>
            </div>
          </div>{" "}
        </div>
      </div>
      <hr className="border w-11/12 border-dark-4/80 mt-8 mx-auto " />
      {isCurrentUser && (
        <div
          className={`w-[370px] bg-[#101012] ml-8 mt-8 flex justify-around rounded-md`}
        >
          <Button
            onClick={() => setActiveTab("posts")}
            className={`${
              activeTab === "posts" ? "bg-[#877eff] " : ""
            } rounded-md w-1/3 `}
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
            } rounded-md w-1/3 `}
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
          <Button
            onClick={() => setActiveTab("saved")}
            className={`${
              activeTab === "saved" ? "bg-[#877eff] " : ""
            } rounded-md w-1/3 `}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <path
                d="M9 5.25C8.58579 5.25 8.25 5.58579 8.25 6C8.25 6.41421 8.58579 6.75 9 6.75H15C15.4142 6.75 15.75 6.41421 15.75 6C15.75 5.58579 15.4142 5.25 15 5.25H9Z"
                fill="#fff"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.9425 1.25C9.86994 1.24999 8.23715 1.24997 6.96128 1.42337C5.65121 1.60141 4.60609 1.97468 3.78484 2.80484C2.96469 3.63387 2.59692 4.68702 2.4213 6.00741C2.24997 7.29551 2.24999 8.94462 2.25 11.0411V16.139C2.24999 17.6466 2.24998 18.8402 2.34601 19.7388C2.44091 20.6269 2.64447 21.428 3.22584 21.9638C3.69226 22.3937 4.28211 22.6646 4.91165 22.7367C5.69912 22.8268 6.43439 22.4508 7.15868 21.9377C7.89163 21.4185 8.78075 20.6321 9.90254 19.6399L9.93905 19.6076C10.4591 19.1476 10.8112 18.8372 11.105 18.6224C11.3889 18.4148 11.5623 18.3397 11.7084 18.3103C11.9009 18.2715 12.0991 18.2715 12.2916 18.3103C12.4377 18.3397 12.6111 18.4148 12.895 18.6224C13.1888 18.8372 13.5409 19.1476 14.061 19.6076L14.0975 19.64C15.2193 20.6321 16.1084 21.4186 16.8413 21.9377C17.5656 22.4508 18.3009 22.8268 19.0883 22.7367C19.7179 22.6646 20.3077 22.3937 20.7742 21.9638C21.3555 21.428 21.5591 20.6269 21.654 19.7388C21.75 18.8402 21.75 17.6466 21.75 16.139V11.041C21.75 8.94462 21.75 7.2955 21.5787 6.00741C21.4031 4.68702 21.0353 3.63387 20.2152 2.80484C19.3939 1.97468 18.3488 1.60141 17.0387 1.42337C15.7628 1.24997 14.1301 1.24999 12.0575 1.25H11.9425ZM4.8512 3.85977C5.34797 3.35762 6.02251 3.06474 7.16328 2.90971C8.32645 2.75163 9.85725 2.75 12 2.75C14.1427 2.75 15.6735 2.75163 16.8367 2.90971C17.9775 3.06474 18.652 3.35762 19.1488 3.85977C19.6467 4.36303 19.9379 5.04819 20.0918 6.20518C20.2484 7.38292 20.25 8.93223 20.25 11.0975V16.0909C20.25 17.6572 20.249 18.7702 20.1625 19.5794C20.0739 20.4088 19.9104 20.72 19.7576 20.8608C19.5238 21.0763 19.2298 21.2107 18.9178 21.2464C18.7182 21.2692 18.3835 21.192 17.7083 20.7137C17.0497 20.2472 16.2211 19.5157 15.0547 18.484L15.0286 18.4609C14.5413 18.0299 14.1372 17.6725 13.7804 17.4116C13.4074 17.1388 13.0312 16.9292 12.5878 16.8398C12.1998 16.7617 11.8002 16.7617 11.4122 16.8398C10.9688 16.9292 10.5926 17.1388 10.2196 17.4116C9.86283 17.6725 9.45871 18.0299 8.97145 18.4609L8.94527 18.484C7.77887 19.5157 6.95026 20.2472 6.29165 20.7137C5.61645 21.192 5.28182 21.2692 5.08218 21.2464C4.77019 21.2107 4.47617 21.0763 4.24237 20.8608C4.08963 20.72 3.92614 20.4088 3.83752 19.5794C3.75104 18.7702 3.75 17.6572 3.75 16.0909V11.0975C3.75 8.93223 3.75156 7.38292 3.9082 6.20518C4.06209 5.04819 4.35333 4.36303 4.8512 3.85977Z"
                fill="#fff"
              />
            </svg>
            Saved
          </Button>
        </div>
      )}
      <ul className="md:ml-10 mt-10 ml-6 ">
        <li>
          {isCurrentUser && activeTab === "posts" && (
            <GridPostList posts={userPosts} />
          )}
          {isCurrentUser && activeTab === "likes" && (
            <GridPostList posts={data} />
          )}
          {isCurrentUser && activeTab === "saved" && (
            <GridPostList posts={userSavedPost} />
          )}
          {!isCurrentUser && <GridPostList posts={userPosts} />}
        </li>
      </ul>
    </div>
  );
};

export default Profile;

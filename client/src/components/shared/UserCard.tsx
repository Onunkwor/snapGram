import { Button } from "../ui/button";
import {
  useDeleteFollowing,
  useFollowUser,
  useGetCurrentUser,
} from "@/lib/react-query/queriesAndMutation";
import Loader from "./Loader";
import { Models } from "appwrite";
import { IFollowing } from "@/types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type UserProps = {
  user: Models.Document;
  action: "All User" | "Top Creator";
};

const UserCard = ({ user, action }: UserProps) => {
  const { data: currentUser } = useGetCurrentUser();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  useEffect(() => {
    setIsFollowing(
      user &&
        user.followers.some((user: IFollowing) => {
          return user.userId === currentUser?.$id;
        })
    );
  }, [currentUser, user]);

  const { mutate: followUser, isPending: isFollowingLoading } = useFollowUser();
  const { mutate: deleteFollowing, isPending: isDeletingFollowing } =
    useDeleteFollowing();
  const followersList = user?.followers?.map(
    (follower: Models.Document) => follower.userId
  );
  const handleFollowUser = (e: React.MouseEvent) => {
    e.preventDefault(); 
  e.stopPropagation();
    const newFollowing = [...followersList];
    const isCurrentUserDefined = currentUser && currentUser.$id;
    const alreadyFollowing = newFollowing.includes(currentUser?.$id);
  
    if (alreadyFollowing && isCurrentUserDefined) {
      const followingIndex = currentUser.followings.findIndex(
        (follower: Models.Document) => follower.userId === user.$id
      );
      const followerIndex = user.followers.findIndex(
        (follower: Models.Document) => follower.userId === currentUser?.$id
      );
  
      if (followerIndex !== -1 && followingIndex !== -1) {
        const followerIdToDelete = user.followers[followerIndex].$id;
        const followingIdToDelete = currentUser.followings[followingIndex].$id;
  
        deleteFollowing({
          followingRecordId: followingIdToDelete,
          followerRecordId: followerIdToDelete,
        });
        setIsFollowing(false)
      }
    } else {
      if (!user.userName || !currentUser) {
        throw new Error("User does not have a userName");
      }
  
      followUser({
        userName: user.userName,
        userId: user.$id,
        loggedInUserId: currentUser.$id,
        loggedInUserName: currentUser.userName,
      });
      setIsFollowing(true)
    }
  };
  

  return (
    <Link to={`/profile/${user.$id}`}>  
    <div
      className={`w-48 h-48 border flex flex-col justify-center p-10 gap-2 items-center rounded-3xl ${
        action === "All User" ? "border-[#101012]" : "border-white"
      }`}
    >
      <img src={user.imageUrl} alt="user" className="w-14 h-14 rounded-full" />
      <p className="font-semibold">{user?.name}</p>
      <p className="text-[#545491] font-medium tiny-medium -mt-2">
        @{user?.userName}
      </p>
      <Button
        className="px-[6px] py-[18px] bg-[#877EFF] rounded-lg flex justify-center items-center w-[74px] h-[30px] font-semibold text-xs text-center"
        onClick={(e) => handleFollowUser(e)}
      >
        {isFollowingLoading || isDeletingFollowing ? (
          <Loader />
        ) : isFollowing ? (
          "Unfollow"
        ) : (
          "Follow"
        )}
      </Button>
    </div>
    </Link>
  );
};

export default UserCard;
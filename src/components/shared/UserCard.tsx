import { IUser } from "@/types";
import { Button } from "../ui/button";
import {
  useDeleteFollowing,
  useFollowUser,
} from "@/lib/react-query/queriesAndMutation";
import Loader from "./Loader";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";

interface UserProps {
  user: IUser;
  action: "Top Creator" | "All User";
}

const UserCard = ({ user, action }: UserProps) => {
  const currentUser = useUserContext();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  useEffect(() => {
    setIsFollowing(
      user &&
        user.followers.some((user: string) => {
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

  return (
    <span>
      <Link to={`/profile/${user._id}`}>
        <div
          className={`w-48 h-48 border flex flex-col justify-center p-10 gap-2 items-center rounded-3xl ${
            action === "All User" ? "border-[#101012]" : "border-white"
          }`}
        >
          <img src={user.photo} alt="user" className="w-14 h-14 rounded-full" />
          <p className="font-semibold">{user?.firstName}</p>
          <p className="text-[#545491] font-medium tiny-medium -mt-2">
            @{user?.username}
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
    </span>
  );
};

export default UserCard;

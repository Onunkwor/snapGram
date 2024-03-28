import {
  useDeleteSavedPost,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutation";
import { checkIsLiked } from "@/lib/utils";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import { Link } from "react-router-dom";
import { IPost } from "@/types";
import { useUserContext } from "@/context/AuthContext";

type PostStatsProps = {
  post?: IPost;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const likesList = post?.likes?.map((userId: string) => userId);
  // console.log(post);
  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);
  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingSaved } =
    useDeleteSavedPost();
  const currentUser = useUserContext();
  const savedPostRecord = currentUser?.saved?.find(
    (record: string) => record === post?._id
  );

  useEffect(() => {
    setIsSaved(savedPostRecord ? true : false);
  }, [savedPostRecord]);

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    let newLikes = [...(likes || "")];
    const hasLikes = newLikes.includes(currentUser?._id || "");
    if (hasLikes) {
      newLikes = newLikes.filter((id) => id !== currentUser?._id);
    } else {
      newLikes.push(userId);
    }

    setLikes(newLikes);
    const likePostData = {
      postId: post?._id || "",
      likes: newLikes,
    };
    likePost(likePostData);
  };

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);
      deleteSavedPost(savedPostRecord);
      return;
    }
    const savePostData = {
      user: userId,
      postId: post?._id || "",
      createdAt: Date.now(),
    };
    savePost(savePostData);
    setIsSaved(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center z-20">
        <div className="flex">
          <div className="flex gap-2 mr-5">
            <img
              src={`${
                checkIsLiked(likes || [""], currentUser?._id || "")
                  ? "/assets/icons/liked.svg"
                  : "/assets/icons/like.svg"
              }`}
              alt="like"
              width={20}
              height={20}
              onClick={(e) => handleLikePost(e)}
              className="cursor-pointer"
            />
            <p className="small-medium lg:base-medium">
              {likes ? likes?.length : 0}
            </p>
          </div>
          <Link to={`/post/${post?._id}`}>
            <div className="flex gap-2">
              <img src="/assets/icons/chat.svg" alt="comment" />
              {post?.comments ? post?.comments.length : 0}
            </div>
          </Link>
        </div>

        <div className="flex gap-2 ">
          {isSavingPost || isDeletingSaved ? (
            <Loader />
          ) : (
            <img
              src={`${
                isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"
              }`}
              alt="like"
              width={20}
              height={20}
              onClick={(e) => {
                handleSavePost(e);
              }}
              className="cursor-pointer"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PostStats;

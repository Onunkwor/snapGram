import { useUserContext } from "@/context/AuthContext";
import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutation";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import { Link } from "react-router-dom";

type PostStatsProps = {
  post?: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  const likesList = post?.likes.map((user: Models.Document) => user.$id);
  // console.log(post);
  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);
  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingSaved } =
    useDeleteSavedPost();
  const { user } = useUserContext();
  const { data: currentUser } = useGetCurrentUser();
  const savedPostRecord = currentUser?.save?.find(
    (record: Models.Document) => record.post?.$id === post?.$id
  );

  useEffect(() => {
    setIsSaved(savedPostRecord ? true : false);
  }, [savedPostRecord]);

  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    let newLikes = [...likes];
    const hasLikes = newLikes.includes(user.id);
    if (hasLikes) {
      newLikes = newLikes.filter((id) => id !== user.id);
    } else {
      newLikes.push(userId);
    }

    setLikes(newLikes);
    likePost({ postId: post?.$id || "", likesArray: newLikes });
  };

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);
      return;
    }
    savePost({ userId, postId: post?.$id || "" });
    setIsSaved(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center z-20">
        <div className="flex">
          <div className="flex gap-2 mr-5">
            <img
              src={`${
                checkIsLiked(likes, userId)
                  ? "/assets/icons/liked.svg"
                  : "/assets/icons/like.svg"
              }`}
              alt="like"
              width={20}
              height={20}
              onClick={(e) => handleLikePost(e)}
              className="cursor-pointer"
            />
            <p className="small-medium lg:base-medium">{likes.length}</p>
          </div>
          <Link to={`/post/${post?.$id}`}>
            <div className="flex gap-2">
              <img src="/assets/icons/chat.svg" alt="comment" />{post?.comments.length}
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

import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import PostStats from "./PostStats";
import { useAddComment } from "@/lib/react-query/queriesAndMutation";
import { Input } from "../ui/input";
import { useState } from "react";
import Loader from "./Loader";
import { IPost } from "@/types";
import { useUserContext } from "@/context/AuthContext";
type PostCardProps = {
  post: IPost;
};

const PostCard = ({ post }: PostCardProps) => {
  const currentUser = useUserContext();
  const [comment, setComment] = useState<string>("");
  const { mutate: addComment, isPending: isAddingComment } = useAddComment();
  if (!post.creator) return;

  const formatDateDistance = (dateNumber: number) => {
    const date = new Date(dateNumber);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const formattedDate = formatDateDistance(post.createdAt);

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };
  const handleSendComment = () => {
    if (comment.trim() === "" || !post || !currentUser) {
      return;
    }
    const addCommentData = {
      user: currentUser?._id,
      postId: post?._id,
      comment: comment,
      likes: [],
      createdAt: Date.now(),
    };
    addComment(addCommentData);
    setComment("");
  };
  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${btoa(post.creator._id)}`}>
            <img
              src={
                post?.creator?.photo || "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="rounded-full w-12 lg:h-12"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.firstName}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {formattedDate}
              </p>
              -
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>

        <Link
          to={`/update-post/${post._id}`}
          className={`${currentUser?._id !== post.creator._id && "hidden"}`}
        >
          <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
        </Link>
      </div>
      <Link to={`/post/${post._id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post?.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string) => (
              <li key={tag} className="text-light-3">
                #{tag}
              </li>
            ))}
          </ul>
        </div>
        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="img"
          className="post-card_img"
        />
      </Link>

      <PostStats post={post} userId={currentUser?._id || ""} />

      <div className="flex gap-2 mt-4">
        <img
          src={post?.creator?.photo}
          alt="user"
          className="rounded-full w-[40px] h-[40px]"
        />
        <Input
          className="bg-[#101012] border-none w-full  rounded-xl placeholder:text-[#5c5c7b]"
          placeholder="Write your comment"
          value={comment}
          onChange={(e) => handleCommentChange(e)}
        />
        {isAddingComment ? (
          <div className="flex-center">
            <Loader />
          </div>
        ) : (
          <img
            src="/assets/icons/send.svg"
            alt="send"
            className="cursor-pointer"
            onClick={handleSendComment}
          />
        )}
      </div>
    </div>
  );
};

export default PostCard;

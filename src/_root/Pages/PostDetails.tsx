import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/AuthContext";
import {
  useAddComment,
  useDeletePost,
  useGetPostById,
  useLikeComment,
} from "@/lib/react-query/queriesAndMutation";
import { IComment } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");
  const currentUser = useUserContext();
  const { mutate: deletePost, isPending: isDeletingPost } = useDeletePost();
  const [comment, setComment] = useState<string>("");
  const { mutate: addComment, isPending: isAddingComment } = useAddComment();

  const { mutate: likeComment } = useLikeComment();
  const navigate = useNavigate();
  const formatDateDistance = (dateString: string | undefined) => {
    if (dateString === undefined) {
      return "";
    }
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };
  const formattedCommentDate = (dateString: number | undefined) => {
    if (dateString === undefined) {
      return "";
    }
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const formattedDate = formatDateDistance(post?.createdAt);
  const handleDeletePost = async () => {
    try {
      if (!post || !id) return;
      await deletePost({ postId: id, imageUrl: post.imageUrl });
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };
  const handleSendComment = () => {
    // Check if the comment is not empty
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
  const likeCommentHandler = (commentId: string) => {
    if (!currentUser) throw new Error("User not found");
    const newComments = post?.comments.map((comment: IComment) => {
      if (comment?._id === commentId) {
        const existingLikes = comment.likes || [];
        const hasLikes = existingLikes.includes(currentUser._id);

        const newLikes = hasLikes
          ? existingLikes.filter((like: string) => like !== currentUser._id)
          : [currentUser._id, ...existingLikes];

        return newLikes;
      }

      return comment;
    });
    console.log(newComments[0][0]);

    const likeCommentData = {
      commentId,
      likes: newComments[0][0],
    };
    console.log(likeCommentData);

    likeComment(likeCommentData);
  };

  return (
    <div className="post_details-container h-screen">
      {isPending ? (
        <div className="flex-center h-screen">
          <Loader />
        </div>
      ) : (
        <div className="post_details-card">
          <Dialog>
            <DialogTrigger className="w-full flex justify-center items-center">
              <img
                src={post?.imageUrl}
                alt="post"
                className="post_details-img"
              />
            </DialogTrigger>
            <DialogContent className="border-none">
              <img src={post?.imageUrl} alt="post" />
            </DialogContent>
          </Dialog>

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post?.creator._id}`}
                className="flex items-center gap-3"
              >
                <img
                  src={
                    post?.creator?.photo ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="rounded-full w-8 h-8 lg:h-12 lg:w-12"
                />
                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.firstName}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                      {formattedDate}
                    </p>
                    -
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center">
                <Link
                  to={`/update-post/${post?._id}`}
                  className={`${
                    currentUser?._id !== post?.creator._id && "hidden"
                  }`}
                >
                  <img
                    src="/assets/icons/edit.svg"
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>
                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ghost_details-delete_btn ${
                    currentUser?._id !== post?.creator._id && "hidden"
                  } `}
                >
                  {" "}
                  {isDeletingPost ? (
                    <Loader />
                  ) : (
                    <img
                      src="/assets/icons/delete.svg"
                      alt="delete"
                      width={24}
                      height={24}
                    />
                  )}
                </Button>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />
            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular  ">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:h-[200px] lg:overflow-y-scroll lg:custom-scrollbar w-full">
              {post?.comments?.map((comment: IComment, index: number) => (
                <div key={index} className="flex justify-between w-full gap-3">
                  <div>
                    <div className="flex items-start gap-4">
                      <img
                        src={comment.user.photo}
                        alt="user"
                        className="w-[36px] rounded-full"
                      />

                      <p>
                        <span className="text-[#7878a3] text-sm mr-2">
                          {comment.user.username}
                        </span>
                        {comment.comment}
                      </p>
                    </div>
                    <p className="text-light-3 text-xs mt-2 ml-14">
                      {formattedCommentDate(comment.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <img
                      src={
                        comment?.likes?.includes(currentUser?._id || "")
                          ? `/assets/icons/liked.svg`
                          : `/assets/icons/like.svg`
                      }
                      alt="like"
                      className="cursor-pointer"
                      onClick={() => likeCommentHandler(comment._id)}
                    />
                    <p className="text-[#7878a3] text-sm">
                      {comment.likes?.length}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full">
              <PostStats post={post} userId={currentUser?._id || ""} />
            </div>
            <div className="flex gap-2 w-full">
              <img
                src={currentUser?.photo}
                alt="user"
                className="rounded-full w-[40px] h-[40px]"
              />
              <Input
                className="bg-[#101012] border-none w-full lg:w-[400px] rounded-xl placeholder:text-[#5c5c7b]"
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
                  onClick={handleSendComment}
                  className="cursor-pointer"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;

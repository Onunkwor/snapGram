// import { Models } from "appwrite";
// import { Link } from "react-router-dom";
// import { formatDistanceToNow } from "date-fns";
// import { useUserContext } from "@/context/AuthContext";
// import PostStats from "./PostStats";
// import {
//   useAddComment,
//   useGetCurrentUser,
// } from "@/lib/react-query/queriesAndMutation";
// import { Input } from "../ui/input";
// import { useState } from "react";
// import Loader from "./Loader";
// type PostCardProps = {
//   post: Models.Document;
// };

// const PostCard = ({ post }: PostCardProps) => {
//   const { user } = useUserContext();
//   const { data: currentUser } = useGetCurrentUser();
//   const [comment, setComment] = useState<string>("");
//   const { mutate: addComment, isPending: isAddingComment } = useAddComment();
//   if (!post.creator) return;

//   const formatDateDistance = (dateString: string) => {
//     const date = new Date(dateString);
//     return formatDistanceToNow(date, { addSuffix: true });
//   };

//   const formattedDate = formatDateDistance(post.$createdAt);

//   const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setComment(e.target.value);
//   };
//   const handleSendComment = () => {
//     if (comment.trim() === "" || !post || !currentUser) {
//       return;
//     }

//     addComment({
//       postId: post.$id,
//       userName: currentUser.userName,
//       comment: comment,
//       userImage: currentUser.imageUrl,
//     });
//     setComment("");
//   };
//   return (
//     <div className="post-card">
//       <div className="flex-between">
//         <div className="flex items-center gap-3">
//           <Link to={`/profile/${post.creator.$id}`}>
//             <img
//               src={
//                 post?.creator?.imageUrl ||
//                 "/assets/icons/profile-placeholder.svg"
//               }
//               alt="creator"
//               className="rounded-full w-12 lg:h-12"
//             />
//           </Link>
//           <div className="flex flex-col">
//             <p className="base-medium lg:body-bold text-light-1">
//               {post.creator.name}
//             </p>
//             <div className="flex-center gap-2 text-light-3">
//               <p className="subtle-semibold lg:small-regular">
//                 {formattedDate}
//               </p>
//               -
//               <p className="subtle-semibold lg:small-regular">
//                 {post.location}
//               </p>
//             </div>
//           </div>
//         </div>

//         <Link
//           to={`/update-post/${post.$id}`}
//           className={`${user.id !== post.creator.$id && "hidden"}`}
//         >
//           <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
//         </Link>
//       </div>
//       <Link to={`/post/${post.$id}`}>
//         <div className="small-medium lg:base-medium py-5">
//           <p>{post?.caption}</p>
//           <ul className="flex gap-1 mt-2">
//             {post.tags.map((tag: string) => (
//               <li key={tag} className="text-light-3">
//                 #{tag}
//               </li>
//             ))}
//           </ul>
//         </div>
//         <img
//           src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
//           alt="img"
//           className="post-card_img"
//         />
//       </Link>

//       <PostStats post={post} userId={user.id} />

//       <div className="flex gap-2 mt-4">
//         <img
//           src={currentUser?.imageUrl}
//           alt="user"
//           className="rounded-full w-[40px] h-[40px]"
//         />
//         <Input
//           className="bg-[#101012] border-none w-[300px] lg:w-[350px] rounded-xl placeholder:text-[#5c5c7b]"
//           placeholder="Write your comment"
//           value={comment}
//           onChange={(e) => handleCommentChange(e)}
//         />
//         {isAddingComment ? (
//           <div className="flex-center">
//             <Loader />
//           </div>
//         ) : (
//           <img
//             src="/assets/icons/send.svg"
//             alt="send"
//             onClick={handleSendComment}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default PostCard;

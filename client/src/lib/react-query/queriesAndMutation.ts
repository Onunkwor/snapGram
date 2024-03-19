// import {
//   useQuery,
//   useMutation,
//   useQueryClient,
//   useInfiniteQuery,
// } from "@tanstack/react-query";
// import {
//   addComment,
//   createPost,
//   createUserAccount,
//   deleteFollowing,
//   deletePost,
//   deleteSavedPost,
//   followingUser,
//   getCurrentUser,
//   getInfinitePosts,
//   getInfiniteUsers,
//   getPostById,
//   getRecentPosts,
//   getUserById,
//   getUserLikedPosts,
//   getUserPosts,
//   getUserSavedPosts,
//   likeComment,
//   likePost,
//   savePost,
//   searchPosts,
//   signInAccount,
//   signOutAccount,
//   updatePost,
//   updateUser,
// } from "../Appwrite/api";
// import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
// import { QUERY_KEYS } from "./querieKey";

// // ============================================================
// // AUTH QUERIES
// // ============================================================

// export const useCreateUserAccountMutation = () => {
//   return useMutation({
//     mutationFn: (user: INewUser) => createUserAccount(user),
//   });
// };
// export const useSignInAccount = () => {
//   return useMutation({
//     mutationFn: (user: { email: string; password: string }) =>
//       signInAccount(user),
//   });
// };
// export const useSignOutAccount = () => {
//   return useMutation({
//     mutationFn: signOutAccount,
//   });
// };

// // ============================================================
// // POST QUERIES
// // ============================================================

// export const useCreatePost = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (post: INewPost) => createPost(post),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POST_BY_ID],
//       });
//     },
//   });
// };

// export const useGetRecentPosts = () => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//     queryFn: getRecentPosts,
//   });
// };

// export const useLikePost = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({
//       postId,
//       likesArray,
//     }: {
//       postId: string;
//       likesArray: string[];
//     }) => likePost(postId, likesArray),
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_CURRENT_USER],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_USER_POSTS],
//       });
//     },
//   });
// };
// export const useDeletePost = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ postId, imageId }: { postId: string; imageId: string }) =>
//       deletePost({ postId, imageId }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_CURRENT_USER],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POST_BY_ID],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_USER_BY_ID],
//       });
//     },
//   });
// };

// export const useSavePost = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
//       savePost(userId, postId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_CURRENT_USER],
//       });
//     },
//   });
// };

// export const useDeleteSavedPost = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_CURRENT_USER],
//       });
//     },
//   });
// };
// export const useGetPostById = (postId: string) => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
//     queryFn: () => getPostById(postId),
//     enabled: !!postId,
//   });
// };
// export const useUpdatePost = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (post: IUpdatePost) => updatePost(post),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POST_BY_ID],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//       });
//     },
//   });
// };
// export const useGetPosts = () => {
//   return useInfiniteQuery({
//     queryKey: [QUERY_KEYS.GET_POSTS],
//     queryFn: getInfinitePosts,
//     getNextPageParam: (lastPage) => {
//       if (lastPage && lastPage.documents.length === 0) return null;
//       const lastId = lastPage?.documents[lastPage?.documents.length - 1].$id;
//       return lastId || null;
//     },
//     initialPageParam: null,
//   });
// };

// export const useSearchPosts = (searchTerm: string) => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
//     queryFn: () => searchPosts(searchTerm),
//     enabled: !!searchTerm,
//   });
// };
// export const useAddComment = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({
//       postId,
//       userName,
//       comment,
//       userImage
//     }: {
//       postId: string;
//       userName: string;
//       comment: string;
//       userImage: URL
//     }) => addComment(postId, userName, comment,userImage),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POST_BY_ID],
//       });
//     },
//   });
// };
// export const useLikeComment = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//    mutationFn: ({commentId, userId}:{commentId: string, userId: string[]}) => likeComment(commentId, userId),
//    onSuccess: (data) => {
//     queryClient.invalidateQueries({
//       queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.post.$id],
//     });
//     queryClient.invalidateQueries({
//       queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//     });
//     queryClient.invalidateQueries({
//       queryKey: [QUERY_KEYS.GET_POSTS],
//     });
//     queryClient.invalidateQueries({
//       queryKey: [QUERY_KEYS.GET_CURRENT_USER],
//     });
//     queryClient.invalidateQueries({
//       queryKey: [QUERY_KEYS.GET_USER_POSTS],
//     });
//   },
//   })
// }
// // ============================================================
// // USER QUERIES
// // ============================================================
// export const useGetCurrentUser = () => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.GET_CURRENT_USER],
//     queryFn: getCurrentUser,
//   });
// };

// export const useGetUsers = () => {
//   return useInfiniteQuery({
//     queryKey: [QUERY_KEYS.GET_INFINITE_USERS],
//     queryFn: getInfiniteUsers,
//     getNextPageParam: (lastPage) => {
//       if (lastPage && lastPage.documents.length === 0) return null;
//       const lastId = lastPage?.documents[lastPage?.documents.length - 1].$id;
//       return lastId || null;
//     },
//     initialPageParam: null,
//   });
// };

// export const useUpdateUser = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (user: IUpdateUser) => updateUser(user),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_CURRENT_USER],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_USER_BY_ID],
//       });
//     },
//   });
// };

// export const useGetUserById = (userId: string) => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
//     queryFn: () => getUserById(userId),
//   });
// };

// export const useGetUserPosts = (userId?: string) => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
//     queryFn: () => getUserPosts(userId),
//     enabled: !!userId,
//   });
// };
// export const useGetUserLikedPosts = (userId: []) => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.GET_USER_LIKES, userId],
//     queryFn: () => getUserLikedPosts(userId),
//     enabled: !!userId,
//   });
// };
// export const useGetUserSavedPosts = (userId: []) => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.GET_USER_SAVED, userId],
//     queryFn: () => getUserSavedPosts(userId),
//     enabled: !!userId,
//   });
// };
// export const useFollowUser = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({
//       userName,
//       userId,
//       loggedInUserId,
//       loggedInUserName,
//     }: {
//       userName: string;
//       userId: string;
//       loggedInUserId: string;
//       loggedInUserName: string;
//     }) => followingUser(userName, userId, loggedInUserId, loggedInUserName),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_INFINITE_USERS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_CURRENT_USER],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_USERS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_USER_BY_ID],
//       });
//     },
//   });
// };
// export const useDeleteFollowing = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({
//       followingRecordId,
//       followerRecordId,
//     }: {
//       followingRecordId: string;
//       followerRecordId: string;
//     }) => deleteFollowing(followingRecordId, followerRecordId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_INFINITE_USERS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_CURRENT_USER],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_USERS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_USER_BY_ID],
//       });
//     },
//   });
// };

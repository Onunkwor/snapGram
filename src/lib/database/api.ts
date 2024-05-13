import {
  IAddComment,
  ILikeComment,
  ILikePost,
  INewPost,
  ISavePost,
  IUpdatePost,
} from "@/types";
import axios from "axios";
import { storage } from "../firebase/config";
import { toast } from "sonner";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";

// ============================================================
// User QUERIES
// ============================================================
//====================================================GetCurrentUsers

const baseUrl = import.meta.env.VITE_BASE_URL;
export async function getCurrentUser(clerkId: string) {
  try {
    const url = `${baseUrl}/users/clerk/${clerkId}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching currentUser:", error);
    throw error;
  }
}

//====================================================GetAllUsers
export async function getAllUsers({ pageParam }: { pageParam?: number }) {
  try {
    const url = `${baseUrl}/users?cursor=${pageParam}`; // Construct the URL
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

//=====================================================GetUserById
export async function getUserById(id: string) {
  try {
    const response = await axios.get(`${baseUrl}/users/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error fetching user by Id", error);
  }
}

//===================================================FollowUser
export async function followingUser({
  followingRecord,
  followersRecord,
}: {
  followingRecord: string;
  followersRecord: string;
}) {
  try {
    const response = await axios.patch(`${baseUrl}/users/follow`, {
      followingRecord,
      followersRecord,
    });
    return response.data;
  } catch (error) {
    console.log("Error folllowing user", error);
  }
}

//===================================================UnFollowUser

export async function deleteFollowing({
  currentUser,
  user,
  followingRecordList,
  followerRecordList,
}: {
  currentUser: string;
  user: string;
  followingRecordList: string[];
  followerRecordList: string[];
}) {
  try {
    const response = await axios.patch(`${baseUrl}/users/unFollow`, {
      currentUser,
      user,
      followingRecordList,
      followerRecordList,
    });
    return response.data;
  } catch (error) {
    console.log("Error unfollowing user", error);
  }
}

// ============================================================
// POST QUERIES
// ============================================================

// =====================================================CreatePost
export async function createPost(post: INewPost) {
  try {
    if (!post.file) {
      toast.error("Please provide an image");
      return;
    }
    const imageRef = ref(storage, `postImages/${post.imageName}-${v4()}`);
    const uploadedImage = await uploadBytes(imageRef, post.file[0]);
    if (!uploadedImage) throw Error("File upload failed");
    const uploadedImageUrl = await getDownloadURL(imageRef);
    if (!uploadedImageUrl) {
      deleteObject(imageRef);
      throw Error("File upload failed");
    }

    //Convert tags to Array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create the newPost object with required properties
    const newPost = {
      creator: post.creator,
      caption: post.caption,
      imageUrl: uploadedImageUrl,
      location: post.location,
      tags: tags,
      likes: [],
      saved: [],
      comments: [],
      createdAt: post.createdAt,
    };
    console.log(newPost);

    const response = await axios.post(`${baseUrl}/posts`, newPost);

    if (!response) {
      deleteObject(imageRef);
      throw Error("Failed to upload to mongodb");
    }
    toast.success("Post uploaded successfully");
    return response.data;
  } catch (error) {
    console.log("Error creating post:", error);
  }
}

//======================================================DeletePost
export async function deletePost({
  postId,
  imageUrl,
}: {
  postId: string;
  imageUrl: string;
}) {
  try {
    if (!postId || !imageUrl) {
      throw new Error("Provide the postId and the imageUrl");
    }
    // console.log("Getting posts");

    // Fetch the post by its ID
    const post = await axios.get(`${baseUrl}/posts/post/${postId}`);
    const postData = post.data;
    // console.log("deleting comments");

    // Delete all comments associated with the post
    if (postData.comments && postData.comments.length > 0) {
      for (const commentId of postData.comments) {
        await axios.delete(`${baseUrl}/comments/${commentId}`);
      }
    }
    // console.log("deleting saves");

    // Delete all saves associated with the post
    if (postData.saved && postData.saved.length > 0) {
      for (const savedId of postData.saved) {
        await axios.delete(`${baseUrl}/saves/${savedId}`);
      }
    }
    // console.log("deleting post");

    try {
      // console.log("Deleting image from Firebase Storage. Image URL:", imageUrl);
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
      // console.log("File deleted successfully");
    } catch (error) {
      console.error("Error deleting image from Firebase Storage:", error);
      throw error;
    }

    // Delete the post itself
    await axios.delete(`${baseUrl}/posts/${postId}`);

    toast.success("Post deleted successfully");
    return { message: "Post and associated data deleted successfully" };
  } catch (error) {
    console.log("Error deleting post:", error);
    toast.error("Something went wrong");
    throw error;
    // Re-throw the error to propagate it to the caller
  }
}
//=================================================GetPostById
export async function getPostById(id: string) {
  try {
    const url = `${baseUrl}/posts/post/${id}`; // Construct the URL
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

//===================================================GetAllPosts
export async function getAllPosts({ pageParam }: { pageParam?: number }) {
  try {
    const url = `${baseUrl}/posts?cursor=${pageParam}`; // Construct the URL
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

//===================================================GetEntirePost
export async function getEntirePosts() {
  try {
    const url = `${baseUrl}/posts/allPosts`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching entire users:", error);
    throw error;
  }
}

//===================================================CommentOnPost
export async function addComment(data: IAddComment) {
  try {
    if (!data.user || !data.postId) {
      toast.error("Error adding comment");
      return;
    }
    const newComment = {
      user: data.user,
      postId: data.postId,
      comment: data.comment,
      likes: data.likes,
      createdAt: data.createdAt,
    };
    const response = await axios.post(`${baseUrl}/comments`, newComment);
    toast.success("Comment added");
    return response.data;
  } catch (error) {
    console.error("Error adding comment to database", error);
    throw error;
  }
}
//===================================================LikeComment
export async function likeComment(data: ILikeComment) {
  try {
    if (!data.commentId || !data.likes) {
      toast.error("Error liking comment");
      return;
    }
    const likeComment = {
      likes: data.likes,
    };
    const response = await axios.patch(
      `${baseUrl}/comments/${data.commentId}`,
      likeComment
    );
    return response.data;
  } catch (error) {
    console.error("Error comment liking comment to database", error);
    throw error;
  }
}
//====================================================LikePost
export async function likePost(data: ILikePost) {
  try {
    if (!data.postId || !data.likes) {
      toast.error("Error liking post");
      return;
    }
    const newLike = {
      likes: data.likes,
    };
    const response = await axios.patch(
      `${baseUrl}/posts/likes/${data.postId}`,
      newLike
    );
    return response.data;
  } catch (error) {
    console.error("Error updating post likes database", error);
    throw error;
  }
}

//=====================================================SavePost
export async function savePost(data: ISavePost) {
  try {
    if (!data.user || !data.postId || !data.createdAt) {
      toast.error("Error saving post");
      return;
    }
    const newSave = {
      user: data.user,
      postId: data.postId,
      createdAt: data.createdAt,
    };
    const response = await axios.post(`${baseUrl}/saves`, newSave);
    toast.success("Post saved");
    return response.data;
  } catch (error) {
    console.error("Error updating post likes database", error);
    throw error;
  }
}
//=====================================================SavePost
export async function deleteSavePost(id: string) {
  try {
    if (!id) {
      toast.error("Error delete post");
      return;
    }
    const response = await axios.delete(`${baseUrl}/saves/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error updating post likes database", error);
    throw error;
  }
}

//======================================================SearchPosts
export async function searchPosts(searchTerm: string) {
  try {
    const url = `${baseUrl}/posts/searchPost?query=${searchTerm}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log("Error searching for post search", error);
  }
}
//=================================================UpdatePost
export async function updatePost(data: IUpdatePost) {
  try {
    if (data.file.length === 1) {
      const oldImageRef = ref(storage, data.imageUrl);
      await deleteObject(oldImageRef);
      const imageRef = ref(storage, `postImages/${data.file[0].name}-${v4()}`);
      const uploadedImage = await uploadBytes(imageRef, data.file[0]);
      if (!uploadedImage) throw Error("File upload failed");
      const uploadedImageUrl = await getDownloadURL(imageRef);
      if (!uploadedImageUrl) {
        deleteObject(imageRef);
        throw Error("File upload failed");
      }
      const newData = {
        caption: data.caption,
        imageUrl: uploadedImageUrl,
        location: data.location,
        tags: data.tags,
      };
      // console.log(newData);
      const response = await axios.patch(
        `${baseUrl}/posts/updatePost/${data.postId} `,
        newData
      );
      return response.data;
    }
    const newData = {
      caption: data.caption,
      imageUrl: data.imageUrl,
      location: data.location,
      tags: data.tags,
    };
    // console.log(newData);
    const response = await axios.patch(
      `${baseUrl}/posts/updatePost/${data.postId} `,
      newData
    );
    toast.success("Post updated successfully");
    return response.data;
  } catch (error) {
    console.log("Error updating post", error);
    toast.error("Something went wrong");
  }
}

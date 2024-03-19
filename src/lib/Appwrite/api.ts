// import { ID, Permission, Query, Role } from "appwrite";

// import { appWriteConfig, account, databases, storage, avatars } from "./config";
// import { IUpdatePost, INewPost, INewUser, IUpdateUser } from "@/types";

// // ============================================================
// // AUTH
// // ============================================================

// // ============================== SIGN UP
// export async function createUserAccount(user: INewUser) {
//   try {
//     const newAccount = await account.create(
//       ID.unique(),
//       user.email,
//       user.password,
//       user.name
//     );

//     if (!newAccount) throw Error;

//     const avatarUrl = avatars.getInitials(user.name);

//     const newUser = await saveUserToDB({
//       accountID: newAccount.$id,
//       name: newAccount.name,
//       email: newAccount.email,
//       userName: user.username,
//       imageUrl: avatarUrl,
//     });

//     return newUser;
//   } catch (error) {
//     console.log(error);
//     return error;
//   }
// }

// // ============================== SAVE USER TO DB
// export async function saveUserToDB(user: {
//   accountID: string;
//   email: string;
//   name: string;
//   imageUrl: URL;
//   userName?: string;
// }) {
//   try {
//     const newUser = await databases.createDocument(
//       appWriteConfig.databaseId,
//       appWriteConfig.userCollectionId,
//       ID.unique(),
//       user,
//       [Permission.read(Role.any())]
//     );

//     return newUser;
//   } catch (error) {
//     console.error("Error saving user to DB:", error);
//   }
// }

// // ============================== SIGN IN
// export async function signInAccount(user: { email: string; password: string }) {
//   try {
//     const session = await account.createEmailSession(user.email, user.password);

//     return session;
//   } catch (error) {
//     console.log(error);
//   }
// }

// // ============================== GET ACCOUNT
// export async function getAccount() {
//   try {
//     const currentAccount = await account.get();

//     return currentAccount;
//   } catch (error) {
//     console.log(error);
//   }
// }

// // ============================== GET USER
// export async function getCurrentUser() {
//   try {
//     const currentAccount = await getAccount();

//     if (!currentAccount) throw Error("No current account");

//     const currentUser = await databases.listDocuments(
//       appWriteConfig.databaseId,
//       appWriteConfig.userCollectionId,
//       [Query.equal("accountID", currentAccount.$id)]
//     );

//     if (!currentUser) throw Error("No current account");

//     return currentUser.documents[0];
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// }

// // =============================== Sign Out
// export async function signOutAccount() {
//   try {
//     const session = await account.deleteSession("current");
//     return session;
//   } catch (error) {
//     console.log("Error signing out:", error);
//   }
// }

// // ============================================================
// // POSTS
// // ============================================================

// // ============================== CREATE POST
// export async function createPost(post: INewPost) {
//   try {
//     // Upload file to appwrite storage
//     const uploadedFile = await uploadFile(post.file[0]);

//     if (!uploadedFile) throw Error;

//     // Get file url
//     const fileUrl = getFilePreview(uploadedFile.$id);
//     if (!fileUrl) {
//       await deleteFile(uploadedFile.$id);
//       throw Error;
//     }

//     // Convert tags into array
//     const tags = post.tags?.replace(/ /g, "").split(",") || [];

//     // Create post
//     const newPost = await databases.createDocument(
//       appWriteConfig.databaseId,
//       appWriteConfig.postCollectionId,
//       ID.unique(),
//       {
//         creator: post.userId,
//         caption: post.caption,
//         imageUrl: fileUrl,
//         imageId: uploadedFile.$id,
//         location: post.location,
//         tags: tags,
//       }
//     );

//     if (!newPost) {
//       await deleteFile(uploadedFile.$id);
//       throw Error;
//     }

//     return newPost;
//   } catch (error) {
//     console.log("Error Creating Post", error);
//   }
// }

// // ============================== UPDATE POST
// export async function updatePost(post: IUpdatePost) {
//   const hasFileToUpdate = post.file.length > 0;

//   try {
//     let image = {
//       imageUrl: post.imageUrl,
//       imageId: post.imageId,
//     };

//     if (hasFileToUpdate) {
//       // Upload new file to appwrite storage
//       const uploadedFile = await uploadFile(post.file[0]);
//       if (!uploadedFile) throw Error;

//       // Get new file url
//       const fileUrl = getFilePreview(uploadedFile.$id);
//       if (!fileUrl) {
//         await deleteFile(uploadedFile.$id);
//         throw Error;
//       }

//       image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
//     }

//     // Convert tags into array
//     const tags = post.tags?.replace(/ /g, "").split(",") || [];

//     //  Update post
//     const updatedPost = await databases.updateDocument(
//       appWriteConfig.databaseId,
//       appWriteConfig.postCollectionId,
//       post.postId,
//       {
//         caption: post.caption,
//         imageUrl: image.imageUrl,
//         imageId: image.imageId,
//         location: post.location,
//         tags: tags,
//       }
//     );

//     // Failed to update
//     if (!updatedPost) {
//       // Delete new file that has been recently uploaded
//       if (hasFileToUpdate) {
//         await deleteFile(image.imageId);
//       }

//       // If no new file uploaded, just throw error
//       throw Error;
//     }

//     // Safely delete old file after successful update
//     if (hasFileToUpdate) {
//       await deleteFile(post.imageId);
//     }

//     return updatedPost;
//   } catch (error) {
//     console.log(error);
//   }
// }

// // ============================== UPLOAD FILE
// export async function uploadFile(file: File) {
//   try {
//     const uploadedFile = await storage.createFile(
//       appWriteConfig.storageId,
//       ID.unique(),
//       file
//     );

//     return uploadedFile;
//   } catch (error) {
//     console.log(error);
//   }
// }

// // ============================== GET FILE URL
// export function getFilePreview(fileId: string) {
//   try {
//     const fileUrl = storage.getFilePreview(
//       appWriteConfig.storageId,
//       fileId,
//       2000,
//       2000,
//       "top"
//     );

//     if (!fileUrl) throw Error;

//     return fileUrl;
//   } catch (error) {
//     console.log(error);
//   }
// }

// // ============================== DELETE FILE
// export async function deleteFile(fileId: string) {
//   try {
//     await storage.deleteFile(appWriteConfig.storageId, fileId);

//     return { status: "ok" };
//   } catch (error) {
//     console.log(error);
//   }
// }

// // ============================== GET POSTS
// export async function searchPosts(searchTerm: string) {
//   try {
//     const posts = await databases.listDocuments(
//       appWriteConfig.databaseId,
//       appWriteConfig.postCollectionId,
//       [Query.search("caption", searchTerm)]
//     );

//     if (!posts) throw Error;

//     return posts;
//   } catch (error) {
//     console.log(error);
//   }
// }

// // ============================== GET POST BY ID
// export async function getPostById(postId?: string) {
//   if (!postId) throw Error;

//   try {
//     const post = await databases.getDocument(
//       appWriteConfig.databaseId,
//       appWriteConfig.postCollectionId,
//       postId
//     );

//     if (!post) throw Error;

//     return post;
//   } catch (error) {
//     console.log(error);
//   }
// }

// // ============================== DELETE POST
// export async function deletePost({
//   postId,
//   imageId,
// }: {
//   postId: string;
//   imageId: string;
// }) {
//   if (!postId || !imageId) return;

//   try {
//     const statusCode = await databases.deleteDocument(
//       appWriteConfig.databaseId,
//       appWriteConfig.postCollectionId,
//       postId
//     );

//     if (!statusCode) throw Error;

//     await deleteFile(imageId);

//     return { status: "Ok" };
//   } catch (error) {
//     console.log(error);
//   }
// }

// // ============================== LIKE / UNLIKE POST
// export async function likePost(postId: string, likesArray: string[]) {
//   try {
//     const updatedPost = await databases.updateDocument(
//       appWriteConfig.databaseId,
//       appWriteConfig.postCollectionId,
//       postId,
//       {
//         likes: likesArray,
//       }
//     );

//     if (!updatedPost) throw Error;

//     return updatedPost;
//   } catch (error) {
//     console.log("Error liking Post", error);
//   }
// }

// // ============================== SAVE POST
// export async function savePost(userId: string, postId: string) {
//   try {
//     const updatedPost = await databases.createDocument(
//       appWriteConfig.databaseId,
//       appWriteConfig.savesCollectionId,
//       ID.unique(),
//       {
//         user: userId,
//         post: postId,
//       }
//     );

//     if (!updatedPost) throw Error;

//     return updatedPost;
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function followingUser(
//   userName: string,
//   userId: string,
//   loggedInUserId: string,
//   loggedInUserName: string
// ) {
//   try {
//     const followingUser = await databases.createDocument(
//       appWriteConfig.databaseId,
//       appWriteConfig.followingsCollectionId,
//       ID.unique(),
//       {
//         userName: userName,
//         user: loggedInUserId,
//         userId: userId,
//       }
//     );
//     await userFollowers(userId, loggedInUserName, loggedInUserId);
//     if (!followingUser) throw new Error();
//     return followingUser; // Return relevant information
//   } catch (error) {
//     console.error("Error following user:", error);
//     throw error; // Re-throw the error to maintain consistency
//   }
// }

// export async function userFollowers(
//   userId: string,
//   loggedInUserName: string,
//   loggedInUserId: string
// ) {
//   try {
//     // Add the logged-in user to the followers array of the user being followed
//     const followerResponse = await databases.createDocument(
//       appWriteConfig.databaseId,
//       appWriteConfig.followersCollectionId,
//       ID.unique(),
//       {
//         user: userId,
//         userName: loggedInUserName,
//         userId: loggedInUserId,
//       }
//     );
//     if (!followerResponse) throw new Error();
//     return followerResponse;
//   } catch (error) {
//     console.log(error);
//   }
// }

// // ============================== DELETE SAVED POST
// export async function deleteSavedPost(savedRecordId: string) {
//   try {
//     const statusCode = await databases.deleteDocument(
//       appWriteConfig.databaseId,
//       appWriteConfig.savesCollectionId,
//       savedRecordId
//     );

//     if (!statusCode) throw Error;

//     return { status: "Ok" };
//   } catch (error) {
//     console.log("Error deleting post", error);
//   }
// }
// // ================================ Delete following
// export async function deleteFollowing(
//   followingRecordId: string,
//   followerRecordId: string
// ) {
//   try {
//     // console.log(followerRecordId,followingRecordId);

//     const statusCode = await databases.deleteDocument(
//       appWriteConfig.databaseId,
//       appWriteConfig.followingsCollectionId,
//       followingRecordId
//     );
//     await deleteFollower(followerRecordId);
//     if (!statusCode) throw "Error deleting following record";
//     return { status: "Ok" };
//   } catch (error) {
//     console.log(error);
//   }
// }
// // ================================== Delete follower
// export async function deleteFollower(followerRecordId: string) {
//   try {
//     const statusCode = await databases.deleteDocument(
//       appWriteConfig.databaseId,
//       appWriteConfig.followersCollectionId,
//       followerRecordId
//     );
//     if (!statusCode) throw "Error deleting follower record";
//     return { status: "Ok" };
//   } catch (error) {
//     console.log(error);
//   }
// }
// // ============================== GET USER'S POST
// export async function getUserPosts(userId?: string) {
//   if (!userId) return;

//   try {
//     const post = await databases.listDocuments(
//       appWriteConfig.databaseId,
//       appWriteConfig.postCollectionId,
//       [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
//     );

//     if (!post) throw Error;

//     return post;
//   } catch (error) {
//     console.log(error);
//   }
// }
// // ============================== GET USER'S Liked POST
// export async function getUserLikedPosts(postIds: []) {
//   try {
//     const posts = [];

//     for (const postId of postIds) {
//       const post = await databases.getDocument(
//         appWriteConfig.databaseId,
//         appWriteConfig.postCollectionId,
//         postId
//       );
//       posts.push(post);
//     }

//     return posts;
//   } catch (error) {
//     console.error(error);
//   }
// }

// //======================================== Get User Saved Posts
// export async function getUserSavedPosts(postIds: []) {
//   try {
//     const posts = [];

//     for (const postId of postIds) {
//       const post = await databases.getDocument(
//         appWriteConfig.databaseId,
//         appWriteConfig.postCollectionId,
//         postId
//       );
//       posts.push(post);
//     }

//     return posts;
//   } catch (error) {
//     console.error(error);
//   }
// }

// // ============================== GET POPULAR POSTS (BY HIGHEST LIKE COUNT)
// export async function getRecentPosts() {
//   try {
//     const posts = await databases.listDocuments(
//       appWriteConfig.databaseId,
//       appWriteConfig.postCollectionId,
//       [Query.orderDesc("$createdAt"), Query.limit(20)]
//     );

//     if (!posts) throw Error;

//     return posts;
//   } catch (error) {
//     console.log("Error getting Posts", error);
//   }
// }

// // ============================== Get Infinite Post
// export async function getInfinitePosts({
//   pageParam,
// }: {
//   pageParam: string | null;
// }) {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(9)];

//   if (pageParam) {
//     queries.push(Query.cursorAfter(pageParam));
//   }

//   try {
//     const posts = await databases.listDocuments(
//       appWriteConfig.databaseId,
//       appWriteConfig.postCollectionId,
//       queries
//     );

//     if (!posts) throw Error;

//     return posts;
//   } catch (error) {
//     console.log("Error getting posts", error);
//   }
// }
// // ============================================================
// // USER
// // ============================================================

// // ============================== GET USERS
// export async function getUsers(limit?: number) {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const queries: any[] = [Query.orderDesc("$createdAt")];

//   if (limit) {
//     queries.push(Query.limit(limit));
//   }

//   try {
//     const users = await databases.listDocuments(
//       appWriteConfig.databaseId,
//       appWriteConfig.userCollectionId,
//       queries
//     );

//     if (!users) throw Error;

//     return users;
//   } catch (error) {
//     console.log(error);
//   }
// }

// // ============================== GET USER BY ID
// export async function getUserById(userId: string) {
//   try {
//     const user = await databases.getDocument(
//       appWriteConfig.databaseId,
//       appWriteConfig.userCollectionId,
//       userId
//     );

//     if (!user) throw Error;

//     return user;
//   } catch (error) {
//     console.log(error);
//   }
// }

// // ============================== UPDATE USER
// export async function updateUser(user: IUpdateUser) {
//   const hasFileToUpdate = user.file.length > 0;
//   try {
//     let image = {
//       imageUrl: user.imageUrl,
//       imageId: user.imageId,
//     };

//     if (hasFileToUpdate) {
//       // Upload new file to appwrite storage
//       const uploadedFile = await uploadFile(user.file[0]);
//       if (!uploadedFile) throw Error;

//       // Get new file url
//       const fileUrl = getFilePreview(uploadedFile.$id);
//       if (!fileUrl) {
//         await deleteFile(uploadedFile.$id);
//         throw Error;
//       }

//       image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
//     }

//     //  Update user
//     const updatedUser = await databases.updateDocument(
//       appWriteConfig.databaseId,
//       appWriteConfig.userCollectionId,
//       user.userId,
//       {
//         name: user.name,
//         bio: user.bio,
//         imageUrl: image.imageUrl,
//         imageId: image.imageId,
//       }
//     );

//     // Failed to update
//     if (!updatedUser) {
//       // Delete new file that has been recently uploaded
//       if (hasFileToUpdate) {
//         await deleteFile(image.imageId);
//       }
//       // If no new file uploaded, just throw error
//       throw Error;
//     }

//     // Safely delete old file after successful update
//     if (user.imageId && hasFileToUpdate) {
//       await deleteFile(user.imageId);
//     }

//     return updatedUser;
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function getInfiniteUsers({
//   pageParam,
// }: {
//   pageParam: string | null;
// }) {
//   const currentAccount = await getAccount();
//   if (!currentAccount) throw Error("No current account");

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const queries: any[] = [
//     Query.orderDesc("$createdAt"),
//     Query.limit(20),
//     Query.notEqual("accountID", currentAccount.$id),
//   ];
//   if (pageParam) {
//     queries.push(Query.cursorAfter(pageParam));
//   }
//   try {
//     const users = await databases.listDocuments(
//       appWriteConfig.databaseId,
//       appWriteConfig.userCollectionId,
//       queries
//     );
//     if (!users) throw Error(`Error getting users`);
//     return users;
//   } catch (error) {
//     console.log("Error getting users", error);
//   }
// }
// // =============================== Add comments
// export async function addComment(
//   postId: string,
//   userName: string,
//   comment: string,
//   userImage: URL
// ) {
//   try {
//     const comments = await databases.createDocument(
//       appWriteConfig.databaseId,
//       appWriteConfig.commentsCollectionId,
//       ID.unique(),
//       {
//         post: postId,
//         userName,
//         comment,
//         userImage
//       }
//     );
//     if (!comments) throw new Error();
//     return comments;
//   } catch (error) {
//     console.log("Error adding comment", error);
//   }
// }

// export async function likeComment(commentId: string, userId: string[]) {
//   try {
//     const commentLikes = await databases.updateDocument(
//       appWriteConfig.databaseId,
//       appWriteConfig.commentsCollectionId,
//       commentId,
//       {
//         likes: userId,
//       }
//     );

//     if (!commentLikes) throw new Error("Update failed");

//     return commentLikes;
//   } catch (error) {
//     console.error("Error liking comment", error);
//   }
// }

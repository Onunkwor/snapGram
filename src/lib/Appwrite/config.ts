import { Client, Account, Databases, Storage, Avatars } from "appwrite";

export const appWriteConfig = {
  url: import.meta.env.VITE_APPWRITE_URL,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  userCollectionId: import.meta.env.VITE_APPWRITE_USER_COLLECTIONS_ID,
  postCollectionId: import.meta.env.VITE_APPWRITE_POST_COLLECTIONS_ID,
  savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTIONS_ID,
  followersCollectionId: import.meta.env.VITE_APPWRITE_FOLLOWERS_COLLECTIONS_ID,
  followingsCollectionId: import.meta.env.VITE_APPWRITE_FOLLOWINGS_COLLECTIONS_ID,
  commentsCollectionId: import.meta.env.VITE_APPWRITE_COMMENT_COLLECTIONS_ID
};

export const client = new Client();

client.setEndpoint(appWriteConfig.url);
client.setProject(appWriteConfig.projectId);


export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);

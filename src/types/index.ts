export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

export type IUpdateUser = {
  userId: string;
  name: string;
  bio: string;
  imageId: string;
  imageUrl: URL | string;
  file: File[];
};

export type INewPost = {
  creator: string;
  caption: string;
  file: File[];
  imageName: string;
  imageUrl: string;
  location?: string;
  tags?: string;
  createdAt: number;
};
export type IPost = {
  _id: string;
  creator: {
    _id: string;
    firstName: string;
    username: string;
    lastName: string;
    photo: string;
    clerkId: string;
    email: string;
  };
  caption: string;
  imageUrl: string;
  location: string;
  tags: [];
  createdAt: number;
  likes: string[];
  saved: string[];
  comments: [];
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageUrl: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type ILikePost = {
  postId: string;
  likes: string[];
};
export type ILikeComment = {
  commentId: string;
  likes: string[];
};
export type ISavePost = {
  user: string;
  postId: string;
  createdAt: number;
};

export type IUser = {
  _id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  photo: string;
  username: string;
  saved: [];
  followers: [];
  following: [];
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type IAddComment = {
  user: string;
  postId: string;
  comment: string;
  likes?: string[];
  createdAt: number;
};

export type IComment = {
  _id: string;
  user: IUser;
  postId: string;
  comment: string;
  likes?: string[];
  createdAt: number;
};

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
  userId: string;
  caption: string;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUpdatePost = {
  postId: string;
  caption: string;
  imageId: string;
  imageUrl: URL;
  file: File[];
  location?: string;
  tags?: string;
};

export type IUser = {
  id: string;
  name: string;
  userName: string;
  email: string;
  imageUrl: string;
  bio: string;
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};
export type ICurrentUser = {
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $permissions: any[];
  $updatedAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Liked?: any[];
  accountID?: string;
  bio?: string | null;
  email?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  followers?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  following?: any[];
  imageId?: string | null;
  imageUrl?: string;
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  posts?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save?: any[];
  userName?: string;
};
export type IFollowing = {
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $permissions: any[];
  $updatedAt: string;
  userId: string;
  userName: string;
};

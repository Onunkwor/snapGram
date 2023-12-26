// UserStories component

import {
  useGetCurrentUser,
  useGetUsers,
} from "@/lib/react-query/queriesAndMutation";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const UserStories = () => {
  const { data: currentUser } = useGetCurrentUser();
  const { data: users, fetchNextPage, hasNextPage, isPending } = useGetUsers();
  //  console.log(currentUser);
   
  if (!currentUser || !users) {
    return (
      <div className="flex w-full justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex gap-4 w-full overflow-x-auto no-scrollbar">
      <Link to={`/profile/${currentUser?.$id}`}>
        <div className="btn-gradient-1">
          <img
            src={currentUser?.imageUrl}
            alt="image"
            className="w-[72px] h-[72px] rounded-full object-cover"
          />
        </div>
      </Link>
      {users?.pages.map((page) =>
        page?.documents.map((user: Models.Document) => (
          <Link to={`/profile/${user.$id}`} key={user.$id}>
            <div className="btn-gradient-1">
              <img
                src={user.imageUrl}
                alt="image"
                className="w-[72px] h-[72px] rounded-full object-cover"
              />
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default UserStories;

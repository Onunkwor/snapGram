import Loader from "@/components/shared/Loader";
import { useGetUsers } from "@/lib/react-query/queriesAndMutation";
import { useInView } from "react-intersection-observer";
import React, { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import UserCard from "@/components/shared/UserCard";
import { IUser } from "@/types";

const AllUsers = () => {
  const { data: users, fetchNextPage, hasNextPage } = useGetUsers();
  const { ref, inView } = useInView();
  const currentUser = useUserContext();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <div className="mx-auto custom-scrollbar h-screen overflow-y-auto w-full">
      <div className="flex pt-16 gap-2 justify-center">
        <img
          src="/assets/icons/people.svg"
          width={30}
          height={30}
          className="text-white"
          alt="people"
        />
        <h1 className="h3-bold md:h1-bold ">All Users</h1>
      </div>

      <ul className="grid grid-cols-2 lg:grid-cols-4 p-10 gap-4 lg:gap-4 justify-center overflow-x-hidden w-full overflow-y-scroll custom-scrollbar">
        {users?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page
              .filter((user: IUser) => {
                return user._id !== currentUser?._id;
              })
              .map((user: IUser) => (
                <li key={user?._id}>
                  <UserCard user={user} action={"All User"} />
                </li>
              ))}
          </React.Fragment>
        ))}
      </ul>

      {hasNextPage && (
        <div ref={ref}>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default AllUsers;

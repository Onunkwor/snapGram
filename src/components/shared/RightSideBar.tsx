import { useInView } from "react-intersection-observer";
import { useGetUsers } from "@/lib/react-query/queriesAndMutation";
import React, { useEffect } from "react";
import Loader from "./Loader";
import { IUser } from "@/types";
import UserCard from "./UserCard";
import { useUserContext } from "@/context/AuthContext";

const RightSideBar = () => {
  const { data, fetchNextPage, hasNextPage, isPending } = useGetUsers();
  const currentUser = useUserContext();

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);
  if (isPending) {
    return (
      <div className="flex-center w-full justify-center items-center h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <h2 className="p-8 h3-bold md:h2-bold">Top Creators</h2>

      <ul className="grid grid-cols-2 p-8 gap-8 ">
        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page
              .filter((user: IUser) => {
                return user.clerkId !== currentUser?.clerkId;
              })
              .map((user: IUser) => (
                <li key={user?._id}>
                  <UserCard user={user} action="Top Creator" />
                </li>
              ))}
          </React.Fragment>
        ))}
      </ul>

      {hasNextPage ? (
        <div ref={ref} className="flex-center">
          <Loader />
        </div>
      ) : null}
    </div>
  );
};

export default RightSideBar;

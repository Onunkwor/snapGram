import { useGetUsers } from "@/lib/react-query/queriesAndMutation";
import { useInView } from "react-intersection-observer";
import Loader from "./Loader";
import UserCard from "./UserCard";
import React, { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";

const RightSideBar = () => {
  const { data: users, fetchNextPage, hasNextPage } = useGetUsers();
  const { ref, inView } = useInView();
  const { user: currentUser } = useUserContext();
  // console.log(currentUser);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <div>
      <h2 className="p-8 h3-bold md:h2-bold">Top Creators</h2>

      <ul className="grid grid-cols-2 p-8 gap-8">
        {users?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page?.documents
              .filter((user) => {
                return user.$id !== currentUser.id;
              })
              .map((user) => (
                <li key={user?.$id}>
                  <UserCard user={user} action="Top Creator" />
                </li>
              ))}
          </React.Fragment>
        ))}
      </ul>

      {hasNextPage ? (
        <div ref={ref}>
          <Loader />
        </div>
      ) : null}
    </div>
  );
};

export default RightSideBar;

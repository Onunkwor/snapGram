import Loader from "@/components/shared/Loader";
import { useGetUsers } from "@/lib/react-query/queriesAndMutation";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import People from "@/components/shared/People";
const AllUsers = () => {
  const { data: users, fetchNextPage, hasNextPage } = useGetUsers();
  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);
  // console.log(users);

  return (
    <div>
      <div>
        {users?.pages.map((user, index) => {
          return <People user={user?.documents} key={index} />;
        })}
      </div>
      {hasNextPage ? (
        <div ref={ref}>
          <Loader />
        </div>
      ) : null}
    </div>
  );
};

export default AllUsers;

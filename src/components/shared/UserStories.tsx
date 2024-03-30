import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { useGetUsers } from "@/lib/react-query/queriesAndMutation";
import Loader from "./Loader";
import { IUser } from "@/types";
import { useUserContext } from "@/context/AuthContext";

const UserStories = () => {
  const currentUser = useUserContext();
  const { data: users } = useGetUsers();

  if (!currentUser || !users) {
    return (
      <div className="flex w-full justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex gap-4 !w-full !overflow-x-scroll">
      <div className="btn-gradient-1">
        <Dialog>
          <DialogTrigger>
            <img
              src={currentUser?.photo}
              alt="image"
              className="!w-[72px] !h-[72px] rounded-full object-cover"
            />
          </DialogTrigger>
          <DialogContent className="bg-transparent flex justify-center items-center border-none">
            <img
              src={currentUser?.photo}
              className="w-[300px] h-[300px] object-cover rounded-2xl"
            />
          </DialogContent>
        </Dialog>
      </div>
      {users?.pages.map((page) =>
        page
          ?.filter((user: IUser) => user._id !== currentUser._id)
          .map((user: IUser) => (
            <div className="btn-gradient-1" key={user._id}>
              <Dialog>
                <DialogTrigger>
                  <img
                    src={user.photo}
                    alt="image"
                    className="!w-[72px] !h-[72px] rounded-full object-cover"
                  />
                </DialogTrigger>
                <DialogContent className="bg-transparent flex justify-center items-center border-none ">
                  <img
                    src={user.photo}
                    className="w-[300px] h-[300px] object-cover rounded-2xl"
                  />
                </DialogContent>
              </Dialog>
            </div>
          ))
      )}
    </div>
  );
};

export default UserStories;

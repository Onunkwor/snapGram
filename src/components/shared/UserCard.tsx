import { ICurrentUser } from "@/types";
import { Button } from "../ui/button";

type UserProps = {
    user: ICurrentUser
    action: "All User" | "Top Creator"
  };
  

const UserCard = ({ user, action }: UserProps) => {

  return (
    <div className={`w-48 h-48 border flex flex-col justify-center p-10 gap-2 items-center rounded-3xl ${action === "All User" ? "border-[#101012]" : "border-white"}`}>
    <img src={user?.imageUrl} alt="user" className="w-14 h-14 rounded-full" />
    <p className="font-semibold">{user?.name}</p>
    <p className="text-[#7878A3] font-medium tiny-medium -mt-2">@{user?.userName}</p>
    <Button className="px-[6px] py-[18px] bg-[#877EFF] rounded-lg flex justify-center items-center w-[74px] h-[30px] font-semibold text-xs text-center">Follow</Button>
  </div>
  );
};

export default UserCard;
import { Button } from "../ui/button";

type UserProps = {
    user: {
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
      imageId?: string | null;
      imageUrl?: string;
      name?: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      posts?: any[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      save?: any[];
      userName?: string;
    };
  };
  

const UserCard = ({ user }: UserProps) => {
//   console.log(user);

  return (
    <div className="w-48 h-48 border border-white flex flex-col justify-center items-center gap-4 rounded-3xl">
      <img src={user?.imageUrl} alt="user" className="w-14 h-14 rounded-full " />
      <p className="font-semibold">{user?.userName}</p>
       <Button className="px-[6px] py-[18px] bg-[#877EFF] rounded-lg flex justify-center items-center w-[74px] h-[30px] font-semibold text-xs text-center">Follow</Button>
    </div>
  );
};

export default UserCard;
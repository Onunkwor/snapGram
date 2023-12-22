import GridPostList from "@/components/shared/GridPostList";
import {
  useGetCurrentUser,
  useGetUserSavedPosts,
} from "@/lib/react-query/queriesAndMutation";
import { Models } from "appwrite";

const Saved = () => {
  const { data: user } = useGetCurrentUser();
   console.log(user)

  const savedPostsIds = user?.save.map(
    (savedPost: Models.Document) => savedPost.post.$id
  );
  // console.log(savedPostsIds);

  const { data: savedPosts } = useGetUserSavedPosts(savedPostsIds);

  return (
    <div className="ml-8">
      <div className="flex pt-16 lg:pl-8 gap-2 justify-start">
        <img
          src="/assets/icons/save.svg"
          width={30}
          height={30}
          className="text-white"
          alt="people"
        />
        <h1 className="h3-bold md:h1-bold ">Saved</h1>
      </div>
      <ul className="md:ml-10 mt-10 ml-6 ">
        <li>
          <GridPostList posts={savedPosts} />
        </li>
      </ul>
    </div>
  );
};

export default Saved;

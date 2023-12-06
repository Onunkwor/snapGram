import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type GridPostListsProps = {
  posts?: Models.Document[];
  showUser?: boolean;
  showStats?: boolean; 
};

const GridPostList = ({ posts, showUser = true, showStats = true }: GridPostListsProps) => {
  const { user } = useUserContext();
  return (
    <ul className="grid-container">
      {posts?.map((post) => (
        <li key={post.$id} className="relative min-w-[80] h-80">
          <Link to={`/post/${post.$id}`} className="grid-post_link">
            <img src={post.imageUrl} alt="post" className="w-full h-full object-cover" />
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center gap-2 justify-start flex-1">
                 <img src={post.creator.imageUrl} alt="user" className="h-8 w-8 rounded-full" />
                 <p className="line-clamp-1">{post.creator.name}</p>
              </div>
            )}
             {showStats && <PostStats post={post} userId={user.id} /> }
          </div>
         
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;

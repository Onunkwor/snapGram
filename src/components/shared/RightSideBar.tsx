// import { useGetUsers } from "@/lib/react-query/queriesAndMutation";
// import { useInView } from "react-intersection-observer";
// import Loader from "./Loader";
// import UserCard from "./UserCard";
// import React, { useEffect } from "react";
// import { useUserContext } from "@/context/AuthContext";

// const RightSideBar = () => {
//   const { data: users, fetchNextPage, hasNextPage, isPending } = useGetUsers();
//   const { ref, inView } = useInView();
//   const { user: currentUser } = useUserContext();

//   useEffect(() => {
//     if (inView) {
//       fetchNextPage();
//     }
//   }, [inView, fetchNextPage]);
//   if(isPending){
//     return (<div className="flex-center w-full justify-center items-center h-full">
//       <Loader />
//     </div>)
//   }

//   return (
//     <div>
//       <h2 className="p-8 h3-bold md:h2-bold">Top Creators</h2>

//       <ul className="grid grid-cols-2 p-8 gap-8">
//         {users?.pages.map((page, pageIndex) => (
//           <React.Fragment key={pageIndex}>
//             {page?.documents
//               .filter((user) => {
//                 return user.$id !== currentUser.id;
//               })
//               .map((user) => (
//                 <li key={user?.$id}>
//                   <UserCard user={user} action="Top Creator" />
//                 </li>
//               ))}
//           </React.Fragment>
//         ))}
//       </ul>

//       {hasNextPage ? (
//         <div ref={ref} className="flex-center">
//           <Loader />
//         </div>
//       ) : null}
//     </div>
//   );
// };

// export default RightSideBar;

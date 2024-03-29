import RootLayout from "@/_root/RootLayout";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
// import ProtectedRoutes from "@/ProtectedRoutes";
import Home from "@/_root/Pages/Home";
import Explore from "@/_root/Pages/Explore";
import CreatePost from "@/_root/Pages/CreatePost";
import SignInPage from "@/Auth/SignInPage";
import SignUpPage from "@/Auth/SignUpPage";
import PostDetails from "@/_root/Pages/PostDetails";
import Profile from "@/_root/Pages/Profile";
import AllUsers from "@/_root/Pages/AllUsers";
import EditPost from "@/_root/Pages/EditPost";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "explore", element: <Explore /> },
      { path: "create-post", element: <CreatePost /> },
      { path: "post/:id", element: <PostDetails /> },
      { path: "profile/:id", element: <Profile /> },
      { path: "all-users", element: <AllUsers /> },
      { path: "/update-post/:id", element: <EditPost /> },
      { path: "/sign-in", element: <SignInPage /> },
      { path: "/sign-up", element: <SignUpPage /> },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;

import RootLayout from "@/_root/RootLayout";
import SignInPage from "@/Auth/SignInPage";
import SignUpPage from "@/Auth/SignUpPage";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ProtectedRoutes from "@/ProtectedRoutes";
import Home from "@/_root/Pages/Home";
import Explore from "@/_root/Pages/Explore";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <RootLayout />
      </ProtectedRoutes>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "explore", element: <Explore /> },
    ],
  },
  { path: "/sign-in", element: <SignInPage /> },
  { path: "/sign-up", element: <SignUpPage /> },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;

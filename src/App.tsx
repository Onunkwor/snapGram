import AuthLayout from "./Auth/AuthLayout";
import SignInForm from "./Auth/Forms/SignInForm";
import SignUpForm from "./Auth/Forms/SignUpForm";
import { Home } from "./_root/Pages";
import "./globals.css";
import { Routes, Route } from "react-router-dom";
import RootLayout from "./_root/RootLayout";
import { Toaster } from "@/components/ui/toaster";
import Explore from "./_root/Pages/Explore";
import Saved from "./_root/Pages/Saved";
import AllUsers from "./_root/Pages/AllUsers";
import CreatePost from "./_root/Pages/CreatePost";
import EditPost from "./_root/Pages/EditPost";
import PostDetails from "./_root/Pages/PostDetails";
import Profile from "./_root/Pages/Profile";
import UpdateProfile from "./_root/Pages/UpdateProfile";
const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* public route */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SignInForm />} />
          <Route path="/sign-up" element={<SignUpForm />} />
        </Route>

        {/* private route */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
        </Route>
      </Routes>
      <Toaster />
    </main>
  );
};

export default App;

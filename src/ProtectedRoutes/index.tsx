import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import Loader from "@/components/shared/Loader";
const ProtectedRoutes = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="loader">
          <Loader />;
        </div>
      </div>
    );
  }
  if (!isSignedIn && isLoaded) {
    return <Navigate to="/sign-in" />;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;

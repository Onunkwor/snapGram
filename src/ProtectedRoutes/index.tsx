import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import Loader from "@/components/shared/Loader";
import { useToken } from "@/context/tokenContext";
const ProtectedRoutes = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const token = useToken();

  if (!isLoaded && token.token === null) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <div className="loader">
          <Loader />
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

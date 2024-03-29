import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
const ProtectedRoutes = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isSignedIn && isLoaded) {
    return <Navigate to="/create-post" />;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;

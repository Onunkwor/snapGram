import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
const ProtectedRoutes = ({ children }: { children: ReactNode }) => {
  const { userId, isLoaded } = useAuth();
  if (!userId && isLoaded) {
    return <Navigate to="/sign-in" />;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;
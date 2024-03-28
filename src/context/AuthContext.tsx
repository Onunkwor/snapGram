import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { IUser } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { getCurrentUser } from "@/lib/database/api";

const AuthContext = createContext<IUser | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<IUser | null>(null);
  const { userId } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (userId) {
          const currentAccount = await getCurrentUser(userId);
          console.log();

          setUserData(currentAccount[0]);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  return (
    <AuthContext.Provider value={userData}>{children}</AuthContext.Provider>
  );
};

export const useUserContext = () => useContext(AuthContext);

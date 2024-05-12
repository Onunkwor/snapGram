import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type tokenContextType = {
  token: string | null;
};

const TokenContext = createContext<tokenContextType>({ token: null });

const TokenProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const { getToken } = useAuth();
  // console.log(token);
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const newToken = await getToken({ skipCache: true });
        setToken(newToken);
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    };

    fetchToken();
    // Schedule token refresh every 60 seconds
    const tokenRefreshInterval = setInterval(fetchToken, 60 * 1000);

    // Clear interval on component unmount
    return () => clearInterval(tokenRefreshInterval);
  }, [getToken, token]);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [token]);

  return (
    <TokenContext.Provider value={{ token }}>{children}</TokenContext.Provider>
  );
};

export const useToken = () => {
  return useContext(TokenContext);
};

export default TokenProvider;

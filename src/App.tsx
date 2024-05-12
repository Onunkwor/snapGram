import "./globals.css";
import { Toaster } from "sonner";
import Router from "./router/Router";
import { AuthProvider } from "./context/AuthContext";
import TokenProvider from "./context/tokenContext";

const App = () => {
  return (
    <>
      <TokenProvider>
        <AuthProvider>
          <Toaster richColors />
          <Router />
        </AuthProvider>
      </TokenProvider>
    </>
  );
};

export default App;

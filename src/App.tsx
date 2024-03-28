import "./globals.css";
import { Toaster } from "sonner";
import Router from "./router/Router";
import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <>
      <AuthProvider>
        <Toaster richColors />
        <Router />
      </AuthProvider>
    </>
  );
};

export default App;

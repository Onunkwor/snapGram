import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryProvider } from "./lib/react-query/QueryProvider";
import { ClerkProvider } from "@clerk/clerk-react";
import React from "react";
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <QueryProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </QueryProvider>
  </ClerkProvider>
);

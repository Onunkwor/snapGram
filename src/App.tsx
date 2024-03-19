import { useEffect } from "react";
import "./globals.css";
import Router from "./router/Router";
import axios from "axios";
const App = () => {
  useEffect(() => {
    axios
      .get("http://localhost:4000/users")
      .then((response) => console.log(response));
  }, []);

  return <Router />;
};

export default App;

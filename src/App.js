import React from "react";
import Auth from "./components/Auth";
import Ingredients from "./components/Ingredients/Ingredients";
import { AuthContext } from "./components/context/auth-context";
import { useContext } from "react";
const App = (props) => {
  const authContext = useContext(AuthContext);
  let content = <Auth />;
  if (authContext.isAuth) {
    content = <Ingredients />;
  }
  return content;
};

export default App;

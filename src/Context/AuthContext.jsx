import { createContext } from "react";
import NavTabItems from "../NavTabItems";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const role = userData?.role || null;
  console.log(role)

  const allowedTabs = NavTabItems.filter(item =>
    item.allowedRoles.includes(role)
  );

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("loginEmail");
  };

  return (
    <AuthContext.Provider value={{ role, allowedTabs, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

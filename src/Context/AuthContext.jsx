import { createContext, useEffect, useState } from "react";
import NavTabItems from "../NavTabItems";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const role = user?.role || null;

  const allowedTabs = NavTabItems.filter(
    (item) => role && item.allowedRoles.includes(role)
  );

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("loginEmail");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ role, allowedTabs, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

import { createContext, useEffect, useState } from "react";
import NavTabItems from "../NavTabItems";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;

    return parsedUser;
  });

  const role = user?.role || null;

  const allowedTabs = NavTabItems.filter(
    (item) => role && item.allowedRoles.includes(role)
  );

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      const parsed = updatedUser ? JSON.parse(updatedUser) : null;
      setUser(parsed);
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
    <AuthContext.Provider value={{ user, role, allowedTabs, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
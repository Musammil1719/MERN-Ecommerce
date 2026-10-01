import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const storedUserId = localStorage.getItem("userId");

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true" &&
      !!storedUserId,
  );

  const [userId, setUserId] = useState(storedUserId || "");

  const login = (id) => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userId", id);

    setIsLoggedIn(true);
    setUserId(id);
  };

  const logout = () => {
    const id = localStorage.getItem("userId");

    // Clear current user's cart
    if (id) {
      localStorage.removeItem(`cart_${id}`);
    }

    // Clear all login data
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");

    // Clear React state
    setIsLoggedIn(false);
    setUserId("");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userId,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
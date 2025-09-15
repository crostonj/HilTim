import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing user session on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('hilTimUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('hilTimUser');
      }
    }
    setIsLoading(false);
  }, []);

  const loginUser = (user) => {
    setCurrentUser(user);
    localStorage.setItem('hilTimUser', JSON.stringify(user));
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('hilTimUser');
  };

  const updateUser = (updatedUserData) => {
    const updatedUser = { ...currentUser, ...updatedUserData };
    setCurrentUser(updatedUser);
    localStorage.setItem('hilTimUser', JSON.stringify(updatedUser));
  };

  const value = {
    currentUser,
    isLoading,
    loginUser,
    logoutUser,
    updateUser,
    isLoggedIn: !!currentUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
import React, {
  createContext,
  useContext,
  useState,
} from 'react';

import { config } from '../config/config';
import { storage } from '../utils/storage';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    return storage.get(
      config.storageKeys.USER_DATA
    );
  });

  const [token, setToken] = useState(() => {
    return storage.get(
      config.storageKeys.AUTH_TOKEN
    );
  });

  const [loading] = useState(false);


  // LOGIN

  const login = (userData, authToken) => {

    setUser(userData);
    setToken(authToken);

    storage.set(
      config.storageKeys.USER_DATA,
      userData
    );

    storage.set(
      config.storageKeys.AUTH_TOKEN,
      authToken
    );
  };


  // LOGOUT

  const logout = () => {

    setUser(null);
    setToken(null);

    storage.remove(
      config.storageKeys.USER_DATA
    );

    storage.remove(
      config.storageKeys.AUTH_TOKEN
    );

    // Remove old keys also
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token),
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }

  return context;
};

export default AuthContext;
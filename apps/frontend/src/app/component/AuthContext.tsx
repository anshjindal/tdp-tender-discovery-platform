import React, { createContext, useState, useContext, ReactNode } from "react";


// Define the shape of your auth state.
interface AuthState {
  isAuthenticated: boolean;
  user: {
    email: string;
    name: string;
  };
}

// Define the context type to include the state and setter functions.
interface AuthContextType {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  // appLoading: boolean;
  // setAppLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with an initial undefined value.
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The provider wraps your app and supplies the auth state.
export const AuthWrapper: React.FC<{ children: ReactNode }> = (props) => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: {
      email: "",
      name: "",
    },
  });
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {props.children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming the auth context.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthWrapper");
  }
  return context;
};

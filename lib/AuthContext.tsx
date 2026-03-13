import { loginUser, registerUser, getCurrentUser, tokenStorage } from "@/lib/api";
import React, { createContext, useContext, useEffect, useState } from "react";

type AppUser = {
  email: string;
  id?: number;
  full_name?: string;
  created_at?: string;
};

type AuthContextValue = {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, full_name: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await tokenStorage.getToken();
        
        if (token) {
          // Fetch actual user data from backend
          const response = await getCurrentUser();
          if (response.success && response.data) {
            setUser({
              email: response.data.email,
              id: response.data.id,
              full_name: response.data.full_name,
              created_at: response.data.created_at,
            });
          } else {
            // Token invalid, clear it
            await tokenStorage.removeToken();
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await loginUser({ email, password });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || "Login failed");
    }

    // Store token (AuthContext handles this!)
    await tokenStorage.setToken(response.data.access_token);
    
    // Fetch user data
    const userResponse = await getCurrentUser();
    if (userResponse.success && userResponse.data) {
      setUser({
        email: userResponse.data.email,
        id: userResponse.data.id,
        full_name: userResponse.data.full_name,
        created_at: userResponse.data.created_at,
      });
    } else {
      setUser({ email });
    }
  };

  const register = async (email: string, password: string, full_name: string) => {
    const response = await registerUser({ email, password, full_name });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || "Registration failed");
    }

    // Store token (AuthContext handles this!)
    await tokenStorage.setToken(response.data.access_token);
    
    // Fetch user data
    const userResponse = await getCurrentUser();
    if (userResponse.success && userResponse.data) {
      setUser({
        email: userResponse.data.email,
        id: userResponse.data.id,
        full_name: userResponse.data.full_name,
        created_at: userResponse.data.created_at,
      });
    } else {
      setUser({ email, full_name });
    }
  };

  const signOut = async () => {
    await tokenStorage.removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
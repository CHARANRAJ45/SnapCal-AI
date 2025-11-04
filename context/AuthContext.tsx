
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Goal, FoodLog } from '../types';
import { mockApi } from '../services/mockApi';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setGoal: (goal: Goal) => Promise<void>;
  getFoodLogs: () => Promise<FoodLog[]>;
  addFoodLog: (log: Omit<FoodLog, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const currentUser = await mockApi.getCurrentUser();
      if (!currentUser) {
        // If there's a token stored but the server reports no user, clear token to avoid stale state
        try { await mockApi.logout(); } catch(e) { /* ignore */ }
        setUser(null);
      } else {
        setUser(currentUser);
      }
    } catch (error) {
      console.info("No active session.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const loggedInUser = await mockApi.login(email, password);
    setUser(loggedInUser);
    setLoading(false);
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    const newUser = await mockApi.register(email, password);
    setUser(newUser);
    setLoading(false);
  };

  const logout = async () => {
    await mockApi.logout();
    setUser(null);
  };

  const setGoal = async (goal: Goal) => {
    if (user) {
      const updatedUser = await mockApi.setGoal(user.id, goal);
      setUser(updatedUser);
    }
  };
  
  const getFoodLogs = async (): Promise<FoodLog[]> => {
    if(!user) return [];
    return await mockApi.getFoodLogs(user.id);
  };

  const addFoodLog = async (log: Omit<FoodLog, 'id' | 'userId' | 'createdAt'>) => {
    if(user) {
      await mockApi.addFoodLog(user.id, log);
    }
  };


  const value = { user, loading, login, register, logout, setGoal, getFoodLogs, addFoodLog };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

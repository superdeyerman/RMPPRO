import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: any | null;
  userData: UserProfile | null;
  loading: boolean;
  login: (role?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('rm_user');
    if (storedUser) {
      const data = JSON.parse(storedUser);
      setUser({ uid: data.uid, email: data.email });
      setUserData(data);
    }
    setLoading(false);
  }, []);

  const login = async (role: string = 'client') => {
    setLoading(true);
    // Simulate real login
    setTimeout(() => {
      let mockUserData: UserProfile;

      switch(role) {
        case 'admin':
          mockUserData = { uid: 'u_admin', email: 'admin@reverenciamajestad.cl', displayName: 'Administrador RM', photoURL: '', role: 'admin', initials: 'AD', createdAt: new Date().toISOString() };
          break;
        case 'pro':
          mockUserData = { uid: 'u_pro', email: 'pro@reverenciamajestad.cl', displayName: 'Profesional RM', photoURL: '', role: 'pro', initials: 'PR', createdAt: new Date().toISOString() };
          break;
        case 'hotel':
          mockUserData = { uid: 'u_hotel', email: 'concierge@hotel.cl', displayName: 'Concierge Hotel', photoURL: '', role: 'hotel', initials: 'HT', createdAt: new Date().toISOString() };
          break;
        default:
          mockUserData = { uid: 'u_client', email: 'cliente@gmail.com', displayName: 'Cliente VIP', photoURL: '', role: 'client', initials: 'CL', createdAt: new Date().toISOString() };
      }

      setUser({ uid: mockUserData.uid, email: mockUserData.email });
      setUserData(mockUserData);
      localStorage.setItem('rm_user', JSON.stringify(mockUserData));
      setLoading(false);
    }, 800);
  };

  const logout = async () => {
    setUser(null);
    setUserData(null);
    localStorage.removeItem('rm_user');
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

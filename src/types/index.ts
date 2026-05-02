export type UserRole = 'admin' | 'stylist' | 'client' | 'vip' | 'hotel';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  phone?: string;
  address?: string;
  hairType?: string;
  notes?: string;
  initials?: string;
  isAvailable?: boolean;
  commissionRate?: number;
  totalServices?: number;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // en minutos
  priceBase: number;
  category: string;
  image: string;
  isHomeServiceAllowed: boolean;
}

export interface Booking {
  id: string;
  clientId: string;
  stylistId?: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  type: 'studio' | 'home';
  address?: string;
  totalAmount: number;
  notes?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  status: 'active' | 'inactive';
}

export interface Earning {
  id: string;
  stylistId: string;
  bookingId: string;
  amount: number;
  commission: number;
  date: string;
}

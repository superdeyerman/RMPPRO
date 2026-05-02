import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  Scissors, 
  LogOut, 
  Settings,
  Bell,
  Search,
  ChevronRight,
  Home,
  Building,
  Globe,
  Zap,
  Activity,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearch?: (query: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, onLogout, activeTab, setActiveTab, onSearch }) => {
  const { userData } = useAuth();
  const [query, setQuery] = React.useState('');

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      if (onSearch) {
        onSearch(query);
      } else {
        setActiveTab('reservas');
      }
    }
  };
  
  const getMenuItems = () => {
    switch (userData?.role) {
      case 'hotel':
        return [
          { id: 'dashboard-hotel', label: 'Portal Hotel', icon: <Building className="w-4 h-4" /> },
        ];
      case 'pro':
        return [
          { id: 'dashboard-agenda', label: 'Mi Agenda', icon: <Calendar className="w-4 h-4" /> },
          { id: 'dashboard-ganancias', label: 'Ganancias', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'dashboard-servicios', label: 'Mis Servicios', icon: <Globe className="w-4 h-4" /> },
        ];
      case 'admin':
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'dashboard-agenda', label: 'Agenda', icon: <Calendar className="w-4 h-4" /> },
          { id: 'dashboard-crm', label: 'CRM Clientes', icon: <Users className="w-4 h-4" /> },
          { id: 'dashboard-tienda', label: 'Marketplace', icon: <ShoppingBag className="w-4 h-4" /> },
          { id: 'dashboard-ganancias', label: 'Ganancias', icon: <TrendingUp className="w-4 h-4" /> },
          { id: 'dashboard-verificacion', label: 'Verificación (KYC)', icon: <ShieldCheck className="w-4 h-4" /> },
          { id: 'dashboard-servicios', label: 'Expansión', icon: <Globe className="w-4 h-4" /> },
          { id: 'dashboard-hotel', label: 'Portal B2B', icon: <Building className="w-4 h-4" /> }
        ];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="admin-wrap grid grid-cols-1 lg:grid-cols-[240px_1fr] min-h-screen bg-ivory">
      {/* Sidebar */}
      <aside className="sidebar fixed lg:static w-full lg:w-auto h-full bg-white border-r border-border z-[1900] flex flex-col overflow-y-auto hidden lg:flex">
        <div className="p-5 border-b border-border flex flex-col gap-1 mb-4">
           <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray">Reverencia Majestad</div>
           <div className="badge b-live text-[0.55rem] w-fit mt-1"><span className="live-dot"></span>Sistema Activo</div>
        </div>

        <div className="sb-section-label px-5 text-[0.55rem] tracking-[0.18em] uppercase text-gray/50 mb-2 mt-4">Principal</div>
        {menuItems.map((item) => (
          <div 
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`sb-link flex items-center gap-3 px-5 py-2.5 text-[0.72rem] cursor-pointer transition-all border-l-2 ${activeTab === item.id ? 'bg-cream text-char border-gold font-medium' : 'text-gray border-transparent hover:bg-ivory hover:text-char'}`}
          >
            <span className="opacity-70">{item.icon}</span>
            <span>{item.label}</span>
            {item.id === 'dashboard-agenda' && <span className="sb-badge ml-auto bg-red text-white text-[0.52rem] px-1.5 py-0.5 rounded-full">5</span>}
          </div>
        ))}

        <div className="sb-section-label px-5 text-[0.55rem] tracking-[0.18em] uppercase text-gray/50 mb-2 mt-8">Operaciones</div>
        <div className="sb-link flex items-center gap-3 px-5 py-2.5 text-[0.72rem] text-gray cursor-pointer hover:bg-ivory hover:text-char transition-all border-l-2 border-transparent">
           <Layers className="w-4 h-4 opacity-70" />
           <span>Automatización</span>
        </div>
        <div className="sb-link flex items-center gap-3 px-5 py-2.5 text-[0.72rem] text-gray cursor-pointer hover:bg-ivory hover:text-char transition-all border-l-2 border-transparent">
           <Activity className="w-4 h-4 opacity-70" />
           <span>Actividad Real</span>
        </div>

        <div className="mt-auto p-5 border-t border-border space-y-2">
          <div onClick={() => setActiveTab('home')} className="sb-link flex items-center gap-3 py-2 text-[0.72rem] text-gray hover:text-char cursor-pointer">
            <Home className="w-4 h-4" />
            <span>Ver Sitio Web</span>
          </div>
          <div onClick={onLogout} className="sb-link flex items-center gap-3 py-2 text-[0.72rem] text-red-500 hover:text-red-700 cursor-pointer">
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </div>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex flex-col min-h-screen">
         {/* Top Header Mobile/Desktop */}
         <header className="h-[60px] bg-white/95 backdrop-blur border-b border-border flex items-center justify-between px-6 sticky top-0 z-[1800]">
            <div className="lg:hidden font-serif tracking-widest text-char">RM</div>
            <div className="hidden lg:flex items-center gap-4 flex-1">
               <Search className="w-4 h-4 text-gray" />
               <input 
                 type="text" 
                 placeholder="Buscar en el sistema..." 
                 className="text-[0.75rem] outline-none bg-transparent w-full" 
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
                 onKeyDown={handleSearch}
               />
            </div>
            
            <div className="flex items-center gap-5">
               <button className="relative">
                  <Bell className="w-4 h-4 text-gray hover:text-char transition-all" />
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-red rounded-full" />
               </button>
               <div className="h-4 w-[1px] bg-border mx-2" />
               <div className="flex items-center gap-3">
                  <div className="text-right leading-none hidden sm:block">
                     <div className="text-[0.72rem] font-bold uppercase tracking-widest text-char">{userData?.displayName || 'Usuario'}</div>
                     <div className="text-[0.55rem] text-gold uppercase tracking-tighter font-semibold mt-1">
                       {userData?.role === 'admin' ? 'Super Administrador' : 
                        userData?.role === 'pro' ? 'Profesional RM' : 
                        userData?.role === 'hotel' ? 'Partner Hotelero' : 'Cliente'}
                     </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gold-l flex items-center justify-center font-serif text-gold-d border border-gold/20 text-xs">
                    {userData?.initials || 'RM'}
                  </div>
               </div>
            </div>
         </header>

         <main className="p-6 lg:p-10 flex-1">
            {children}
         </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

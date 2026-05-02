import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface PublicLayoutProps {
  children: React.ReactNode;
  onLogin: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearch?: (query: string) => void;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children, onLogin, activeTab, setActiveTab, onSearch }) => {
  return (
    <div className="min-h-screen flex flex-col bg-ivory">
      <Navbar onLogin={onLogin} activeTab={activeTab} setActiveTab={setActiveTab} onSearch={onSearch} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;

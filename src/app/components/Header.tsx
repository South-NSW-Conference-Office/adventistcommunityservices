import { Search, User, Menu, LogOut, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import acsLogo from '@/assets/68ee6e4764f54c4a5a0a4c46b17e9e2662a774ac.png';

interface HeaderProps {
  onLogout?: () => void;
  isAuthenticated?: boolean;
}

export function Header({ onLogout, isAuthenticated = false }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={acsLogo} 
              alt="Adventist Community Services" 
              className="h-10 rounded-lg"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-[#F44314] transition-colors font-medium">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-[#F44314] transition-colors font-medium">About</Link>
            <Link to="/services" className="text-gray-700 hover:text-[#F44314] transition-colors font-medium">Services</Link>
            <Link to="/about" className="text-gray-700 hover:text-[#F44314] transition-colors font-medium">Get Involved</Link>
            <Link to="/contact" className="text-gray-700 hover:text-[#F44314] transition-colors font-medium">Contact</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <User className="w-5 h-5 text-gray-600" />
            </button>
            {isAuthenticated && onLogout && (
              <button 
                onClick={onLogout}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden pt-4 pb-2 border-t border-gray-100 mt-3 flex flex-col gap-3">
            <Link to="/" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-[#F44314] font-medium py-2">Home</Link>
            <Link to="/about" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-[#F44314] font-medium py-2">About</Link>
            <Link to="/services" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-[#F44314] font-medium py-2">Services</Link>
            <Link to="/about" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-[#F44314] font-medium py-2">Get Involved</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-[#F44314] font-medium py-2">Contact</Link>
          </nav>
        )}
      </div>
    </header>
  );
}

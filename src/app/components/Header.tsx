import { Search, User, Menu, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import acsLogo from '@/assets/68ee6e4764f54c4a5a0a4c46b17e9e2662a774ac.png';

interface HeaderProps {
  onLogout?: () => void;
  isAuthenticated?: boolean;
}

export function Header({ onLogout, isAuthenticated = false }: HeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={acsLogo} 
              alt="Adventist Community Services" 
              className="h-12 rounded-lg shadow-lg"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-white/90 hover:text-white transition-colors">Home</Link>
            <Link to="/about" className="text-white/90 hover:text-white transition-colors">About</Link>
            <Link to="/services" className="text-white/90 hover:text-white transition-colors">Services</Link>
            <Link to="/contact" className="text-white/90 hover:text-white transition-colors">Contact</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <Search className="w-5 h-5 text-white" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <User className="w-5 h-5 text-white" />
            </button>
            {isAuthenticated && onLogout && (
              <button 
                onClick={onLogout}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-white" />
              </button>
            )}
            <button className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors">
              <Menu className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
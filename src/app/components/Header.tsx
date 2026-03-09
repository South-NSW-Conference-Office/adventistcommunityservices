import { Menu, LogOut, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import acsLogo from '@/assets/68ee6e4764f54c4a5a0a4c46b17e9e2662a774ac.png';

interface HeaderProps {
  onLogout?: () => void;
  isAuthenticated?: boolean;
}

// Pages with dark hero backgrounds — header text must be white when at top
const DETAIL_ROUTE = /^\/(churches|teams|services)\/[^/]+$|^\/about$/;

export function Header({ onLogout, isAuthenticated = false }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isDetailPage = DETAIL_ROUTE.test(location.pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // set initial state
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Reset mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // When scrolled: always solid white
  // When not scrolled on a detail page: transparent + white text
  // When not scrolled on other pages: transparent + gray text
  const solid = scrolled;
  const whiteText = !solid && isDetailPage;

  const linkClass = whiteText
    ? 'text-white/90 hover:text-white transition-colors font-medium'
    : 'text-gray-700 hover:text-[#F44314] transition-colors font-medium';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid
          ? 'bg-white shadow-sm border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={acsLogo}
              alt="Adventist Community Services"
              className="h-10 rounded-lg"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/"         className={linkClass}>Home</Link>
            <Link to="/about"    className={linkClass}>About</Link>
            <Link to="/services" className={linkClass}>Services</Link>
            <Link to="/churches" className={linkClass}>Churches</Link>
            <Link to="/teams"    className={linkClass}>Teams</Link>
            <Link to="/contact"  className={linkClass}>Contact</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated && onLogout && (
              <button
                onClick={onLogout}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className={`w-5 h-5 ${whiteText ? 'text-white/80' : 'text-gray-600'}`} />
              </button>
            )}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen
                ? <X    className={`w-5 h-5 ${whiteText ? 'text-white/80' : 'text-gray-600'}`} />
                : <Menu className={`w-5 h-5 ${whiteText ? 'text-white/80' : 'text-gray-600'}`} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden pt-4 pb-2 border-t border-gray-200 mt-3 flex flex-col gap-3 bg-white/90 backdrop-blur-md rounded-lg px-4 -mx-2">
            <Link to="/"         onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-[#F44314] font-medium py-2">Home</Link>
            <Link to="/about"    onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-[#F44314] font-medium py-2">About</Link>
            <Link to="/services" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-[#F44314] font-medium py-2">Services</Link>
            <Link to="/churches" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-[#F44314] font-medium py-2">Churches</Link>
            <Link to="/teams"    onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-[#F44314] font-medium py-2">Teams</Link>
            <Link to="/contact"  onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-[#F44314] font-medium py-2">Contact</Link>
          </nav>
        )}
      </div>
    </header>
  );
}

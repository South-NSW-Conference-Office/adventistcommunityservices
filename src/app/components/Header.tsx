import { Menu, LogOut, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import acsLogo from '@/assets/68ee6e4764f54c4a5a0a4c46b17e9e2662a774ac.png';

// Pages whose hero has a dark video overlay — nav needs white text to stay legible
const DARK_HERO_ROUTES = ['/about', '/services', '/teams', '/fellowship', '/churches'];

// The header is shown only at the very top of the page — scrolling away hides it
// and scrolling back up does not bring it back until the page is at the top again.
// Small tolerance so momentum scrolling that lands a pixel or two short still counts.
const TOP_TOLERANCE = 4;

interface HeaderProps {
  onLogout?: () => void;
  isAuthenticated?: boolean;
}

export function Header({ onLogout, isAuthenticated = false }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const { pathname } = useLocation();

  const isDarkHero = DARK_HERO_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));

  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY <= TOP_TOLERANCE);

    onScroll(); // a route can be entered already scrolled, e.g. via the back button
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Never hide the bar out from under an open mobile menu.
  const hidden = !atTop && !mobileOpen;

  // The header only ever shows over the top of the hero, so the text colour depends
  // purely on whether that hero is dark.
  const navLinkClass = isDarkHero
    ? 'text-white/90 hover:text-white'
    : 'text-gray-700 hover:text-[#F44314]';

  const iconClass = isDarkHero ? 'text-white/90' : 'text-gray-600';

  return (
    <header
      aria-hidden={hidden}
      className={`fixed top-0 left-0 right-0 z-50 bg-transparent transition-opacity duration-200 ${
        hidden ? 'opacity-0 pointer-events-none' : 'opacity-100'
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

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className={`transition-colors font-medium ${navLinkClass}`}>Home</Link>
            <Link to="/services" className={`transition-colors font-medium ${navLinkClass}`}>Services</Link>
            <Link to="/teams" className={`transition-colors font-medium ${navLinkClass}`}>Teams</Link>
            <Link to="/fellowship" className={`transition-colors font-medium ${navLinkClass}`}>Fellowship</Link>
            <Link to="/about" className={`transition-colors font-medium ${navLinkClass}`}>About</Link>
            <Link to="/contact" className={`transition-colors font-medium ${navLinkClass}`}>Contact</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated && onLogout && (
              <button
                onClick={onLogout}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className={`w-5 h-5 ${iconClass}`} />
              </button>
            )}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen
                ? <X className={`w-5 h-5 ${iconClass}`} />
                : <Menu className={`w-5 h-5 ${iconClass}`} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden pt-4 pb-2 border-t border-gray-200 mt-3 flex flex-col gap-3 bg-white/95 backdrop-blur-md rounded-lg px-4 -mx-2">
            <Link to="/" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-[#F44314] font-medium py-2">Home</Link>
            <Link to="/services" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-[#F44314] font-medium py-2">Services</Link>
            <Link to="/teams" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-[#F44314] font-medium py-2">Teams</Link>
            <Link to="/fellowship" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-[#F44314] font-medium py-2">Fellowship</Link>
            <Link to="/about" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-[#F44314] font-medium py-2">About</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className="text-gray-700 hover:text-[#F44314] font-medium py-2">Contact</Link>
          </nav>
        )}
      </div>
    </header>
  );
}

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Services } from './pages/Services';
import { ServiceDetails } from './pages/ServiceDetails';
import { ComingSoon } from './pages/ComingSoon';
import { ForgotPassword } from './pages/ForgotPassword';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { isAuthenticated, loading, logout } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F44314] via-[#F97023] to-[#F98344] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
          <p className="text-white/80 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show coming soon / login page if not authenticated
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<ComingSoon />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F44314] via-[#F97023] to-[#F98344]">
      <Header onLogout={logout} isAuthenticated={isAuthenticated} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetails />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">About ACS</h3>
              <p className="text-white/70 text-sm">
                Australia's Adventist Community Service provides support and assistance to communities across the nation.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="text-white/70 hover:text-white transition-colors">About Us</a></li>
                <li><a href="/services" className="text-white/70 hover:text-white transition-colors">Services</a></li>
                <li><a href="#" className="text-white/70 hover:text-white transition-colors">Get Involved</a></li>
                <li><a href="/contact" className="text-white/70 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/services" className="text-white/70 hover:text-white transition-colors">Food Bank</a></li>
                <li><a href="/services" className="text-white/70 hover:text-white transition-colors">Clothing</a></li>
                <li><a href="/services" className="text-white/70 hover:text-white transition-colors">Counseling</a></li>
                <li><a href="/services" className="text-white/70 hover:text-white transition-colors">Emergency Relief</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-white/70">
                <li>1800 ADVENTIST</li>
                <li>info@acs.org.au</li>
                <li>Monday - Friday: 9am - 5pm</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/70 text-sm">
            <p>&copy; 2024 Australia's Adventist Community Service. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

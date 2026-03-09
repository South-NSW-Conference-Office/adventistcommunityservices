import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Services } from './pages/Services';
import { ServiceDetails } from './pages/ServiceDetails';
import { Churches } from './pages/Churches';
import { ChurchDetails } from './pages/ChurchDetails';
import { Teams } from './pages/Teams';
import { TeamDetails } from './pages/TeamDetails';
import { ComingSoon } from './pages/ComingSoon';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Preview } from './pages/Preview';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { EditModeProvider } from './contexts/EditModeContext';
import { EditModeFloatingButton, EditModeSaveBar } from './components/editable';
import { Toaster } from './components/ui/sonner';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Header onLogout={logout} isAuthenticated={isAuthenticated} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetails />} />
        <Route path="/churches" element={<Churches />} />
        <Route path="/churches/:id" element={<ChurchDetails />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/:id" element={<TeamDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/preview/:token" element={<Preview />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
      </Routes>

      {/* Edit Mode UI */}
      <EditModeFloatingButton />
      <EditModeSaveBar />
      <Toaster position="top-right" richColors />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-[#1F2937] font-semibold mb-4">About Adventist Community Services</h3>
              <p className="text-gray-500 text-sm">
                Connecting communities with local service teams across Australia. Here to Serve.
              </p>
            </div>
            <div>
              <h3 className="text-[#1F2937] font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="text-gray-500 hover:text-[#F44314] transition-colors">About Us</a></li>
                <li><a href="/services" className="text-gray-500 hover:text-[#F44314] transition-colors">Services</a></li>
                <li><a href="/teams" className="text-gray-500 hover:text-[#F44314] transition-colors">Teams</a></li>
                <li><a href="/contact" className="text-gray-500 hover:text-[#F44314] transition-colors">Contact</a></li>
                <li><a href="/about" className="text-gray-500 hover:text-[#F44314] transition-colors">List Your Team</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#1F2937] font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/services?type=op_shop" className="text-gray-500 hover:text-[#F44314] transition-colors">Op Shops</a></li>
                <li><a href="/services?type=food_pantry" className="text-gray-500 hover:text-[#F44314] transition-colors">Food Pantry</a></li>
                <li><a href="/services?type=counseling_service" className="text-gray-500 hover:text-[#F44314] transition-colors">Counseling</a></li>
                <li><a href="/services?type=disaster_response" className="text-gray-500 hover:text-[#F44314] transition-colors">Disaster Response</a></li>
                <li><a href="/services?type=emergency_shelter" className="text-gray-500 hover:text-[#F44314] transition-colors">Emergency Shelter</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[#1F2937] font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>info@communityservices.org.au</li>
                <li>Monday – Friday: 9am – 5pm</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 Adventist Community Services Australia. All rights reserved.</p>
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
        <EditModeProvider>
          <AppContent />
        </EditModeProvider>
      </AuthProvider>
    </Router>
  );
}

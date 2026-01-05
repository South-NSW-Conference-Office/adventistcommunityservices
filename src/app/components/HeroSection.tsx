import { Search, MapPin } from 'lucide-react';
import { useState } from 'react';

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  return (
    <div className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Gradient Background with decorative circles */}
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          {/* Decorative circles */}
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full border-2 border-white/20"></div>
          <div className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-white/30"></div>
          <div className="absolute top-1/2 right-1/3 w-3 h-3 rounded-full bg-white/20"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-32 text-center">
        <p className="text-white/90 text-sm tracking-wider uppercase mb-4">Australia's Adventist Community Service</p>
        <h1 className="text-white text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Discover Services.<br />
          Find Support.
        </h1>
        <p className="text-white/90 text-lg mb-12 max-w-2xl mx-auto">
          Search for community services, support programs, and resources offered by the Adventist Church across Australia. We're here to help you find the assistance you need.
        </p>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row gap-3 max-w-3xl mx-auto">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search for services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-500"
            />
          </div>
          <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-500"
            />
          </div>
          <button className="bg-gradient-to-r from-[#E8653F] to-[#F37B4E] text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all font-medium">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
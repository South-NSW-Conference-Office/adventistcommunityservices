import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constants/categories';

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (location) params.set('location', location);
    navigate(`/services?${params.toString()}`);
  };

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2 flex flex-row items-center gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl min-w-0">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400 text-sm min-w-0"
          />
        </div>
        <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-xl min-w-0">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Postcode"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400 text-sm min-w-0"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-[#F44314] text-white px-4 py-2.5 rounded-xl hover:bg-[#d93a10] transition-colors font-semibold shadow-sm text-sm flex-shrink-0"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {CATEGORIES.map((cat) => (
          <a
            key={cat.type}
            href={`/services?type=${cat.type}`}
            className="px-2 py-0.5 rounded-full bg-white/80 border border-gray-200 text-gray-500 text-[10px] font-medium hover:border-[#F44314] hover:text-[#F44314] transition-colors"
          >
            {cat.label}
          </a>
        ))}
      </div>
    </div>
  );
}

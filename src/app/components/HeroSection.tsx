import { Search, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useCMSPage } from '../hooks/useCMSContent';
import { EditableText, EditableRichText } from './editable';

const CATEGORIES = ['Food', 'Clothing', 'Counseling', 'Emergency Relief', 'Housing', 'Financial Aid', 'Health', 'Education'];

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  const { getBlock } = useCMSPage('home');

  const label = getBlock('hero', 'label') || "Adventist Community Services Australia";
  const title = getBlock('hero', 'title') || 'Find Services Near You';
  const subtitle = getBlock('hero', 'subtitle') || 'Discover community services across Australia by location, type, or postcode. We\'re here to serve you.';
  const searchPlaceholder = getBlock('hero', 'search_placeholder') || 'What are you looking for?';
  const locationPlaceholder = getBlock('hero', 'location_placeholder') || 'Suburb or postcode';
  const searchButtonText = getBlock('hero', 'search_button_text') || 'Search';

  return (
    <div className="bg-[#F8F7F5]">
      <div className="max-w-4xl mx-auto px-6 py-20 md:py-28 text-center">
        <EditableText
          pageId="home"
          sectionId="hero"
          blockKey="label"
          content={label}
          fallback="Adventist Community Services Australia"
          className="text-[#F44314] text-sm font-semibold tracking-wider uppercase mb-4"
          as="p"
        />
        <EditableText
          pageId="home"
          sectionId="hero"
          blockKey="title"
          content={title}
          fallback="Find Services Near You"
          className="text-[#1F2937] text-5xl md:text-6xl font-bold mb-6 leading-tight"
          as="h1"
        />
        <EditableRichText
          pageId="home"
          sectionId="hero"
          blockKey="subtitle"
          content={subtitle}
          fallback="Search community services across Australia by need, location, or postcode. We're here to connect you with support."
          className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto"
        />

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3 flex flex-col md:flex-row gap-3 max-w-3xl mx-auto">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="flex-1 flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder={locationPlaceholder}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <button className="bg-[#F44314] text-white px-8 py-3 rounded-xl hover:bg-[#d93a10] transition-colors font-semibold shadow-sm">
            {searchButtonText}
          </button>
        </div>

        {/* Category Quick Links */}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:border-[#F44314] hover:text-[#F44314] transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

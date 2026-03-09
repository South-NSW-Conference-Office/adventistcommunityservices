import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ServiceLocation, ServiceCapacity, ServiceImage } from '../types/service.types';

const DEFAULT_SERVICE_IMAGE = 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

interface ServiceCardProps {
  id?: string;
  name: string;
  descriptionShort?: string;
  locations?: ServiceLocation[];
  capacity?: ServiceCapacity;
  primaryImage?: ServiceImage;
  teamName?: string;
}

function formatLocation(locations?: ServiceLocation[]): string {
  if (!locations || locations.length === 0) return 'Location TBA';
  const loc = locations[0];
  if (loc.address) {
    const { suburb, state } = loc.address;
    if (suburb && state) return `${suburb}, ${state}`;
    if (suburb) return suburb;
    if (state) return state;
  }
  return loc.label || 'Location TBA';
}

export function ServiceCard({ id, name, descriptionShort, locations, primaryImage, teamName }: ServiceCardProps) {
  const imageUrl = primaryImage?.url || DEFAULT_SERVICE_IMAGE;
  const location = formatLocation(locations);

  const content = (
    <div className="bg-white/30 backdrop-blur-md border border-white/50 rounded-3xl shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col group">
      {/* Image — inset from card edges */}
      <div className="mx-3 mt-3 rounded-2xl overflow-hidden flex-shrink-0" style={{ height: '220px' }}>
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="px-5 pt-4 pb-5 flex flex-col flex-1">
        <h3 className="text-[#1A1A1A] text-xl font-bold mb-1 leading-snug">{name}</h3>
        {teamName && (
          <p className="text-[#F44314] text-xs font-medium mb-2">{teamName}</p>
        )}
        <p className="text-[#6B7280] text-sm leading-relaxed line-clamp-2 flex-1">
          {descriptionShort || 'Community support service.'}
        </p>

        {/* Bottom bar */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1.5 text-[#9CA3AF]">
            <MapPin className="w-4 h-4" />
            <span className="text-[#374151] text-sm font-medium truncate max-w-[120px]">{location}</span>
          </div>
          <span className="bg-white/40 backdrop-blur-sm border border-white/60 text-[#1F2937] text-sm font-semibold px-4 py-2 rounded-full shadow-sm flex-shrink-0">
            Learn More
          </span>
        </div>
      </div>
    </div>
  );

  if (id) {
    return (
      <Link to={`/services/${id}`} className="block h-full hover:-translate-y-1 transition-transform duration-200">
        {content}
      </Link>
    );
  }

  return <div className="h-full">{content}</div>;
}

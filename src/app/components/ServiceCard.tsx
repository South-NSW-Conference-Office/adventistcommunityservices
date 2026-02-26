import { MapPin, Users } from 'lucide-react';
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
}

/**
 * Format location array to display string
 */
function formatLocation(locations?: ServiceLocation[]): string {
  if (!locations || locations.length === 0) return 'Location TBA';

  const loc = locations[0];
  if (loc.address) {
    const { suburb, state } = loc.address;
    if (suburb && state) return `${suburb}, ${state}`;
    if (suburb) return suburb;
    if (state) return state;
  }

  if (loc.label) return loc.label;

  return 'Location TBA';
}

/**
 * Format capacity to display string
 */
function formatCapacity(capacity?: ServiceCapacity): string {
  if (!capacity) return 'Contact for details';

  if (capacity.maxParticipants) {
    return `${capacity.maxParticipants}+ capacity`;
  }

  return 'Contact for details';
}

export function ServiceCard({
  id,
  name,
  descriptionShort,
  locations,
  capacity,
  primaryImage,
}: ServiceCardProps) {
  const imageUrl = primaryImage?.url || DEFAULT_SERVICE_IMAGE;
  const location = formatLocation(locations);
  const capacityText = formatCapacity(capacity);

  const content = (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="p-6">
        <h3 className="text-gray-900 text-xl font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {descriptionShort || 'No description available'}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Users className="w-4 h-4" />
            <span>{capacityText}</span>
          </div>
        </div>
        
        <div className="mt-4">
          <span className="text-[#F44314] font-semibold text-sm hover:text-[#d93a10] transition-colors">
            Learn More →
          </span>
        </div>
      </div>
    </div>
  );

  if (id) {
    return (
      <Link
        to={`/services/${id}`}
        className="group cursor-pointer transition-all hover:scale-[1.02] block h-full"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="group cursor-pointer transition-all hover:scale-[1.02] h-full">{content}</div>
  );
}

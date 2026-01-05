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
    <>
      <div className="relative h-56 overflow-hidden rounded-2xl">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>

      <div className="pt-6">
        <h3 className="text-white text-xl font-semibold mb-2">{name}</h3>
        <p className="text-white/80 text-sm mb-4 line-clamp-2">
          {descriptionShort || 'No description available'}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Users className="w-4 h-4" />
            <span>{capacityText}</span>
          </div>
        </div>
      </div>
    </>
  );

  if (id) {
    return (
      <Link
        to={`/services/${id}`}
        className="group cursor-pointer transition-all hover:scale-[1.02] block"
      >
        {content}
      </Link>
    );
  }

  return (
    <div className="group cursor-pointer transition-all hover:scale-[1.02]">{content}</div>
  );
}

import { MapPin, User, Phone, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Church } from '../types/church.types';

const DEFAULT_CHURCH_IMAGE =
  'https://images.unsplash.com/photo-1438032005730-c779502df39b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

interface ChurchCardProps {
  church: Church;
}

function getStateBadgeColor(state?: string | null): string {
  switch (state?.toUpperCase()) {
    case 'ACT': return 'bg-blue-500/20 text-blue-200';
    case 'VIC': return 'bg-purple-500/20 text-purple-200';
    default:    return 'bg-white/20 text-white';
  }
}

export function ChurchCard({ church }: ChurchCardProps) {
  const address  = church.location?.address;
  const state    = address?.state ?? null;
  const imageUrl = church.primaryImage?.url ?? DEFAULT_CHURCH_IMAGE;
  const pastor         = church.leadership?.primaryPastor ?? null;
  const acsCoordinator = church.leadership?.acsCoordinator ?? null;

  return (
    <Link
      to={`/churches/${church._id}`}
      className="block h-full hover:-translate-y-1 transition-transform duration-200"
    >
      {/* Outer card — gray bezel */}
      <div className="bg-[#EDEEED] rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 h-full p-3 group">
        {/* Inner image fills remaining space, text overlaid */}
        <div className="relative rounded-2xl overflow-hidden h-full min-h-[280px]">
          {/* Full image */}
          <img
            src={imageUrl}
            alt={church.primaryImage?.alt ?? church.name ?? 'Church'}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Gradient overlay — bottom-heavy */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          {/* State badge — top right */}
          {state && (
            <div className="absolute top-3 right-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${getStateBadgeColor(state)}`}>
                {state}
              </span>
            </div>
          )}

          {/* Content overlay — bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white text-lg font-bold leading-snug mb-0.5">{church.name}</h3>

            {church.locationShort && (
              <p className="text-white/70 text-xs flex items-center gap-1 mb-2">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                {church.locationShort}
              </p>
            )}

            {/* Pastor / ACS quick info */}
            <div className="space-y-1 mb-3">
              {pastor && (
                <div className="flex items-center gap-1.5 text-white/70 text-xs">
                  <User className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">
                    Pastor: <span className="text-white font-medium">{pastor.name}</span>
                    {pastor.phone && (
                      <span className="text-white/50 ml-1">· {pastor.phone}</span>
                    )}
                  </span>
                </div>
              )}
              {acsCoordinator && (
                <div className="flex items-center gap-1.5 text-white/70 text-xs">
                  <Building2 className="w-3 h-3 flex-shrink-0 text-orange-300" />
                  <span className="truncate">
                    ACS: <span className="text-white font-medium">{acsCoordinator.name}</span>
                    {acsCoordinator.phone && (
                      <span className="text-white/50 ml-1">· {acsCoordinator.phone}</span>
                    )}
                  </span>
                </div>
              )}
              {!pastor && !acsCoordinator && (
                <p className="text-white/40 text-xs italic">No leadership info available</p>
              )}
            </div>

            {/* Bottom bar */}
            <div className="flex items-center justify-end">
              <span className="bg-white text-[#1F2937] text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                View Church
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

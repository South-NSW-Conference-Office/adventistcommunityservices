import { MapPin, User, Phone, Mail, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Church, ChurchLeader } from '../types/church.types';

const DEFAULT_CHURCH_IMAGE = 'https://images.unsplash.com/photo-1438032005730-c779502df39b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

interface ChurchCardProps {
  church: Church;
}

/**
 * Format state badge color
 */
function getStateBadgeColor(state?: string): string {
  switch (state?.toUpperCase()) {
    case 'ACT':
      return 'bg-blue-500/20 text-blue-200';
    case 'VIC':
      return 'bg-purple-500/20 text-purple-200';
    case 'NSW':
    default:
      return 'bg-green-500/20 text-green-200';
  }
}

/**
 * Get primary pastor from church leadership
 */
function getPrimaryPastor(church: Church): ChurchLeader | undefined {
  if (church.leadership?.associatePastors?.length > 0) {
    return church.leadership.associatePastors[0];
  }
  return undefined;
}

/**
 * Format phone number for display
 */
function formatPhone(phone?: string): string {
  if (!phone) return '';
  return phone.replace(/\s+/g, ' ').trim();
}

export function ChurchCard({ church }: ChurchCardProps) {
  const state = church.location?.address?.state || 'NSW';
  const pastor = getPrimaryPastor(church);
  const acsCoordinator = church.leadership?.acsCoordinator;
  const imageUrl = church.primaryImage?.url || DEFAULT_CHURCH_IMAGE;

  return (
    <Link to={`/churches/${church._id}`} className="group cursor-pointer transition-all hover:scale-[1.02] block">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden rounded-t-2xl">
        <img
          src={imageUrl}
          alt={church.primaryImage?.alt || church.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* State Badge on Image */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${getStateBadgeColor(state)}`}>
            {state}
          </span>
        </div>

        {/* Church Name on Image */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-xl font-semibold">{church.name}</h3>
          {church.location?.address?.city && (
            <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>
                {church.location.address.city}
                {church.location.address.state && `, ${church.location.address.state}`}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 border-t-0 rounded-b-2xl p-5">
        {/* Pastor Info */}
        {pastor && (
          <div className="mb-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-white/90 text-sm font-medium mb-1">
              <User className="w-4 h-4 flex-shrink-0" />
              <span>Pastor: {pastor.name}</span>
            </div>
            <div className="flex flex-wrap gap-3 ml-6">
              {pastor.phone && (
                <a href={`tel:${pastor.phone}`} className="flex items-center gap-1 text-white/70 text-xs hover:text-white transition-colors">
                  <Phone className="w-3 h-3" />
                  {formatPhone(pastor.phone)}
                </a>
              )}
              {pastor.email && (
                <a href={`mailto:${pastor.email}`} className="flex items-center gap-1 text-white/70 text-xs hover:text-white transition-colors truncate">
                  <Mail className="w-3 h-3" />
                  <span className="truncate max-w-[150px]">{pastor.email}</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* ACS Coordinator Info */}
        {acsCoordinator && (
          <div>
            <div className="flex items-center gap-2 text-white/90 text-sm font-medium mb-1">
              <Building2 className="w-4 h-4 flex-shrink-0 text-orange-400" />
              <span>Coordinator: {acsCoordinator.name}</span>
            </div>
            <div className="flex flex-wrap gap-3 ml-6">
              {acsCoordinator.phone && (
                <a href={`tel:${acsCoordinator.phone}`} className="flex items-center gap-1 text-white/70 text-xs hover:text-white transition-colors">
                  <Phone className="w-3 h-3" />
                  {formatPhone(acsCoordinator.phone)}
                </a>
              )}
              {acsCoordinator.email && (
                <a href={`mailto:${acsCoordinator.email}`} className="flex items-center gap-1 text-white/70 text-xs hover:text-white transition-colors truncate">
                  <Mail className="w-3 h-3" />
                  <span className="truncate max-w-[150px]">{acsCoordinator.email}</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Empty state for no leadership info */}
        {!pastor && !acsCoordinator && (
          <p className="text-white/50 text-sm italic">No leadership information available</p>
        )}
      </div>
    </Link>
  );
}

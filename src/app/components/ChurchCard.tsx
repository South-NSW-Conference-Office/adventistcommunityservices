import { MapPin, User, Phone, Mail } from 'lucide-react';
import type { Church, ChurchLeader } from '../types/church.types';

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
  const additionalPastors = (church.leadership?.associatePastors?.length || 0) - 1;

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all hover:scale-[1.02]">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-white text-xl font-semibold flex-1 pr-2">{church.name}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStateBadgeColor(state)}`}>
          {state}
        </span>
      </div>

      {/* Location */}
      {church.location?.address?.city && (
        <div className="flex items-center gap-2 text-white/70 text-sm mb-4">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span>
            {church.location.address.city}
            {church.location.address.state && `, ${church.location.address.state}`}
          </span>
        </div>
      )}

      {/* Pastor Info */}
      {pastor && (
        <div className="mb-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-white/90 text-sm font-medium mb-2">
            <User className="w-4 h-4 flex-shrink-0" />
            <span>Pastor</span>
          </div>
          <p className="text-white font-medium ml-6">{pastor.name}</p>
          {pastor.phone && (
            <div className="flex items-center gap-2 text-white/70 text-sm ml-6 mt-1">
              <Phone className="w-3 h-3 flex-shrink-0" />
              <a href={`tel:${pastor.phone}`} className="hover:text-white transition-colors">
                {formatPhone(pastor.phone)}
              </a>
            </div>
          )}
          {pastor.email && (
            <div className="flex items-center gap-2 text-white/70 text-sm ml-6 mt-1">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <a href={`mailto:${pastor.email}`} className="hover:text-white transition-colors truncate">
                {pastor.email}
              </a>
            </div>
          )}
          {additionalPastors > 0 && (
            <p className="text-white/50 text-xs ml-6 mt-2">
              +{additionalPastors} additional pastor{additionalPastors > 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}

      {/* ACS Coordinator Info */}
      {acsCoordinator && (
        <div>
          <div className="flex items-center gap-2 text-white/90 text-sm font-medium mb-2">
            <User className="w-4 h-4 flex-shrink-0 text-orange-400" />
            <span>ACS Coordinator</span>
          </div>
          <p className="text-white font-medium ml-6">{acsCoordinator.name}</p>
          {acsCoordinator.phone && (
            <div className="flex items-center gap-2 text-white/70 text-sm ml-6 mt-1">
              <Phone className="w-3 h-3 flex-shrink-0" />
              <a href={`tel:${acsCoordinator.phone}`} className="hover:text-white transition-colors">
                {formatPhone(acsCoordinator.phone)}
              </a>
            </div>
          )}
          {acsCoordinator.email && (
            <div className="flex items-center gap-2 text-white/70 text-sm ml-6 mt-1">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <a href={`mailto:${acsCoordinator.email}`} className="hover:text-white transition-colors truncate">
                {acsCoordinator.email}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Empty state for no leadership info */}
      {!pastor && !acsCoordinator && (
        <p className="text-white/50 text-sm italic">No leadership information available</p>
      )}
    </div>
  );
}

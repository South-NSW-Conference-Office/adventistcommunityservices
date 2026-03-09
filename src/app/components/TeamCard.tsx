import { MapPin, Users, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Team } from '../types/team.types';

const DEFAULT_TEAM_IMAGE = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

interface TeamCardProps {
  team: Team;
}

function getCategoryBadgeColor(category?: string): string {
  switch (category?.toLowerCase()) {
    case 'acs service':
    case 'acs':
      return 'bg-[#FFF1EE] text-[#F44314]';
    case 'communications':
      return 'bg-blue-50 text-blue-600';
    case 'general':
      return 'bg-gray-100 text-gray-600';
    default:
      return 'bg-purple-50 text-purple-600';
  }
}

function getChurchName(churchId: Team['churchId']): string {
  if (typeof churchId === 'object' && churchId?.name) return churchId.name;
  return '';
}

export function TeamCard({ team }: TeamCardProps) {
  const category = team.category || team.type || 'Team';
  const churchName = getChurchName(team.churchId);
  const memberCount = team.memberCount ?? 0;
  const imageUrl = team.banner?.url || team.profilePhoto?.url || DEFAULT_TEAM_IMAGE;
  const location = team.location || '';

  return (
    <Link
      to={`/teams/${team._id}`}
      className="block h-full hover:-translate-y-1 transition-transform duration-200"
    >
      {/* Outer card — gray bezel */}
      <div className="rounded-3xl transition-all duration-300 h-full p-3 group" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.2) 100%)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.04), 0 4px 24px rgba(0,0,0,0.08)' }}>
        {/* Inner image fills remaining space, text overlaid */}
        <div className="relative rounded-2xl overflow-hidden h-full min-h-[280px]">
          {/* Full image */}
          <img
            src={imageUrl}
            alt={team.banner?.alt || team.name}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Gradient overlay — bottom-heavy */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Category badge — top right */}
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(category)}`}>
              {category}
            </span>
          </div>

          {/* Content overlay — bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-white text-lg font-bold leading-snug mb-0.5">{team.name}</h3>

            {churchName && (
              <p className="text-white/70 text-xs flex items-center gap-1 mb-2">
                <Building2 className="w-3 h-3 flex-shrink-0" />
                {churchName}
              </p>
            )}

            {team.description && (
              <p className="text-white/60 text-sm line-clamp-2 mb-3">{team.description}</p>
            )}

            {/* Bottom bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-white/70">
                  <Users className="w-3.5 h-3.5" />
                  <span className="text-white text-xs font-medium">
                    {memberCount} {memberCount === 1 ? 'member' : 'members'}
                  </span>
                </div>
                {location && (
                  <div className="flex items-center gap-1 text-white/70">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-white text-xs font-medium truncate max-w-[80px]">{location}</span>
                  </div>
                )}
              </div>
              <span className="text-[#1F2937] text-xs font-semibold px-3 py-1.5 rounded-full flex-shrink-0" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)' }}>
                View Team
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

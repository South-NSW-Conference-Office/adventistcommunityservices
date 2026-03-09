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
      <div className="bg-[#EDEEED] rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col group">
        {/* Image — inset from card edges */}
        <div className="mx-3 mt-3 rounded-2xl overflow-hidden flex-shrink-0 relative" style={{ height: '220px' }}>
          <img
            src={imageUrl}
            alt={team.banner?.alt || team.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Category badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(category)}`}>
              {category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 pt-4 pb-5 flex flex-col flex-1">
          <h3 className="text-[#1A1A1A] text-xl font-bold mb-1 leading-snug">{team.name}</h3>
          {churchName && (
            <p className="text-[#F44314] text-xs font-medium mb-2 flex items-center gap-1">
              <Building2 className="w-3 h-3" />{churchName}
            </p>
          )}
          {team.description && (
            <p className="text-[#6B7280] text-sm leading-relaxed line-clamp-2 flex-1">
              {team.description}
            </p>
          )}

          {/* Bottom bar */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[#9CA3AF]">
                <Users className="w-4 h-4" />
                <span className="text-[#374151] text-sm font-medium">
                  {memberCount} {memberCount === 1 ? 'member' : 'members'}
                </span>
              </div>
              {location && (
                <div className="flex items-center gap-1.5 text-[#9CA3AF]">
                  <MapPin className="w-4 h-4" />
                  <span className="text-[#374151] text-sm font-medium truncate max-w-[80px]">{location}</span>
                </div>
              )}
            </div>
            <span className="bg-white text-[#1F2937] text-sm font-semibold px-4 py-2 rounded-full shadow-sm flex-shrink-0">
              View Team
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

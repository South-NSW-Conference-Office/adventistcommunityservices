import { MapPin, Users, User, Building2 } from 'lucide-react';
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
  if (typeof churchId === 'object' && churchId?.name) {
    return churchId.name;
  }
  return '';
}

export function TeamCard({ team }: TeamCardProps) {
  const category = team.category || team.type || 'Team';
  const churchName = getChurchName(team.churchId);
  const memberCount = team.memberCount ?? 0;
  const imageUrl = team.banner?.url || team.profilePhoto?.url || DEFAULT_TEAM_IMAGE;

  return (
    <Link
      to={`/teams/${team._id}`}
      className="group cursor-pointer transition-all hover:scale-[1.02] block"
    >
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={team.banner?.alt || team.profilePhoto?.alt || team.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {/* Category Badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(category)}`}>
              {category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-[#1F2937] text-lg font-semibold mb-1">{team.name}</h3>
          {team.description && (
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{team.description}</p>
          )}

          <div className="space-y-2 text-sm">
            {churchName && (
              <div className="flex items-center gap-2 text-gray-500">
                <Building2 className="w-4 h-4 flex-shrink-0 text-gray-400" />
                <span className="truncate">{churchName}</span>
              </div>
            )}

            {team.location && (
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
                <span className="truncate">{team.location}</span>
              </div>
            )}

            {team.leaderId && typeof team.leaderId === 'object' && team.leaderId.name && (
              <div className="flex items-center gap-2 text-gray-500">
                <User className="w-4 h-4 flex-shrink-0 text-gray-400" />
                <span className="truncate">Led by {team.leaderId.name}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-gray-500">
              <Users className="w-4 h-4 flex-shrink-0 text-gray-400" />
              <span>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <span className="text-[#F44314] font-semibold text-sm">View Team →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

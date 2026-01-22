import { MapPin, Users, User, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Team } from '../types/team.types';

const DEFAULT_TEAM_IMAGE = 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

interface TeamCardProps {
  team: Team;
}

/**
 * Get category badge color
 */
function getCategoryBadgeColor(category?: string): string {
  switch (category?.toLowerCase()) {
    case 'acs service':
    case 'acs':
      return 'bg-orange-500/20 text-orange-200';
    case 'communications':
      return 'bg-blue-500/20 text-blue-200';
    case 'general':
      return 'bg-gray-500/20 text-gray-200';
    default:
      return 'bg-purple-500/20 text-purple-200';
  }
}

/**
 * Get church name from churchId
 */
function getChurchName(churchId: Team['churchId']): string {
  if (typeof churchId === 'object' && churchId?.name) {
    return churchId.name;
  }
  return 'Unknown Church';
}

export function TeamCard({ team }: TeamCardProps) {
  const category = team.category || team.type || 'Team';
  const churchName = getChurchName(team.churchId);
  const memberCount = team.memberCount ?? 0;
  const imageUrl = team.banner?.url || team.profilePhoto?.url || DEFAULT_TEAM_IMAGE;

  const content = (
    <>
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden rounded-t-2xl">
        <img
          src={imageUrl}
          alt={team.banner?.alt || team.profilePhoto?.alt || team.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Category Badge on Image */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${getCategoryBadgeColor(category)}`}>
            {category}
          </span>
        </div>

        {/* Team Name on Image */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-xl font-semibold">{team.name}</h3>
          {team.description && (
            <p className="text-white/80 text-sm mt-1 line-clamp-2">
              {team.description}
            </p>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 border-t-0 rounded-b-2xl p-5">
        <div className="space-y-2">
          {/* Church */}
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <Building2 className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{churchName}</span>
          </div>

          {/* Location */}
          {team.location && (
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{team.location}</span>
            </div>
          )}

          {/* Leader */}
          {team.leaderId && typeof team.leaderId === 'object' && team.leaderId.name && (
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <User className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Led by {team.leaderId.name}</span>
            </div>
          )}

          {/* Member Count */}
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Users className="w-4 h-4 flex-shrink-0" />
            <span>
              {memberCount} {memberCount === 1 ? 'member' : 'members'}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        {!team.isActive && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-200">
              Inactive
            </span>
          </div>
        )}
      </div>
    </>
  );

  return (
    <Link
      to={`/teams/${team._id}`}
      className="group cursor-pointer transition-all hover:scale-[1.02] block"
    >
      {content}
    </Link>
  );
}

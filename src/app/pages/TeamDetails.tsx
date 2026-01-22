import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Users, User, Building2, Clock, ArrowLeft, Heart, RefreshCw, Target, Calendar } from 'lucide-react';
import { useTeamDetail } from '../hooks/useTeams';
import type { Team, TeamChurch, TeamLeader } from '../types/team.types';

const DEFAULT_TEAM_IMAGE =
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

const PAGE_BACKGROUND = 'min-h-screen bg-gradient-to-br from-[#F44314] via-[#F97023] to-[#F98344]';
const STATE_CARD_STYLES = 'bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12 max-w-md text-center';

function getCategoryBadgeColor(category?: string): string {
  const normalizedCategory = category?.toLowerCase();
  if (normalizedCategory === 'acs service' || normalizedCategory === 'acs') {
    return 'bg-orange-500/20 text-orange-200';
  }
  if (normalizedCategory === 'communications') {
    return 'bg-blue-500/20 text-blue-200';
  }
  if (normalizedCategory === 'general') {
    return 'bg-gray-500/20 text-gray-200';
  }
  return 'bg-purple-500/20 text-purple-200';
}

function isPopulatedChurch(churchId: Team['churchId']): churchId is TeamChurch {
  return typeof churchId === 'object' && churchId !== null && 'name' in churchId;
}

function isPopulatedLeader(leaderId: Team['leaderId']): leaderId is TeamLeader {
  return typeof leaderId === 'object' && leaderId !== null && 'name' in leaderId;
}

function formatUnderscoreString(value?: string): string {
  if (!value) return '';
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function TeamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { team, loading, error, refetch } = useTeamDetail(id);

  if (loading) {
    return (
      <div className={`${PAGE_BACKGROUND} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${PAGE_BACKGROUND} flex items-center justify-center px-6`}>
        <div className={STATE_CARD_STYLES}>
          <p className="text-white text-xl mb-4">{error}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => refetch()}
              className="inline-flex items-center justify-center gap-2 bg-white text-[#F44314] px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            <Link
              to="/teams"
              className="inline-flex items-center justify-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Teams
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className={`${PAGE_BACKGROUND} flex items-center justify-center px-6`}>
        <div className={STATE_CARD_STYLES}>
          <p className="text-white text-xl mb-4">Team not found</p>
          <Link
            to="/teams"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Teams
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = team.banner?.url || team.profilePhoto?.url || DEFAULT_TEAM_IMAGE;
  const churchName = isPopulatedChurch(team.churchId) ? team.churchId.name : 'Unknown Church';
  const leader = isPopulatedLeader(team.leaderId) ? team.leaderId : null;
  const memberCount = team.memberCount ?? 0;
  const category = team.category || team.type || 'Team';
  const tags = team.tags ?? [];
  const focus = team.metadata?.focus ?? [];
  const targetAudience = team.metadata?.targetAudience ?? [];
  const ministry = formatUnderscoreString(team.metadata?.ministry);
  const meetingSchedule = team.metadata?.meetingSchedule;
  const serviceArea = team.metadata?.serviceArea;

  return (
    <div className={PAGE_BACKGROUND}>
      {/* Hero Image Section */}
      <div className="relative h-[500px] overflow-hidden">
        <img src={imageUrl} alt={team.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 via-30% via-transparent via-70% to-[#F44314]"></div>

        {/* Back Button */}
        <div className="absolute top-24 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-6">
            <button
              onClick={() => navigate('/teams')}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Teams
            </button>
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm ${getCategoryBadgeColor(category)}`}
              >
                {category}
              </span>
              {!team.isActive && (
                <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-red-500/20 text-red-200 backdrop-blur-sm">
                  Inactive
                </span>
              )}
            </div>
            <h1 className="text-white text-5xl font-bold mb-4">{team.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <span>{churchName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>
                  {memberCount} {memberCount === 1 ? 'member' : 'members'}
                </span>
              </div>
              {team.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  <span>{team.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-white text-3xl font-semibold mb-4">About This Team</h2>
              {team.description ? (
                <p className="text-white/90 text-lg leading-relaxed">{team.description}</p>
              ) : (
                <p className="text-white/80 leading-relaxed">
                  Contact us for more information about this team.
                </p>
              )}
            </div>

            {/* Ministry Info */}
            {ministry && (
              <div>
                <h2 className="text-white text-2xl font-semibold mb-4">Ministry</h2>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                  <span className="text-white/90 text-lg">{ministry}</span>
                </div>
              </div>
            )}

            {/* Tags (What We Do) */}
            {tags.length > 0 && (
              <div>
                <h2 className="text-white text-2xl font-semibold mb-4">What We Do</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4"
                    >
                      <Heart className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                      <span className="text-white/90">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Focus Areas */}
            {focus.length > 0 && (
              <div>
                <h2 className="text-white text-2xl font-semibold mb-4">Focus Areas</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {focus.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4"
                    >
                      <Target className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                      <span className="text-white/90">{formatUnderscoreString(item)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Target Audience */}
            {targetAudience.length > 0 && (
              <div>
                <h2 className="text-white text-2xl font-semibold mb-4">Who We Serve</h2>
                <div className="flex flex-wrap gap-2">
                  {targetAudience.map((audience, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90"
                    >
                      {formatUnderscoreString(audience)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Team Information */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <h3 className="text-white text-xl font-semibold mb-4">Team Information</h3>
                <div className="space-y-4">
                  {/* Church */}
                  <div>
                    <div className="flex items-center gap-2 text-white/70 mb-2">
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm">Church</span>
                    </div>
                    <p className="text-white">{churchName}</p>
                  </div>

                  {/* Location */}
                  {team.location && (
                    <div>
                      <div className="flex items-center gap-2 text-white/70 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">Location</span>
                      </div>
                      <p className="text-white">{team.location}</p>
                    </div>
                  )}

                  {/* Service Area */}
                  {serviceArea && (
                    <div>
                      <div className="flex items-center gap-2 text-white/70 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">Service Area</span>
                      </div>
                      <p className="text-white">{serviceArea}</p>
                    </div>
                  )}

                  {/* Team Leader */}
                  {leader && (
                    <div>
                      <div className="flex items-center gap-2 text-white/70 mb-2">
                        <User className="w-4 h-4" />
                        <span className="text-sm">Team Leader</span>
                      </div>
                      <p className="text-white">{leader.name}</p>
                      {leader.email && (
                        <a
                          href={`mailto:${leader.email}`}
                          className="text-white/70 text-sm hover:text-white transition-colors"
                        >
                          {leader.email}
                        </a>
                      )}
                    </div>
                  )}

                  {/* Member Count */}
                  <div>
                    <div className="flex items-center gap-2 text-white/70 mb-2">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Members</span>
                    </div>
                    <p className="text-white">
                      {memberCount} {memberCount === 1 ? 'member' : 'members'}
                    </p>
                  </div>

                  {/* Meeting Schedule */}
                  {meetingSchedule && (
                    <div>
                      <div className="flex items-center gap-2 text-white/70 mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">Meeting Schedule</span>
                      </div>
                      <p className="text-white">{meetingSchedule}</p>
                    </div>
                  )}

                  {/* Created Date */}
                  {team.createdAt && (
                    <div>
                      <div className="flex items-center gap-2 text-white/70 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">Established</span>
                      </div>
                      <p className="text-white">
                        {new Date(team.createdAt).toLocaleDateString('en-AU', {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Button */}
              {leader?.email && (
                <a
                  href={`mailto:${leader.email}`}
                  className="w-full block bg-white text-[#F44314] text-center py-4 rounded-xl font-semibold hover:bg-white/90 transition-colors"
                >
                  Contact Team Leader
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

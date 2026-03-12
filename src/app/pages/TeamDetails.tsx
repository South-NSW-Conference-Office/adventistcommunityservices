import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Users, User, Building2, Clock,
  ArrowLeft, Heart, RefreshCw, Target,
  Calendar, ExternalLink, AlertTriangle,
} from 'lucide-react';
import { useTeamDetail } from '../hooks/useTeams';
import { useServices } from '../hooks/useServices';
import { ServiceRequestBanner } from '../components/ServiceRequestBanner';
import type { Team, TeamChurch, TeamLeader } from '../types/team.types';

const DEFAULT_TEAM_IMAGE =
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

const RECOMMENDED_SERVICES = [
  { name: 'Lifeline Australia',   type: 'Crisis Support',      phone: '13 11 14',      url: 'https://www.lifeline.org.au',        desc: '24/7 crisis support and suicide prevention' },
  { name: 'Beyond Blue',          type: 'Mental Health',        phone: '1300 22 4636',  url: 'https://www.beyondblue.org.au',      desc: 'Mental health information and support' },
  { name: 'Foodbank Australia',   type: 'Food Relief',          phone: undefined,       url: 'https://www.foodbank.org.au',        desc: "Australia's largest food relief organisation" },
  { name: '1800RESPECT',          type: 'Domestic Violence',    phone: '1800 737 732',  url: 'https://www.1800respect.org.au',     desc: 'National sexual assault and domestic violence counselling' },
  { name: 'Salvation Army',       type: 'Emergency Relief',     phone: '13 72 58',      url: 'https://www.salvationarmy.org.au',   desc: 'Emergency relief, housing support, and financial counselling' },
  { name: 'St Vincent de Paul',   type: 'Community Support',    phone: '13 18 12',      url: 'https://www.vinnies.org.au',         desc: 'Emergency relief, housing, and community programs' },
  { name: 'Anglicare',            type: 'Family Services',      phone: undefined,       url: 'https://www.anglicare.org.au',       desc: 'Family support, emergency relief, and aged care' },
  { name: 'Red Cross Australia',  type: 'Emergency & Disaster', phone: '1800 733 276',  url: 'https://www.redcross.org.au',        desc: 'Disaster relief, migration support, and community programs' },
];

function getCategoryBadgeColor(category?: string): string {
  const c = category?.toLowerCase();
  if (c === 'acs service' || c === 'acs') return 'bg-[#FFF1EE] text-[#F44314]';
  if (c === 'communications') return 'bg-blue-50 text-blue-600';
  if (c === 'general') return 'bg-gray-100 text-gray-600';
  return 'bg-purple-50 text-purple-600';
}

function isPopulatedChurch(churchId: Team['churchId']): churchId is TeamChurch {
  return typeof churchId === 'object' && churchId !== null && 'name' in churchId;
}

function isPopulatedLeader(leaderId: Team['leaderId']): leaderId is TeamLeader {
  return typeof leaderId === 'object' && leaderId !== null && 'name' in leaderId;
}

function formatLabel(value?: string): string {
  if (!value) return '';
  return value.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export function TeamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { team, loading, error, refetch } = useTeamDetail(id);
  const { services: allServices } = useServices();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F44314]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-gray-700 text-xl mb-6">{error}</p>
          <div className="flex flex-col gap-3 items-center">
            <button onClick={() => refetch()}
              className="inline-flex items-center gap-2 bg-[#F44314] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#d93a10] transition-colors">
              <RefreshCw className="w-5 h-5" /> Try Again
            </button>
            <Link to="/teams" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1F2937] transition-colors">
              <ArrowLeft className="w-5 h-5" /> Back to Teams
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="text-gray-700 text-xl mb-6">Team not found</p>
          <Link to="/teams" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1F2937] transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to Teams
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl    = team.banner?.url || team.profilePhoto?.url || DEFAULT_TEAM_IMAGE;
  const churchName  = isPopulatedChurch(team.churchId) ? team.churchId.name : '';
  const leader      = isPopulatedLeader(team.leaderId) ? team.leaderId : null;
  const memberCount = team.memberCount ?? 0;
  const category    = team.category || team.type || 'Team';
  const tags        = team.tags ?? [];
  const focus       = team.metadata?.focus ?? [];
  const targetAudience   = team.metadata?.targetAudience ?? [];
  const meetingSchedule  = team.metadata?.meetingSchedule;
  const serviceArea      = team.metadata?.serviceArea;

  const teamServices = allServices.filter(s =>
    s.teamId?._id === id || s.teamId?.name === team.name
  );

  return (
    <div className="min-h-screen bg-white">

      {/* Hero — plain image, bottom strip only */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <img src={imageUrl} alt={team.name} className="w-full h-full object-cover" />

        {/* Back button */}
        <div className="absolute top-24 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-6">
            <button onClick={() => navigate('/teams')}
              className="flex items-center gap-2 text-white/90 hover:text-white bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5" /> Back to Teams
            </button>
          </div>
        </div>

        {/* Title strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryBadgeColor(category)}`}>{category}</span>
              {!team.isActive && <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">Inactive</span>}
            </div>
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-3">{team.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
              {churchName && (
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" /><span>{churchName}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
              </div>
              {team.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /><span>{team.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">

          {/* Main column */}
          <div className="lg:col-span-2 space-y-10">

            {/* About */}
            {team.description && (
              <div>
                <h2 className="text-[#1F2937] text-2xl font-bold mb-2">About This Team</h2>
                <p className="text-gray-600 text-lg leading-relaxed">{team.description}</p>
              </div>
            )}

            {/* Services */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-[#1F2937] text-2xl font-bold">Our Services</h2>
                <div className="flex items-center gap-2 text-xs text-gray-400" title="Coming soon — toggle to show disaster response services">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Emergency mode</span>
                  <div className="w-9 h-5 bg-gray-200 rounded-full relative cursor-not-allowed">
                    <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm" />
                  </div>
                </div>
              </div>

              {teamServices.length > 0 ? (
                <div>
                  {teamServices.map((svc) => (
                    <Link key={svc._id} to={`/services/${svc._id}`}
                      className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0 hover:text-[#F44314] transition-colors group">
                      <Heart className="w-4 h-4 text-[#F44314] mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 font-medium group-hover:text-[#F44314] transition-colors truncate">{svc.name}</p>
                        {svc.type && <p className="text-gray-400 text-xs">{formatLabel(svc.type)}</p>}
                        {svc.descriptionShort && <p className="text-gray-500 text-sm mt-0.5 line-clamp-2">{svc.descriptionShort}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : tags.length > 0 ? (
                <div>
                  {tags.map((tag, i) => (
                    <div key={i} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
                      <Heart className="w-4 h-4 text-[#F44314] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 font-medium">{formatLabel(tag)}</p>
                        <p className="text-gray-400 text-xs mt-0.5">Details coming soon</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 py-3">This team hasn't listed their services yet.</p>
              )}

              {/* Focus Areas */}
              {focus.length > 0 && (
                <div className="mt-4">
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Focus Areas</p>
                  <div className="flex flex-wrap gap-2">
                    {focus.map((item, i) => (
                      <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm">{formatLabel(item)}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Who We Serve */}
              {targetAudience.length > 0 && (
                <div className="mt-4">
                  <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Who We Serve</p>
                  <div className="flex flex-wrap gap-2">
                    {targetAudience.map((a, i) => (
                      <span key={i} className="px-3 py-1.5 bg-[#FFF1EE] text-[#F44314] rounded-full text-sm font-medium">{formatLabel(a)}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">

              <div className="bg-[#F8F7F5] border border-gray-200 rounded-2xl p-6">
                <h3 className="text-[#1F2937] text-lg font-bold mb-4">Team Information</h3>
                <div className="space-y-4">
                  {churchName && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-400 mb-0.5">
                        <Building2 className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wide">Organisation</span>
                      </div>
                      <p className="text-[#1F2937] font-medium text-sm">{churchName}</p>
                    </div>
                  )}
                  {team.location && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-400 mb-0.5">
                        <MapPin className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wide">Location</span>
                      </div>
                      <p className="text-[#1F2937] font-medium text-sm">{team.location}</p>
                    </div>
                  )}
                  {serviceArea && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-400 mb-0.5">
                        <Target className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wide">Service Area</span>
                      </div>
                      <p className="text-[#1F2937] font-medium text-sm">{serviceArea}</p>
                    </div>
                  )}
                  {leader && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-400 mb-0.5">
                        <User className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wide">Team Leader</span>
                      </div>
                      <p className="text-[#1F2937] font-medium text-sm">{leader.name}</p>
                      {leader.email && (
                        <a href={`mailto:${leader.email}`} className="text-[#F44314] text-xs hover:underline">{leader.email}</a>
                      )}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-0.5">
                      <Users className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-wide">Members</span>
                    </div>
                    <p className="text-[#1F2937] font-medium text-sm">{memberCount} {memberCount === 1 ? 'member' : 'members'}</p>
                  </div>
                  {meetingSchedule && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-400 mb-0.5">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wide">Schedule</span>
                      </div>
                      <p className="text-[#1F2937] font-medium text-sm">{meetingSchedule}</p>
                    </div>
                  )}
                  {team.createdAt && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-400 mb-0.5">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs uppercase tracking-wide">Established</span>
                      </div>
                      <p className="text-[#1F2937] font-medium text-sm">
                        {new Date(team.createdAt).toLocaleDateString('en-AU', { year: 'numeric', month: 'long' })}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {leader?.email ? (
                <a href={`mailto:${leader.email}`}
                  className="w-full block bg-[#F44314] text-white text-center py-4 rounded-xl font-semibold hover:bg-[#d93a10] transition-colors">
                  Contact This Team
                </a>
              ) : (
                <Link to="/contact"
                  className="w-full block bg-[#F44314] text-white text-center py-4 rounded-xl font-semibold hover:bg-[#d93a10] transition-colors">
                  Get in Touch
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Service Request Banner */}
      <ServiceRequestBanner contextName={team.name} teamId={id} pageType="team" />

      {/* Recommended Services */}
      <div className="bg-[#1a2332] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-white text-2xl font-bold mb-1">Other Services in the Area</h3>
          <p className="text-gray-400 text-sm mb-6">Trusted community resources — not operated by us.</p>
          <div className="divide-y divide-white/10">
            {RECOMMENDED_SERVICES.map((svc, i) => (
              <div key={i} className="py-3 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-sm truncate">{svc.name}</span>
                    <span className="text-gray-400 text-xs flex-shrink-0">· {svc.type}</span>
                  </div>
                  {svc.phone && <span className="text-gray-400 text-xs">{svc.phone}</span>}
                </div>
                <a href={svc.url} target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#F44314] transition-colors flex-shrink-0" title={`Visit ${svc.name}`}>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-4">Independent organisations. Listing does not imply affiliation.</p>
        </div>
      </div>

    </div>
  );
}

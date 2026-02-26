import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Users, User, Building2, Clock, ArrowLeft, Heart, RefreshCw, Target, Calendar, ExternalLink, AlertTriangle } from 'lucide-react';
import { useTeamDetail } from '../hooks/useTeams';
import type { Team, TeamChurch, TeamLeader } from '../types/team.types';

const DEFAULT_TEAM_IMAGE =
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

// Recommended community services — external resources near each team
// In future this comes from the backend per-team, for now static examples
const RECOMMENDED_SERVICES = [
  { name: 'Lifeline Australia', type: 'Crisis Support', phone: '13 11 14', url: 'https://www.lifeline.org.au', desc: '24/7 crisis support and suicide prevention' },
  { name: 'Beyond Blue', type: 'Mental Health', phone: '1300 22 4636', url: 'https://www.beyondblue.org.au', desc: 'Mental health information and support' },
  { name: 'Foodbank Australia', type: 'Food Relief', url: 'https://www.foodbank.org.au', desc: 'Australia\'s largest food relief organisation' },
  { name: '1800RESPECT', type: 'Domestic Violence', phone: '1800 737 732', url: 'https://www.1800respect.org.au', desc: 'National sexual assault, domestic and family violence counselling' },
  { name: 'Salvation Army', type: 'Emergency Relief', phone: '13 72 58', url: 'https://www.salvationarmy.org.au', desc: 'Emergency relief, housing support, and financial counselling' },
  { name: 'St Vincent de Paul', type: 'Community Support', phone: '13 18 12', url: 'https://www.vinnies.org.au', desc: 'Emergency relief, housing, and community programs' },
  { name: 'Anglicare', type: 'Family Services', url: 'https://www.anglicare.org.au', desc: 'Family support, emergency relief, and aged care' },
  { name: 'Red Cross Australia', type: 'Emergency & Disaster', phone: '1800 733 276', url: 'https://www.redcross.org.au', desc: 'Disaster relief, migration support, and community programs' },
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

function formatUnderscoreString(value?: string): string {
  if (!value) return '';
  return value.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export function TeamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { team, loading, error, refetch } = useTeamDetail(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F44314]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 max-w-md text-center">
          <p className="text-[#1F2937] text-xl mb-4">{error}</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => refetch()} className="inline-flex items-center justify-center gap-2 bg-[#F44314] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#d93a10]">
              <RefreshCw className="w-5 h-5" /> Try Again
            </button>
            <Link to="/teams" className="inline-flex items-center justify-center gap-2 text-gray-500 hover:text-[#1F2937]">
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
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 max-w-md text-center">
          <p className="text-[#1F2937] text-xl mb-4">Team not found</p>
          <Link to="/teams" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1F2937]">
            <ArrowLeft className="w-5 h-5" /> Back to Teams
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = team.banner?.url || team.profilePhoto?.url || DEFAULT_TEAM_IMAGE;
  const churchName = isPopulatedChurch(team.churchId) ? team.churchId.name : '';
  const leader = isPopulatedLeader(team.leaderId) ? team.leaderId : null;
  const memberCount = team.memberCount ?? 0;
  const category = team.category || team.type || 'Team';
  const tags = team.tags ?? [];
  const focus = team.metadata?.focus ?? [];
  const targetAudience = team.metadata?.targetAudience ?? [];
  const meetingSchedule = team.metadata?.meetingSchedule;
  const serviceArea = team.metadata?.serviceArea;

  return (
    <div className="min-h-screen bg-white">
      {/* ====== SECTION 1: HERO ====== */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <img src={imageUrl} alt={team.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70"></div>

        {/* Back Button */}
        <div className="absolute top-24 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-6">
            <button onClick={() => navigate('/teams')} className="flex items-center gap-2 text-white/90 hover:text-white bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5" /> Back to Teams
            </button>
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 pb-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getCategoryBadgeColor(category)}`}>{category}</span>
              {!team.isActive && <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-600">Inactive</span>}
            </div>
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-3">{team.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
              {churchName && <div className="flex items-center gap-2"><Building2 className="w-4 h-4" /><span>{churchName}</span></div>}
              <div className="flex items-center gap-2"><Users className="w-4 h-4" /><span>{memberCount} {memberCount === 1 ? 'member' : 'members'}</span></div>
              {team.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>{team.location}</span></div>}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column — Main */}
          <div className="lg:col-span-2 space-y-12">
            {/* About */}
            {team.description && (
              <div>
                <h2 className="text-[#1F2937] text-2xl font-bold mb-4">About This Team</h2>
                <p className="text-gray-600 text-lg leading-relaxed">{team.description}</p>
              </div>
            )}

            {/* ====== SECTION 2: OUR SERVICES ====== */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#1F2937] text-2xl font-bold">Our Services</h2>
                {/* Emergency mode toggle — placeholder for backend implementation */}
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Emergency mode</span>
                  <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-not-allowed" title="Coming soon — toggle to show disaster response services">
                    <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                  </div>
                </div>
              </div>

              {tags.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {tags.map((tag, index) => (
                    <Link key={index} to={`/services?type=${tag}`} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-[#F44314]/30 transition-all group">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[#FFF1EE] rounded-lg flex items-center justify-center flex-shrink-0">
                          <Heart className="w-5 h-5 text-[#F44314]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-[#1F2937] font-semibold group-hover:text-[#F44314] transition-colors">{formatUnderscoreString(tag)}</h3>
                          <p className="text-gray-500 text-sm mt-1">View service details →</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                  <p className="text-gray-400">This team hasn't listed their services yet.</p>
                </div>
              )}

              {/* Focus Areas */}
              {focus.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-[#1F2937] font-semibold mb-3">Focus Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {focus.map((item, i) => (
                      <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm">{formatUnderscoreString(item)}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Target Audience */}
              {targetAudience.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-[#1F2937] font-semibold mb-3">Who We Serve</h3>
                  <div className="flex flex-wrap gap-2">
                    {targetAudience.map((a, i) => (
                      <span key={i} className="px-3 py-1.5 bg-[#FFF1EE] text-[#F44314] rounded-full text-sm font-medium">{formatUnderscoreString(a)}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ====== SECTION 3: RECOMMENDED SERVICES (compact dark panel) ====== */}
            <div className="bg-[#1F2937] rounded-2xl p-6 md:p-8">
              <h3 className="text-white text-lg font-semibold mb-1">Other Services in the Area</h3>
              <p className="text-gray-400 text-sm mb-5">Trusted community resources — not operated by us.</p>

              <div className="divide-y divide-gray-700">
                {RECOMMENDED_SERVICES.map((svc, i) => (
                  <div key={i} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium text-sm truncate">{svc.name}</span>
                        <span className="text-gray-500 text-xs flex-shrink-0">· {svc.type}</span>
                      </div>
                      {svc.phone && <span className="text-gray-400 text-xs">{svc.phone}</span>}
                    </div>
                    <a
                      href={svc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                      title={`Visit ${svc.name}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>

              <p className="text-gray-600 text-xs mt-4">Independent organisations. Listing does not imply affiliation.</p>
            </div>
          </div>

          {/* Right Column — Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Team Info Card */}
              <div className="bg-[#F8F7F5] border border-gray-200 rounded-2xl p-6">
                <h3 className="text-[#1F2937] text-lg font-bold mb-4">Team Information</h3>
                <div className="space-y-4">
                  {churchName && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-400 mb-1"><Building2 className="w-4 h-4" /><span className="text-xs uppercase tracking-wide">Organisation</span></div>
                      <p className="text-[#1F2937] font-medium">{churchName}</p>
                    </div>
                  )}
                  {team.location && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-400 mb-1"><MapPin className="w-4 h-4" /><span className="text-xs uppercase tracking-wide">Location</span></div>
                      <p className="text-[#1F2937] font-medium">{team.location}</p>
                    </div>
                  )}
                  {serviceArea && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-400 mb-1"><Target className="w-4 h-4" /><span className="text-xs uppercase tracking-wide">Service Area</span></div>
                      <p className="text-[#1F2937] font-medium">{serviceArea}</p>
                    </div>
                  )}
                  {leader && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-400 mb-1"><User className="w-4 h-4" /><span className="text-xs uppercase tracking-wide">Team Leader</span></div>
                      <p className="text-[#1F2937] font-medium">{leader.name}</p>
                      {leader.email && <a href={`mailto:${leader.email}`} className="text-[#F44314] text-sm hover:underline">{leader.email}</a>}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-1"><Users className="w-4 h-4" /><span className="text-xs uppercase tracking-wide">Members</span></div>
                    <p className="text-[#1F2937] font-medium">{memberCount} {memberCount === 1 ? 'member' : 'members'}</p>
                  </div>
                  {meetingSchedule && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-400 mb-1"><Clock className="w-4 h-4" /><span className="text-xs uppercase tracking-wide">Schedule</span></div>
                      <p className="text-[#1F2937] font-medium">{meetingSchedule}</p>
                    </div>
                  )}
                  {team.createdAt && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-400 mb-1"><Calendar className="w-4 h-4" /><span className="text-xs uppercase tracking-wide">Established</span></div>
                      <p className="text-[#1F2937] font-medium">{new Date(team.createdAt).toLocaleDateString('en-AU', { year: 'numeric', month: 'long' })}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact CTA */}
              {leader?.email && (
                <a href={`mailto:${leader.email}`} className="w-full block bg-[#F44314] text-white text-center py-4 rounded-xl font-semibold hover:bg-[#d93a10] transition-colors shadow-sm">
                  Contact This Team
                </a>
              )}

              {!leader?.email && (
                <Link to="/contact" className="w-full block bg-[#F44314] text-white text-center py-4 rounded-xl font-semibold hover:bg-[#d93a10] transition-colors shadow-sm">
                  Get in Touch
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Phone, Mail, Globe, Clock,
  Users, ArrowLeft, RefreshCw, Calendar,
  Building2, Car, Utensils, Monitor,
  Accessibility, Heart, User,
} from 'lucide-react';
import { usePublicChurchDetail } from '../hooks/useChurches';
import type { Church, ChurchLeader, ChurchServiceTime } from '../types/church.types';
import { JSX } from 'react';

const DEFAULT_CHURCH_IMAGE =
  'https://images.unsplash.com/photo-1438032005730-c779502df39b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

// ── Small flat UI components (no card wrappers) ───────────────────────────────

function ServiceTimeRow({ icon: Icon, label, service }: { icon: React.ElementType; label: string; service: ChurchServiceTime }): JSX.Element {
  const timeDisplay = service.day
    ? `${service.day} ${service.time ?? 'Contact for time'}`
    : service.time ?? 'Contact for time';
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
      <div>
        <p className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-gray-900 font-medium">{timeDisplay}</p>
        {service.description && <p className="text-gray-500 text-sm mt-0.5">{service.description}</p>}
      </div>
    </div>
  );
}

function LeaderRow({ title, leader, icon: Icon, highlight = false }: { title: string; leader: ChurchLeader; icon: React.ElementType; highlight?: boolean }): JSX.Element {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${highlight ? 'text-[#F44314]' : 'text-gray-400'}`} />
      <div className="flex-1 min-w-0">
        <p className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">{title}</p>
        <p className="text-gray-900 font-medium">{leader.name}</p>
        {leader.title && <p className="text-gray-500 text-sm">{leader.title}</p>}
        <div className="flex flex-wrap gap-3 mt-1">
          {leader.phone && (
            <a href={`tel:${leader.phone}`} className="flex items-center gap-1 text-gray-500 text-sm hover:text-[#F44314] transition-colors">
              <Phone className="w-3 h-3" />{leader.phone}
            </a>
          )}
          {leader.email && (
            <a href={`mailto:${leader.email}`} className="flex items-center gap-1 text-gray-500 text-sm hover:text-[#F44314] transition-colors truncate">
              <Mail className="w-3 h-3" /><span className="truncate">{leader.email}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactItem({ icon: Icon, label, value, href, external }: { icon: React.ElementType; label: string; value: string; href?: string; external?: boolean }): JSX.Element {
  return (
    <div>
      <div className="flex items-center gap-2 text-gray-400 mb-0.5">
        <Icon className="w-4 h-4" />
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      {href ? (
        <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}
          className="text-[#F44314] hover:text-[#d93a10] transition-colors break-all text-sm font-medium">
          {value}
        </a>
      ) : (
        <p className="text-gray-900 text-sm font-medium">{value}</p>
      )}
    </div>
  );
}

function PageState({ message, showRefresh, onRefresh }: { message: string; showRefresh?: boolean; onRefresh?: () => void }): JSX.Element {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-gray-700 text-xl mb-6">{message}</p>
        <div className="flex flex-col gap-3 items-center">
          {showRefresh && onRefresh && (
            <button onClick={onRefresh}
              className="inline-flex items-center gap-2 bg-[#F44314] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#d93a10] transition-colors">
              <RefreshCw className="w-5 h-5" /> Try Again
            </button>
          )}
          <Link to="/churches" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1F2937] transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to Churches
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function ChurchDetails(): JSX.Element {
  const { id } = useParams();
  const navigate = useNavigate();
  const { church, loading, error, refetch } = usePublicChurchDetail(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F44314]" />
      </div>
    );
  }
  if (error)   return <PageState message={error} showRefresh onRefresh={refetch} />;
  if (!church) return <PageState message="Church not found" />;

  const c = church as Church;
  const { sections, stats, contact, leadership, services, facilities, outreach } = c;
  const imageUrl     = c.primaryImage?.url ?? DEFAULT_CHURCH_IMAGE;
  const conferenceName = c.conference?.name ?? 'Conference';

  return (
    <div className="min-h-screen bg-white">

      {/* Hero — plain image, no overlay */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <img src={imageUrl} alt={c.name ?? 'Church'} className="w-full h-full object-cover" />

        {/* Back button */}
        <div className="absolute top-24 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-6">
            <button onClick={() => navigate('/churches')}
              className="flex items-center gap-2 text-white/90 hover:text-white bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5" /> Back to Churches
            </button>
          </div>
        </div>

        {/* Title — bottom overlay strip only */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-3">{c.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
              {c.locationShort && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{c.locationShort}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>{conferenceName}</span>
              </div>
              {stats.teamCount > 0 && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{stats.teamCount} {pluralize(stats.teamCount, 'Team', 'Teams')}</span>
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

            {/* Service Times */}
            {sections.hasServiceTimes && (
              <div>
                <h2 className="text-[#1F2937] text-2xl font-bold mb-2">Service Times</h2>
                <div>
                  {services.sabbathSchool && <ServiceTimeRow icon={Clock}    label="Sabbath School"  service={services.sabbathSchool} />}
                  {services.worship       && <ServiceTimeRow icon={Clock}    label="Worship Service" service={services.worship} />}
                  {services.prayerMeeting && <ServiceTimeRow icon={Calendar} label="Prayer Meeting"  service={services.prayerMeeting} />}
                  {services.vespers       && <ServiceTimeRow icon={Clock}    label="Vespers"         service={services.vespers} />}
                </div>
                {services.special.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-[#1F2937] text-lg font-semibold mb-2">Special Services</h3>
                    {services.special.map((s, i) => (
                      <div key={i} className="py-3 border-b border-gray-100 last:border-0">
                        <p className="text-gray-900 font-medium">{s.name}</p>
                        {s.schedule    && <p className="text-gray-500 text-sm">{s.schedule}</p>}
                        {s.description && <p className="text-gray-400 text-sm mt-0.5">{s.description}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Facilities */}
            {sections.hasFacilities && (
              <div>
                <h2 className="text-[#1F2937] text-2xl font-bold mb-2">Our Facilities</h2>
                <div>
                  {facilities.sanctuary && (
                    <div className="flex items-start gap-3 py-3 border-b border-gray-100">
                      <Building2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">Sanctuary</p>
                        {facilities.sanctuary.capacity && (
                          <p className="text-gray-900 font-medium">{facilities.sanctuary.capacity} seats</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-1">
                          {facilities.sanctuary.hasAV && (
                            <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                              <Monitor className="w-3 h-3" /> A/V Equipped
                            </span>
                          )}
                          {facilities.sanctuary.hasAccessibility && (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600">
                              <Accessibility className="w-3 h-3" /> Accessible
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {facilities.classrooms.length > 0 && (
                    <div className="flex items-start gap-3 py-3 border-b border-gray-100">
                      <Users className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">Classrooms</p>
                        <p className="text-gray-900 font-medium">{facilities.classrooms.length} rooms available</p>
                      </div>
                    </div>
                  )}
                  {facilities.kitchen?.available && (
                    <div className="flex items-start gap-3 py-3 border-b border-gray-100">
                      <Utensils className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">Kitchen</p>
                        <p className="text-gray-900 font-medium">Available{facilities.kitchen.capacity ? ` · ${facilities.kitchen.capacity}` : ''}</p>
                      </div>
                    </div>
                  )}
                  {facilities.parking && (facilities.parking.spaces || facilities.parking.handicapSpaces) && (
                    <div className="flex items-start gap-3 py-3 border-b border-gray-100">
                      <Car className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wide mb-0.5">Parking</p>
                        {facilities.parking.spaces && <p className="text-gray-900 font-medium">{facilities.parking.spaces} spaces</p>}
                        {facilities.parking.handicapSpaces && <p className="text-gray-500 text-sm">{facilities.parking.handicapSpaces} handicap spaces</p>}
                      </div>
                    </div>
                  )}
                </div>
                {facilities.other.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {facilities.other.map((f, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-600">{f}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Leadership */}
            {sections.hasLeadership && (
              <div>
                <h2 className="text-[#1F2937] text-2xl font-bold mb-2">Leadership Team</h2>
                <div>
                  {leadership.associatePastors.map((p, i) => (
                    <LeaderRow key={i} title={i === 0 ? 'Pastor' : 'Associate Pastor'} leader={p} icon={User} />
                  ))}
                  {leadership.firstElder     && <LeaderRow title="First Elder"     leader={leadership.firstElder}     icon={User} />}
                  {leadership.acsCoordinator && <LeaderRow title="ACS Coordinator" leader={leadership.acsCoordinator} icon={Heart} highlight />}
                  {leadership.clerk          && <LeaderRow title="Church Clerk"    leader={leadership.clerk}          icon={User} />}
                  {leadership.treasurer      && <LeaderRow title="Treasurer"       leader={leadership.treasurer}      icon={User} />}
                </div>
              </div>
            )}

            {/* Outreach */}
            {sections.hasOutreach && (
              <div>
                <h2 className="text-[#1F2937] text-2xl font-bold mb-2">Community Outreach</h2>
                {outreach.primaryFocus.length > 0 && (
                  <div className="mb-4">
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Focus Areas</p>
                    <div className="flex flex-wrap gap-2">
                      {outreach.primaryFocus.map((f, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-full text-sm bg-[#FFF1EE] text-[#F44314]">
                          {f.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {outreach.serviceArea && (
                  <div className="space-y-1 text-sm text-gray-600">
                    {outreach.serviceArea.radius && <p>Serving within {outreach.serviceArea.radius} miles</p>}
                    {outreach.serviceArea.communities?.length > 0 && (
                      <p>Communities: {outreach.serviceArea.communities.join(', ')}</p>
                    )}
                    {outreach.serviceArea.specialPopulations?.length > 0 && (
                      <p>Special focus: {outreach.serviceArea.specialPopulations.join(', ')}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">

              {/* Contact */}
              <div className="bg-[#F8F7F5] border border-gray-200 rounded-2xl p-6">
                <h3 className="text-[#1F2937] text-lg font-bold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <ContactItem icon={MapPin} label="Address" value={c.formattedAddress} />
                  <ContactItem icon={Phone}  label="Phone"   value={contact.phoneDisplay}
                    href={contact.phone ? `tel:${contact.phone}` : undefined} />
                  {contact.email && (
                    <ContactItem icon={Mail} label="Email" value={contact.email} href={`mailto:${contact.email}`} />
                  )}
                  {contact.websiteDisplay && (
                    <ContactItem icon={Globe} label="Website" value={contact.websiteDisplay} href={contact.websiteDisplay} external />
                  )}
                </div>
              </div>

              {/* Stats */}
              {(stats.teamCount > 0 || stats.serviceCount > 0) && (
                <div className="bg-[#F8F7F5] border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-[#1F2937] text-lg font-bold mb-4">At a Glance</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    {stats.teamCount > 0 && (
                      <div>
                        <p className="text-[#1F2937] text-3xl font-bold">{stats.teamCount}</p>
                        <p className="text-gray-500 text-sm">{pluralize(stats.teamCount, 'Team', 'Teams')}</p>
                      </div>
                    )}
                    {stats.serviceCount > 0 && (
                      <div>
                        <p className="text-[#1F2937] text-3xl font-bold">{stats.serviceCount}</p>
                        <p className="text-gray-500 text-sm">{pluralize(stats.serviceCount, 'Service', 'Services')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                {contact.phone && (
                  <a href={`tel:${contact.phone}`}
                    className="w-full block bg-[#F44314] text-white text-center py-4 rounded-xl font-semibold hover:bg-[#d93a10] transition-colors">
                    Call Now
                  </a>
                )}
                {contact.websiteDisplay && (
                  <a href={contact.websiteDisplay} target="_blank" rel="noopener noreferrer"
                    className="w-full block bg-white border border-gray-200 text-gray-700 text-center py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                    Visit Website
                  </a>
                )}
                {c.directionsUrl && (
                  <a href={c.directionsUrl} target="_blank" rel="noopener noreferrer"
                    className="w-full block bg-white border border-gray-200 text-gray-700 text-center py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                    Get Directions
                  </a>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

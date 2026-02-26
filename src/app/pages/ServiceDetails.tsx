import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Users, Clock, Phone, Mail, Calendar, ArrowLeft, Heart, RefreshCw, Globe, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useServiceDetail } from '../hooks/useServices';
import type { ServiceLocation, ServiceCapacity, ServiceScheduling } from '../types/service.types';

const DEFAULT_SERVICE_IMAGE =
  'https://images.unsplash.com/photo-1559027615-cd4628902d4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getFirstLocation(locations?: ServiceLocation[]): ServiceLocation | null {
  return locations?.[0] ?? null;
}

function formatAddress(locations?: ServiceLocation[]): string {
  const loc = getFirstLocation(locations);
  if (!loc) return 'Address not available';
  if (!loc.address) return loc.label || 'Address not available';
  const { street, suburb, state, postcode } = loc.address;
  const parts = [street, suburb, state, postcode].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Address not available';
}

function formatLocationShort(locations?: ServiceLocation[]): string {
  const loc = getFirstLocation(locations);
  if (!loc) return 'Location TBA';
  const { suburb, state } = loc.address ?? {};
  if (suburb && state) return `${suburb}, ${state}`;
  return suburb || state || loc.label || 'Location TBA';
}

function formatCapacity(capacity?: ServiceCapacity): string {
  if (capacity?.maxParticipants) return `${capacity.maxParticipants}+ capacity`;
  return 'Contact for details';
}

function formatHours(scheduling?: ServiceScheduling): string {
  const schedule = scheduling?.weeklySchedule?.schedule;
  if (!schedule) return 'Contact for hours';
  const enabledDays = schedule
    .filter((day) => day.isEnabled && day.timeSlots.length > 0)
    .map((day) => {
      const slot = day.timeSlots[0];
      return `${DAY_NAMES[day.dayOfWeek]}: ${slot.startTime} – ${slot.endTime}`;
    });
  return enabledDays.length > 0 ? enabledDays.join(' · ') : 'Contact for hours';
}

function formatUnderscoreString(value?: string): string {
  if (!value) return '';
  return value.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { service, loading, error, refetch } = useServiceDetail(id);
  const [showBookingForm, setShowBookingForm] = useState(false);

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
          <button onClick={() => refetch()} className="inline-flex items-center justify-center gap-2 bg-[#F44314] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#d93a10] mb-3">
            <RefreshCw className="w-5 h-5" /> Try Again
          </button>
          <br />
          <Link to="/services" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1F2937]">
            <ArrowLeft className="w-5 h-5" /> Back to Services
          </Link>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 max-w-md text-center">
          <p className="text-[#1F2937] text-xl mb-4">Service not found</p>
          <Link to="/services" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1F2937]">
            <ArrowLeft className="w-5 h-5" /> Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = service.primaryImage?.url || DEFAULT_SERVICE_IMAGE;
  const address = formatAddress(service.locations);
  const locationShort = formatLocationShort(service.locations);
  const capacityText = formatCapacity(service.capacity);
  const hours = formatHours(service.scheduling);
  const phone = service.contactInfo?.phone;
  const email = service.contactInfo?.email;
  const website = service.contactInfo?.website;
  const teamName = service.teamId?.name || '';
  const churchName = service.churchId?.name || '';
  const requirements = service.eligibility?.requirements ?? [];
  const tags = service.tags ?? [];
  const gallery = service.gallery ?? [];
  const serviceType = formatUnderscoreString(service.type);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-[350px] md:h-[450px] overflow-hidden">
        <img src={imageUrl} alt={service.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70"></div>

        <div className="absolute top-24 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-6">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white/90 hover:text-white bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 transition-colors">
              <ArrowLeft className="w-5 h-5" /> Back
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 pb-8">
          <div className="max-w-7xl mx-auto px-6">
            {serviceType && (
              <span className="inline-block px-3 py-1 bg-[#FFF1EE] text-[#F44314] rounded-full text-xs font-semibold mb-3">{serviceType}</span>
            )}
            <h1 className="text-white text-3xl md:text-5xl font-bold mb-3">{service.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>{locationShort}</span></div>
              <div className="flex items-center gap-2"><Users className="w-4 h-4" /><span>{capacityText}</span></div>
              {teamName && <div className="flex items-center gap-2"><Heart className="w-4 h-4" /><span>{teamName}</span></div>}
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-[#F8F7F5] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/services" className="hover:text-[#F44314]">Services</Link>
            <ChevronRight className="w-3 h-3" />
            {serviceType && <><span className="hover:text-[#F44314] cursor-pointer">{serviceType}</span><ChevronRight className="w-3 h-3" /></>}
            <span className="text-gray-600">{service.name}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main */}
          <div className="lg:col-span-2 space-y-10">
            {/* About */}
            <div>
              <h2 className="text-[#1F2937] text-2xl font-bold mb-4">About This Service</h2>
              {service.descriptionLong ? (
                <p className="text-gray-600 text-lg leading-relaxed">{service.descriptionLong}</p>
              ) : service.descriptionShort ? (
                <p className="text-gray-600 leading-relaxed">{service.descriptionShort}</p>
              ) : (
                <div className="bg-[#F8F7F5] border border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <p className="text-gray-400">Service description coming soon. Contact the team for more information.</p>
                </div>
              )}
            </div>

            {/* What's Included */}
            {tags.length > 0 && (
              <div>
                <h2 className="text-[#1F2937] text-2xl font-bold mb-4">What's Included</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {tags.map((tag, i) => (
                    <div key={i} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                      <div className="w-8 h-8 bg-[#FFF1EE] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Heart className="w-4 h-4 text-[#F44314]" />
                      </div>
                      <span className="text-[#1F2937] font-medium text-sm">{formatUnderscoreString(tag)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {requirements.length > 0 && (
              <div>
                <h2 className="text-[#1F2937] text-2xl font-bold mb-4">What to Bring</h2>
                <div className="bg-[#F8F7F5] rounded-xl p-6">
                  <ul className="space-y-3">
                    {requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F44314] flex-shrink-0 mt-2"></div>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <div>
                <h2 className="text-[#1F2937] text-2xl font-bold mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gallery.map((img, i) => (
                    <div key={i} className="relative h-48 overflow-hidden rounded-xl group cursor-pointer">
                      <img src={img.url} alt={img.alt || `Gallery ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state prompts for church admins filling in their page */}
            {!service.descriptionLong && !service.descriptionShort && tags.length === 0 && gallery.length === 0 && (
              <div className="bg-[#F8F7F5] border border-dashed border-gray-300 rounded-2xl p-10 text-center">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-[#1F2937] text-xl font-semibold mb-2">This service page is ready to be filled in</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Add a description, upload photos, set your hours, and list what's included. The more detail you add, the easier it is for people to find and access your service.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Service Details Card */}
              <div className="bg-[#F8F7F5] border border-gray-200 rounded-2xl p-6">
                <h3 className="text-[#1F2937] text-lg font-bold mb-4">Service Details</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-1"><MapPin className="w-4 h-4" /><span className="text-xs uppercase tracking-wide">Location</span></div>
                    <p className="text-[#1F2937] font-medium text-sm">{address}</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-1"><Clock className="w-4 h-4" /><span className="text-xs uppercase tracking-wide">Hours</span></div>
                    <p className="text-[#1F2937] font-medium text-sm">{hours}</p>
                  </div>

                  {phone && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-400 mb-1"><Phone className="w-4 h-4" /><span className="text-xs uppercase tracking-wide">Phone</span></div>
                      <a href={`tel:${phone}`} className="text-[#F44314] font-semibold text-sm hover:underline">{phone}</a>
                    </div>
                  )}

                  {email && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-400 mb-1"><Mail className="w-4 h-4" /><span className="text-xs uppercase tracking-wide">Email</span></div>
                      <a href={`mailto:${email}`} className="text-[#F44314] text-sm hover:underline break-all">{email}</a>
                    </div>
                  )}

                  {website && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-400 mb-1"><Globe className="w-4 h-4" /><span className="text-xs uppercase tracking-wide">Website</span></div>
                      <a href={website} target="_blank" rel="noopener noreferrer" className="text-[#F44314] text-sm hover:underline break-all">{website}</a>
                    </div>
                  )}

                  {teamName && (
                    <div>
                      <div className="flex items-center gap-2 text-gray-400 mb-1"><Heart className="w-4 h-4" /><span className="text-xs uppercase tracking-wide">Provided By</span></div>
                      <p className="text-[#1F2937] font-medium text-sm">{teamName}</p>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-1"><Users className="w-4 h-4" /><span className="text-xs uppercase tracking-wide">Capacity</span></div>
                    <p className="text-[#1F2937] font-medium text-sm">{capacityText}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowBookingForm(!showBookingForm)}
                  className="w-full bg-[#F44314] text-white py-4 rounded-xl font-semibold hover:bg-[#d93a10] transition-colors shadow-sm"
                >
                  {showBookingForm ? 'Hide Form' : 'Request an Appointment'}
                </button>
                {phone && (
                  <a href={`tel:${phone}`} className="w-full block bg-white border border-gray-200 text-[#1F2937] text-center py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                    Call Now
                  </a>
                )}
              </div>

              {/* Booking Form */}
              {showBookingForm && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h3 className="text-[#1F2937] text-lg font-bold mb-4">Request an Appointment</h3>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-gray-600 text-sm mb-1">Full Name</label>
                      <input type="text" placeholder="Your name" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F44314]" />
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-1">Phone</label>
                      <input type="tel" placeholder="Your phone number" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F44314]" />
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-1">Email</label>
                      <input type="email" placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F44314]" />
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-1">Preferred Date</label>
                      <input type="date" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:border-[#F44314]" />
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-1">Message</label>
                      <textarea rows={3} placeholder="Tell us what you're looking for..." className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F44314]" />
                    </div>
                    <button type="submit" className="w-full bg-[#F44314] text-white py-3 rounded-xl font-semibold hover:bg-[#d93a10] transition-colors">
                      Submit Request
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

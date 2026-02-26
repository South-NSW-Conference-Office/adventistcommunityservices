import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Users, Clock, Phone, Mail, Calendar, ArrowLeft, Heart, RefreshCw, Globe, ChevronRight, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import { useState, useRef } from 'react';
import { useServiceDetail, useServices } from '../hooks/useServices';
import { ServiceRequestBanner } from '../components/ServiceRequestBanner';
import type { ServiceLocation, ServiceCapacity, ServiceScheduling } from '../types/service.types';

const DEFAULT_SERVICE_IMAGE = 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getFirstLocation(locations?: ServiceLocation[]): ServiceLocation | null {
  return locations?.[0] ?? null;
}

function formatAddress(locations?: ServiceLocation[]): string {
  const loc = getFirstLocation(locations);
  if (!loc?.address) return loc?.label || 'Address not available';
  const { street, suburb, state, postcode } = loc.address;
  return [street, suburb, state, postcode].filter(Boolean).join(', ') || 'Address not available';
}

function formatLocationShort(locations?: ServiceLocation[]): string {
  const loc = getFirstLocation(locations);
  if (!loc) return 'Location TBA';
  const { suburb, state } = loc.address ?? {};
  if (suburb && state) return `${suburb}, ${state}`;
  return suburb || state || loc.label || 'Location TBA';
}

function formatCapacity(capacity?: ServiceCapacity): string {
  return capacity?.maxParticipants ? `${capacity.maxParticipants}+ capacity` : 'Contact for details';
}

function getScheduleEntries(scheduling?: ServiceScheduling): { day: string; time: string }[] {
  const schedule = scheduling?.weeklySchedule?.schedule;
  if (!schedule) return [];
  return schedule
    .filter((d) => d.isEnabled && d.timeSlots.length > 0)
    .map((d) => ({
      day: DAY_NAMES[d.dayOfWeek],
      time: d.timeSlots.map(s => `${s.startTime} – ${s.endTime}`).join(', '),
    }));
}

function formatUnderscoreString(value?: string): string {
  if (!value) return '';
  return value.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

export function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { service, loading, error, refetch } = useServiceDetail(id);
  const { services: allServices } = useServices();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  if (loading) {
    return <div className="min-h-screen bg-white flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F44314]"></div></div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 max-w-md text-center">
          <p className="text-[#1F2937] text-xl mb-4">{error}</p>
          <button onClick={() => refetch()} className="inline-flex items-center gap-2 bg-[#F44314] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#d93a10] mb-3"><RefreshCw className="w-5 h-5" /> Try Again</button>
          <br /><Link to="/services" className="text-gray-500 hover:text-[#1F2937] text-sm"><ArrowLeft className="w-4 h-4 inline mr-1" />Back to Services</Link>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 max-w-md text-center">
          <p className="text-[#1F2937] text-xl mb-4">Service not found</p>
          <Link to="/services" className="text-gray-500 hover:text-[#1F2937] text-sm"><ArrowLeft className="w-4 h-4 inline mr-1" />Back to Services</Link>
        </div>
      </div>
    );
  }

  const imageUrl = service.primaryImage?.url || DEFAULT_SERVICE_IMAGE;
  const address = formatAddress(service.locations);
  const locationShort = formatLocationShort(service.locations);
  const capacityText = formatCapacity(service.capacity);
  const scheduleEntries = getScheduleEntries(service.scheduling);
  const phone = service.contactInfo?.phone;
  const email = service.contactInfo?.email;
  const website = service.contactInfo?.website;
  const teamName = service.teamId?.name || '';
  const requirements = service.eligibility?.requirements ?? [];
  const tags = service.tags ?? [];
  const gallery = service.gallery ?? [];
  const serviceType = formatUnderscoreString(service.type);
  const allImages = [{ url: imageUrl, alt: service.name }, ...gallery.map(g => ({ url: g.url, alt: g.alt || service.name }))];

  const loc = service.locations?.[0];
  const coords = loc?.coordinates;
  const mapQuery = coords
    ? `${coords.lat},${coords.lng}`
    : encodeURIComponent([loc?.address?.suburb, loc?.address?.state, 'Australia'].filter(Boolean).join(', '));
  const mapSrc = coords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.02},${coords.lat - 0.015},${coords.lng + 0.02},${coords.lat + 0.015}&layer=mapnik&marker=${coords.lat},${coords.lng}`
    : `https://www.openstreetmap.org/export/embed.html?bbox=148.5,-36.0,152.5,-32.0&layer=mapnik`;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-[#F8F7F5] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/services" className="hover:text-[#F44314]">Services</Link>
            <ChevronRight className="w-3 h-3" />
            {serviceType && <><span className="hover:text-[#F44314] cursor-pointer">{serviceType}</span><ChevronRight className="w-3 h-3" /></>}
            <span className="text-gray-600 truncate">{service.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Section: Gallery + Info side by side */}
        <div className="grid lg:grid-cols-5 gap-8 mb-10">
          {/* Photo Gallery — 3 cols */}
          <div className="lg:col-span-3">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 aspect-[16/10]">
              <img
                src={allImages[galleryIndex]?.url}
                alt={allImages[galleryIndex]?.alt}
                className="w-full h-full object-cover"
              />
              {allImages.length > 1 && (
                <>
                  <button onClick={() => setGalleryIndex(i => i > 0 ? i - 1 : allImages.length - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors">
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button onClick={() => setGalleryIndex(i => i < allImages.length - 1 ? i + 1 : 0)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors">
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <ImageIcon className="w-3 h-3 text-white/70" />
                    <span className="text-white text-xs font-medium">{galleryIndex + 1} / {allImages.length}</span>
                  </div>
                </>
              )}
              {serviceType && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-[#FFF1EE] text-[#F44314] rounded-full text-xs font-semibold">{serviceType}</span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setGalleryIndex(i)} className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === galleryIndex ? 'border-[#F44314]' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Empty gallery prompt */}
            {gallery.length === 0 && !service.primaryImage?.url && (
              <div className="mt-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center">
                <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Add photos so visitors know what to expect</p>
              </div>
            )}
          </div>

          {/* Info Panel — 2 cols (Google Maps listing style) */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-[#1F2937] text-2xl md:text-3xl font-bold mb-2">{service.name}</h1>
              {teamName && <p className="text-gray-500 text-sm">Provided by <span className="font-medium text-[#1F2937]">{teamName}</span></p>}
            </div>

            {/* Quick Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#1F2937] text-sm font-medium">{address}</p>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noopener noreferrer" className="text-[#F44314] text-xs hover:underline">Get Directions</a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  {scheduleEntries.length > 0 ? (
                    <div className="space-y-1">
                      {scheduleEntries.map((e, i) => (
                        <div key={i} className="flex justify-between gap-4 text-sm">
                          <span className="text-[#1F2937] font-medium">{e.day}</span>
                          <span className="text-gray-500">{e.time}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">Hours not set — contact team for availability</p>
                  )}
                </div>
              </div>

              {phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <a href={`tel:${phone}`} className="text-[#F44314] text-sm font-semibold hover:underline">{phone}</a>
                </div>
              )}

              {email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <a href={`mailto:${email}`} className="text-[#F44314] text-sm hover:underline break-all">{email}</a>
                </div>
              )}

              {website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <a href={website} target="_blank" rel="noopener noreferrer" className="text-[#F44314] text-sm hover:underline break-all">{website}</a>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600 text-sm">{capacityText}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button onClick={() => setShowBookingForm(!showBookingForm)} className="w-full bg-[#F44314] text-white py-3.5 rounded-xl font-semibold hover:bg-[#d93a10] transition-colors shadow-sm text-sm">
                {showBookingForm ? 'Hide Form' : 'Request an Appointment'}
              </button>
              {phone && (
                <a href={`tel:${phone}`} className="w-full block bg-white border border-gray-200 text-[#1F2937] text-center py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm">
                  Call Now
                </a>
              )}
            </div>

            {/* Mini Map */}
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <iframe src={mapSrc} className="w-full h-40 border-0" loading="lazy" title={`Map - ${service.name}`} />
            </div>
          </div>
        </div>

        {/* Booking Form (expandable) */}
        {showBookingForm && (
          <div className="bg-[#F8F7F5] border border-gray-200 rounded-2xl p-6 mb-10 max-w-2xl">
            <h3 className="text-[#1F2937] text-lg font-bold mb-4">Request an Appointment</h3>
            <form className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 text-xs mb-1">Full Name</label>
                <input type="text" placeholder="Your name" className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F44314] text-sm" />
              </div>
              <div>
                <label className="block text-gray-600 text-xs mb-1">Phone</label>
                <input type="tel" placeholder="Your phone number" className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F44314] text-sm" />
              </div>
              <div>
                <label className="block text-gray-600 text-xs mb-1">Email</label>
                <input type="email" placeholder="your@email.com" className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F44314] text-sm" />
              </div>
              <div>
                <label className="block text-gray-600 text-xs mb-1">Preferred Date</label>
                <input type="date" className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-900 focus:outline-none focus:border-[#F44314] text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-600 text-xs mb-1">Message</label>
                <textarea rows={3} placeholder="Tell us what you're looking for..." className="w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#F44314] text-sm" />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="bg-[#F44314] text-white py-3 px-8 rounded-xl font-semibold hover:bg-[#d93a10] transition-colors text-sm">Submit Request</button>
              </div>
            </form>
          </div>
        )}

        {/* About + Details */}
        <div className="grid lg:grid-cols-2 gap-10 mb-10">
          {/* About */}
          <div>
            <h2 className="text-[#1F2937] text-xl font-bold mb-3">About This Service</h2>
            {service.descriptionLong ? (
              <p className="text-gray-600 leading-relaxed">{service.descriptionLong}</p>
            ) : service.descriptionShort ? (
              <p className="text-gray-600 leading-relaxed">{service.descriptionShort}</p>
            ) : (
              <p className="text-gray-400 italic">Description coming soon.</p>
            )}
          </div>

          {/* What's included + Requirements */}
          <div className="space-y-6">
            {tags.length > 0 && (
              <div>
                <h2 className="text-[#1F2937] text-xl font-bold mb-3">What's Included</h2>
                <div className="space-y-2">
                  {tags.map((tag, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#F44314]"></div>
                      <span className="text-gray-600 text-sm">{formatUnderscoreString(tag)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {requirements.length > 0 && (
              <div>
                <h2 className="text-[#1F2937] text-xl font-bold mb-3">What to Bring</h2>
                <div className="bg-[#F8F7F5] rounded-xl p-4">
                  <ul className="space-y-2">
                    {requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0 mt-1.5"></div>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Empty state for admins */}
        {!service.descriptionLong && !service.descriptionShort && tags.length === 0 && gallery.length === 0 && (
          <div className="bg-[#F8F7F5] border border-dashed border-gray-300 rounded-2xl p-10 text-center mb-10">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-[#1F2937] text-xl font-semibold mb-2">This service page is ready to be filled in</h3>
            <p className="text-gray-400 max-w-md mx-auto">Add a description, upload photos, set your hours, and list what's included.</p>
          </div>
        )}
      </div>

      {/* ====== Other Services by This Provider — carousel ====== */}
      {(() => {
        const teamId = service.teamId?._id;
        const siblings = teamId
          ? allServices.filter(s => s.teamId?._id === teamId && s._id !== service._id)
          : [];
        if (siblings.length === 0) return null;

        const scroll = (dir: 'left' | 'right') => {
          if (!carouselRef.current) return;
          const amount = carouselRef.current.offsetWidth * 0.7;
          carouselRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
        };

        return (
          <div className="bg-[#F8F7F5] border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6 py-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-[#1F2937] text-xl font-bold">More from {teamName || 'this team'}</h2>
                  <p className="text-gray-400 text-sm mt-1">{siblings.length} other service{siblings.length !== 1 ? 's' : ''} available</p>
                </div>
                {siblings.length > 3 && (
                  <div className="flex gap-2">
                    <button onClick={() => scroll('left')} className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <button onClick={() => scroll('right')} className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                )}
              </div>

              <div ref={carouselRef} className="flex gap-4 overflow-x-auto scroll-smooth pb-2 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
                {siblings.map((sib) => {
                  const sibImg = sib.primaryImage?.url || DEFAULT_SERVICE_IMAGE;
                  const sibLoc = formatLocationShort(sib.locations);
                  const sibType = formatUnderscoreString(sib.type);
                  return (
                    <Link
                      key={sib._id}
                      to={`/services/${sib._id}`}
                      className="flex-shrink-0 w-72 bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all group"
                    >
                      <div className="relative h-40 overflow-hidden">
                        <img src={sibImg} alt={sib.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        {sibType && (
                          <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-[#FFF1EE] text-[#F44314] rounded-full text-xs font-semibold">{sibType}</span>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-[#1F2937] font-semibold text-sm group-hover:text-[#F44314] transition-colors mb-1 truncate">{sib.name}</h3>
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                          <MapPin className="w-3 h-3" />
                          <span>{sibLoc}</span>
                        </div>
                        {sib.descriptionShort && (
                          <p className="text-gray-500 text-xs mt-2 line-clamp-2">{sib.descriptionShort}</p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}

      {/* ====== SERVICE REQUEST BANNER ====== */}
      <ServiceRequestBanner contextName={teamName || service.name} teamId={service.teamId?._id} pageType="service" />
    </div>
  );
}

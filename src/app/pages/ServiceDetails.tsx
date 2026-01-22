import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Users, Clock, Phone, Mail, Calendar, ArrowLeft, Heart, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';
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
  if (suburb) return suburb;
  if (state) return state;
  return loc.label || 'Location TBA';
}

function formatCapacity(capacity?: ServiceCapacity): string {
  if (capacity?.maxParticipants) {
    return `${capacity.maxParticipants}+ capacity`;
  }
  return 'Contact for details';
}

function formatHours(scheduling?: ServiceScheduling): string {
  const schedule = scheduling?.weeklySchedule?.schedule;
  if (!schedule) return 'Contact for hours';

  const enabledDays = schedule
    .filter((day) => day.isEnabled && day.timeSlots.length > 0)
    .map((day) => {
      const slot = day.timeSlots[0];
      return `${DAY_NAMES[day.dayOfWeek]}: ${slot.startTime} - ${slot.endTime}`;
    });

  return enabledDays.length > 0 ? enabledDays.join(', ') : 'Contact for hours';
}

interface StateOverlayProps {
  children: ReactNode;
}

function StateOverlay({ children }: StateOverlayProps): ReactNode {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F44314] via-[#F97023] to-[#F98344] flex items-center justify-center px-6">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-12 max-w-md text-center">
        {children}
      </div>
    </div>
  );
}

interface ContactItemProps {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}

function ContactItem({ icon, label, children }: ContactItemProps): ReactNode {
  return (
    <div>
      <div className="flex items-center gap-2 text-white/70 mb-2">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      {children}
    </div>
  );
}

const FORM_INPUT_CLASS =
  'w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40';

interface FormFieldProps {
  label: string;
  type: 'text' | 'tel' | 'email' | 'date' | 'textarea';
  placeholder?: string;
  rows?: number;
}

function FormField({ label, type, placeholder, rows }: FormFieldProps): ReactNode {
  return (
    <div>
      <label className="block text-white/90 text-sm mb-2">{label}</label>
      {type === 'textarea' ? (
        <textarea rows={rows} className={FORM_INPUT_CLASS} placeholder={placeholder} />
      ) : (
        <input type={type} className={FORM_INPUT_CLASS} placeholder={placeholder} />
      )}
    </div>
  );
}

export function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { service, loading, error, refetch } = useServiceDetail(id);
  const [showBookingForm, setShowBookingForm] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F44314] via-[#F97023] to-[#F98344] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <StateOverlay>
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
            to="/services"
            className="inline-flex items-center justify-center gap-2 text-white/90 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Services
          </Link>
        </div>
      </StateOverlay>
    );
  }

  if (!service) {
    return (
      <StateOverlay>
        <p className="text-white text-xl mb-4">Service not found</p>
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Services
        </Link>
      </StateOverlay>
    );
  }

  const imageUrl = service.primaryImage?.url || DEFAULT_SERVICE_IMAGE;
  const address = formatAddress(service.locations);
  const locationShort = formatLocationShort(service.locations);
  const capacityText = formatCapacity(service.capacity);
  const hours = formatHours(service.scheduling);
  const phone = service.contactInfo?.phone;
  const hasPhone = Boolean(phone);
  const email = service.contactInfo?.email;
  const churchName = service.churchId?.name || 'Community Church';
  const requirements = service.eligibility?.requirements ?? [];
  const tags = service.tags ?? [];
  const gallery = service.gallery ?? [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F44314] via-[#F97023] to-[#F98344]">
      {/* Hero Image Section */}
      <div className="relative h-[500px] overflow-hidden">
        <img src={imageUrl} alt={service.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 via-30% via-transparent via-70% to-[#F44314]"></div>

        {/* Back Button */}
        <div className="absolute top-24 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-6">
            <button
              onClick={() => navigate('/services')}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Services
            </button>
          </div>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 pb-12">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-white text-5xl font-bold mb-4">{service.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{locationShort}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{capacityText}</span>
              </div>
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
              <h2 className="text-white text-3xl font-semibold mb-4">About This Service</h2>
              {service.descriptionLong ? (
                <p className="text-white/90 text-lg leading-relaxed mb-4">{service.descriptionLong}</p>
              ) : service.descriptionShort ? (
                <p className="text-white/80 leading-relaxed">{service.descriptionShort}</p>
              ) : (
                <p className="text-white/80 leading-relaxed">
                  Contact us for more information about this service.
                </p>
              )}
              {service.descriptionLong && service.descriptionShort && (
                <p className="text-white/80 leading-relaxed">{service.descriptionShort}</p>
              )}
            </div>

            {/* Services Offered (using tags) */}
            {tags.length > 0 && (
              <div>
                <h2 className="text-white text-2xl font-semibold mb-4">What We Offer</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {tags.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4"
                    >
                      <Heart className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                      <span className="text-white/90">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {requirements.length > 0 && (
              <div>
                <h2 className="text-white text-2xl font-semibold mb-4">What You'll Need</h2>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <ul className="space-y-3">
                    {requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3 text-white/90">
                        <div className="w-2 h-2 rounded-full bg-white/70 flex-shrink-0 mt-2"></div>
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
                <h2 className="text-white text-2xl font-semibold mb-4">Gallery</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {gallery.map((img, index) => (
                    <div
                      key={index}
                      className="relative h-48 overflow-hidden rounded-xl group cursor-pointer"
                    >
                      <img
                        src={img.url}
                        alt={img.alt || `${service.name} gallery ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Contact Information */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <h3 className="text-white text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <ContactItem icon={<MapPin className="w-4 h-4" />} label="Address">
                    <p className="text-white">{address}</p>
                  </ContactItem>

                  <ContactItem icon={<Phone className="w-4 h-4" />} label="Phone">
                    {hasPhone ? (
                      <a href={`tel:${phone}`} className="text-white hover:text-white/80 transition-colors">
                        {phone}
                      </a>
                    ) : (
                      <p className="text-white">Contact for details</p>
                    )}
                  </ContactItem>

                  {email && (
                    <ContactItem icon={<Mail className="w-4 h-4" />} label="Email">
                      <a
                        href={`mailto:${email}`}
                        className="text-white hover:text-white/80 transition-colors break-all"
                      >
                        {email}
                      </a>
                    </ContactItem>
                  )}

                  <ContactItem icon={<Clock className="w-4 h-4" />} label="Hours">
                    <p className="text-white">{hours}</p>
                  </ContactItem>

                  <ContactItem icon={<Calendar className="w-4 h-4" />} label="Church">
                    <p className="text-white">{churchName}</p>
                  </ContactItem>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowBookingForm(!showBookingForm)}
                  className="w-full bg-white text-[#F44314] py-4 rounded-xl font-semibold hover:bg-white/90 transition-colors"
                >
                  {showBookingForm ? 'Hide Booking Form' : 'Book an Appointment'}
                </button>
                {hasPhone && (
                  <a
                    href={`tel:${phone}`}
                    className="w-full block bg-white/10 backdrop-blur-sm border border-white/20 text-white text-center py-4 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                  >
                    Call Now
                  </a>
                )}
              </div>

              {/* Booking Form */}
              {showBookingForm && (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <h3 className="text-white text-xl font-semibold mb-4">Request an Appointment</h3>
                  <form className="space-y-4">
                    <FormField type="text" label="Full Name" placeholder="Your name" />
                    <FormField type="tel" label="Phone" placeholder="Your phone number" />
                    <FormField type="email" label="Email" placeholder="your@email.com" />
                    <FormField type="date" label="Preferred Date" />
                    <FormField type="textarea" label="Message" placeholder="Tell us about your needs..." rows={4} />
                    <button
                      type="submit"
                      className="w-full bg-white text-[#F44314] py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors"
                    >
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

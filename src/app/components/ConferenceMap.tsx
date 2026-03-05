import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONFERENCES, Conference } from '../data/conferences';
import { AU_VIEWBOX, CONFERENCE_PATHS, CONFERENCE_LABELS } from '../data/conferenceMapPaths';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { MapPin, Mail } from 'lucide-react';

interface ConferenceMapProps {
  className?: string;
}

const CONF_DISPLAY: Record<string, string> = {
  snsw: 'South NSW',
  nnsw: 'North NSW',
  vic: 'Victoria',
  sq: 'South QLD',
  sa: 'South Australia',
  wa: 'Western Australia',
  tas: 'Tasmania',
  nq: 'North Australia',
};

export const ConferenceMap: React.FC<ConferenceMapProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);

  const handleClick = async (code: string) => {
    // nnsw click target also represents snsw area
    const actualCode = code;
    const conference = CONFERENCES.find(c => c.code === actualCode);
    if (!conference) return;

    if (conference.active) {
      navigate(`/services?conference=${code}`);
    } else {
      setSelectedConference(conference);
      setModalOpen(true);
      try {
        await fetch('/api/contact/conference-interest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conference: code, timestamp: Date.now() }),
        });
      } catch { /* silent */ }
    }
  };

  // Determine fill for a conference path
  const getFill = (code: string) => {
    const conference = CONFERENCES.find(c => c.code === code);
    const isActive = conference?.active ?? false;
    const isHovered = hoveredCode === code;

    // Special: NSW path contains both SNSW (active) and NNSW (inactive)
    // Show it as active since SNSW is part of it
    if (code === 'nnsw') {
      const snsw = CONFERENCES.find(c => c.code === 'snsw');
      if (snsw?.active) {
        return isHovered ? '#DC2626' : '#F44314';
      }
    }

    if (isActive) return isHovered ? '#DC2626' : '#F44314';
    return isHovered ? '#4B5563' : '#374151';
  };

  return (
    <div className={className}>
      <div className="relative max-w-2xl mx-auto">
        <svg viewBox={AU_VIEWBOX} className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          {/* Conference territories */}
          {Object.entries(CONFERENCE_PATHS).map(([code, path]) => (
            <path
              key={code}
              d={path}
              fill={getFill(code)}
              stroke="#1F2937"
              strokeWidth="0.5"
              className="cursor-pointer transition-all duration-200"
              onClick={() => handleClick(code === 'nnsw' ? 'snsw' : code)}
              onMouseEnter={() => setHoveredCode(code)}
              onMouseLeave={() => setHoveredCode(null)}
            />
          ))}

          {/* Conference labels */}
          {Object.entries(CONFERENCE_LABELS).map(([code, pos]) => {
            const conference = CONFERENCES.find(c => c.code === code);
            const isActive = conference?.active ?? false;
            const label = CONF_DISPLAY[code] || code.toUpperCase();

            // Skip snsw label if it overlaps nnsw (they share NSW territory)
            // Show both labels at different positions
            return (
              <g key={`label-${code}`} className="pointer-events-none">
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#FFFFFF"
                  fontSize={isActive ? '7' : '6'}
                  fontWeight={isActive ? '700' : '500'}
                  fontFamily="Inter, system-ui, sans-serif"
                  className="select-none"
                >
                  {label}
                </text>
                {isActive && (
                  <text
                    x={pos.x}
                    y={pos.y + 8}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#FCA5A5"
                    fontSize="5"
                    fontWeight="700"
                    fontFamily="Inter, system-ui, sans-serif"
                    className="select-none"
                    letterSpacing="0.5"
                  >
                    ● ACTIVE
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Inactive modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#F44314]" />
              {selectedConference?.name}
            </DialogTitle>
            <DialogDescription className="text-left space-y-3 pt-2">
              <p className="text-base">
                People in <strong>{selectedConference?.state}</strong> are looking for community services!
              </p>
              <p>
                This conference hasn't activated on communityservices.org.au yet.
                Want to bring ACS services to your area?
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <a
              href={`mailto:${selectedConference?.contactEmail}?subject=Activate ${selectedConference?.name} on communityservices.org.au&body=Hi ACS,%0A%0APeople are looking for community services in ${selectedConference?.state}. I'd like to help activate our conference.%0A%0AThanks`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F44314] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#DC2626] transition-colors"
            >
              <Mail className="w-4 h-4" />
              Contact ACS
            </a>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

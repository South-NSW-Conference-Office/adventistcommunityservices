import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONFERENCES, Conference } from '../data/conferences';
import { AU_OUTLINE, CONFERENCE_PATHS, CONFERENCE_LABELS } from '../data/conferenceMapPaths';
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

const CONFERENCE_NAMES: Record<string, string> = {
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

  const handleConferenceClick = async (code: string) => {
    const conference = CONFERENCES.find(c => c.code === code);
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

  return (
    <div className={className}>
      <div className="relative max-w-2xl mx-auto">
        <svg viewBox="0 0 800 700" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
          {/* Solid Australia base — fills the whole continent with no gaps */}
          <path d={AU_OUTLINE} fill="#374151" stroke="none" />

          {/* Conference territory overlays — clickable regions */}
          {Object.entries(CONFERENCE_PATHS).map(([code, path]) => {
            const conference = CONFERENCES.find(c => c.code === code);
            const isActive = conference?.active ?? false;
            const isHovered = hoveredCode === code;

            return (
              <path
                key={code}
                d={path}
                fill={
                  isActive
                    ? isHovered ? '#DC2626' : '#F44314'
                    : isHovered ? '#4B5563' : 'transparent'
                }
                stroke="#6B7280"
                strokeWidth="1"
                strokeDasharray={isActive ? 'none' : '4 2'}
                className="cursor-pointer transition-all duration-200"
                onClick={() => handleConferenceClick(code)}
                onMouseEnter={() => setHoveredCode(code)}
                onMouseLeave={() => setHoveredCode(null)}
              />
            );
          })}

          {/* Conference labels */}
          {Object.entries(CONFERENCE_LABELS).map(([code, pos]) => {
            const conference = CONFERENCES.find(c => c.code === code);
            const isActive = conference?.active ?? false;
            const label = CONFERENCE_NAMES[code] || code.toUpperCase();

            return (
              <g key={`label-${code}`} className="pointer-events-none">
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isActive ? '#FFFFFF' : '#D1D5DB'}
                  fontSize="13"
                  fontWeight={isActive ? '700' : '500'}
                  fontFamily="Inter, system-ui, sans-serif"
                  className="select-none"
                >
                  {label}
                </text>
                {isActive && (
                  <text
                    x={pos.x}
                    y={pos.y + 16}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#F44314"
                    fontSize="10"
                    fontWeight="700"
                    fontFamily="Inter, system-ui, sans-serif"
                    className="select-none"
                    letterSpacing="1"
                  >
                    ● ACTIVE
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Inactive conference modal */}
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
              href={`mailto:${selectedConference?.contactEmail}?subject=Activate ${selectedConference?.name} on communityservices.org.au&body=Hi ACS team,%0A%0APeople in ${selectedConference?.state} are looking for community services. I'd like to help activate our conference.%0A%0AThanks`}
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

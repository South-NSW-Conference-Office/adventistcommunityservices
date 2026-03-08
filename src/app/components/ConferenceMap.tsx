import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONFERENCES, Conference } from '../data/conferences';
import { AU_VIEWBOX, CONFERENCE_PATHS, CONFERENCE_LABELS, BOUNDARY_LINES } from '../data/conferenceMapPaths';
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

export const ConferenceMap: React.FC<ConferenceMapProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);

  const handleClick = async (code: string) => {
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

  const getFill = (code: string) => {
    const conf = CONFERENCES.find(c => c.code === code);
    const isActive = conf?.active ?? false;
    const isHovered = hoveredCode === code;

    // Uniform grey base matching reference map
    if (isHovered) {
      return isActive ? '#F44314' : '#C8CCD0';
    }
    return '#D9DDE1';
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
              stroke="white"
              strokeWidth="0.8"
              className="cursor-pointer transition-all duration-200"
              onClick={() => {
                // NSW click → route to snsw (primary active)
                if (code === 'nnsw') handleClick('snsw');
                else handleClick(code);
              }}
              onMouseEnter={() => setHoveredCode(code)}
              onMouseLeave={() => setHoveredCode(null)}
            />
          ))}

          {/* Internal conference boundary lines */}
          {Object.entries(BOUNDARY_LINES).map(([key, path]) => (
            <path
              key={`boundary-${key}`}
              d={path}
              fill="none"
              stroke="white"
              strokeWidth="0.6"
              strokeDasharray="3 2"
              className="pointer-events-none"
            />
          ))}

          {/* Conference labels */}
          {Object.entries(CONFERENCE_LABELS).map(([code, info]) => {
            const conf = CONFERENCES.find(c => c.code === code);
            const isActive = conf?.active ?? false;
            const nameLines = info.name.split('\\n');

            return (
              <g key={`label-${code}`} className="pointer-events-none">
                {nameLines.map((line, i) => (
                  <text
                    key={i}
                    x={info.x}
                    y={info.y + (i * 8)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isActive ? '#1F2937' : '#4B5563'}
                    fontSize="5.5"
                    fontWeight="600"
                    fontFamily="Inter, system-ui, sans-serif"
                    className="select-none"
                  >
                    {line}
                  </text>
                ))}
                {isActive && (
                  <circle
                    cx={info.x}
                    cy={info.y + (nameLines.length * 8) + 2}
                    r="2"
                    fill="#F44314"
                    opacity="0.8"
                  />
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
                Want to bring Adventist Community Services to your area?
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <a
              href={`mailto:${selectedConference?.contactEmail}?subject=Activate ${selectedConference?.name} on communityservices.org.au&body=Hi,%0A%0A%0A%0APeople are looking for community services in ${selectedConference?.state}. I'd like to help activate our conference.%0A%0AThanks`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F44314] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#DC2626] transition-colors"
            >
              <Mail className="w-4 h-4" />
              Contact Us
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

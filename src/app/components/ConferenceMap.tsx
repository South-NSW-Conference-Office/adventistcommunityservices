import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONFERENCES, Conference } from '../data/conferences';
import { CONFERENCE_PATHS, CONFERENCE_LABELS } from '../data/conferenceMapPaths';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { MapPin, Mail, ArrowRight } from 'lucide-react';

interface ConferenceMapProps {
  className?: string;
}

export const ConferenceMap: React.FC<ConferenceMapProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);

  const handleConferenceClick = async (conferenceCode: string) => {
    const conference = CONFERENCES.find(c => c.code === conferenceCode);
    if (!conference) return;

    if (conference.active) {
      navigate(`/services?conference=${conferenceCode}`);
    } else {
      setSelectedConference(conference);
      setModalOpen(true);
      // Log interest (best effort)
      try {
        await fetch('/api/contact/conference-interest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conference: conferenceCode, timestamp: Date.now() }),
        });
      } catch {
        // Silent fail — modal is the priority
      }
    }
  };

  const conferenceNames: Record<string, string> = {
    snsw: 'South NSW',
    nnsw: 'North NSW',
    vic: 'Victoria',
    sq: 'South QLD',
    sa: 'SA & NT',
    wa: 'Western Australia',
    tas: 'Tasmania',
    nq: 'North QLD & NT',
  };

  return (
    <div className={className}>
      {/* Map */}
      <div className="relative max-w-3xl mx-auto">
        <svg
          viewBox="0 0 800 750"
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Render each conference territory */}
          {Object.entries(CONFERENCE_PATHS).map(([code, path]) => {
            const conference = CONFERENCES.find(c => c.code === code);
            const isActive = conference?.active ?? false;
            const isHovered = hoveredCode === code;

            return (
              <g key={code}>
                <path
                  d={path}
                  fill={
                    isActive
                      ? isHovered ? '#DC2626' : '#F44314'
                      : isHovered ? '#4B5563' : '#374151'
                  }
                  stroke="#1F2937"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-200"
                  onClick={() => handleConferenceClick(code)}
                  onMouseEnter={() => setHoveredCode(code)}
                  onMouseLeave={() => setHoveredCode(null)}
                />
              </g>
            );
          })}

          {/* Labels */}
          {Object.entries(CONFERENCE_LABELS).map(([code, pos]) => {
            const conference = CONFERENCES.find(c => c.code === code);
            const isActive = conference?.active ?? false;
            const label = conferenceNames[code] || code.toUpperCase();

            return (
              <g key={`label-${code}`} className="pointer-events-none">
                <text
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="select-none"
                  fill={isActive ? '#FFFFFF' : '#9CA3AF'}
                  fontSize="14"
                  fontWeight={isActive ? '700' : '500'}
                  fontFamily="Inter, system-ui, sans-serif"
                >
                  {label}
                </text>
                {isActive && (
                  <text
                    x={pos.x}
                    y={pos.y + 18}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="select-none"
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="Inter, system-ui, sans-serif"
                  >
                    ✓ ACTIVE
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
                Want to bring ACS services to {selectedConference?.state}?
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <a
              href={`mailto:${selectedConference?.contactEmail}?subject=Activate ${selectedConference?.name} on communityservices.org.au&body=Hi ACS team,%0A%0APeople in ${selectedConference?.state} are looking for community services on communityservices.org.au. I'd like to help activate our conference.%0A%0AThanks`}
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

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RegionLayer {
  file: string;
  code: string;
  label: string;
  transformOrigin: string;
  hitBox: [number, number, number, number];
  labelPos: [number, number];
  labelAnchor?: 'bottom' | 'left' | 'top';
  active: boolean;
  tint?: boolean;
}

const REGIONS: RegionLayer[] = [
  {
    file: 'layer 2.png',
    code: 'nau',
    label: 'Northern Australia',
    transformOrigin: '25% 41%',
    hitBox: [11.1, 11.9, 27.7, 57.9],
    labelPos: [25, 41],
    active: false,
  },
  {
    file: 'layer 3.png',
    code: 'wa',
    label: 'Western Australia',
    transformOrigin: '57% 25%',
    hitBox: [38.7, 4.2, 37.2, 42.1],
    labelPos: [57, 25],
    active: false,
  },
  {
    file: 'layer 4.png',
    code: 'sq',
    label: 'South Queensland',
    transformOrigin: '69% 44%',
    hitBox: [55.1, 33.8, 28.1, 19.7],
    labelPos: [69, 44],
    active: false,
  },
  {
    file: 'layer 5.png',
    code: 'sa',
    label: 'South Australia',
    transformOrigin: '50% 63%',
    hitBox: [38.7, 46.0, 21.7, 33.4],
    labelPos: [50, 63],
    active: false,
  },
  {
    file: 'layer 6.png',
    code: 'nnsw',
    label: 'North New South Wales',
    transformOrigin: '71% 60%',
    hitBox: [60.2, 52.0, 22.5, 16.8],
    labelPos: [71, 60],
    labelAnchor: 'top',
    active: true,
    tint: true,
  },
  {
    file: 'layer 7.png',
    code: 'snsw',
    label: 'South New South Wales',
    transformOrigin: '69% 70%',
    hitBox: [60.2, 59.5, 16.6, 22.1],
    labelPos: [69, 70],
    labelAnchor: 'left',
    active: true,
    tint: true,
  },
  {
    file: 'layer 8.png',
    code: 'norfolk',
    label: 'Norfolk Island',
    transformOrigin: '77% 71%',
    hitBox: [76.0, 68.9, 1.9, 3.6],
    labelPos: [77, 71],
    active: false,
  },
  {
    file: 'layer 9.png',
    code: 'gsc',
    label: 'Greater Sydney',
    transformOrigin: '68% 75%',
    hitBox: [60.2, 67.7, 15.9, 14.7],
    labelPos: [68, 75],
    active: false,
  },
  {
    file: 'layer 10.png',
    code: 'tas',
    label: 'Tasmania',
    transformOrigin: '70% 92%',
    hitBox: [66.5, 86.9, 7.8, 10.1],
    labelPos: [70, 92],
    active: false,
  },
];

const TINT_COLOR = '#F89620';

export const InteractiveConferenceMap: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleClick = (region: RegionLayer) => {
    if (region.active) {
      navigate(`/services?conference=${region.code}`);
    }
  };

  return (
    <div className="relative w-full mx-auto select-none">
      {/* SVG filter for orange tint */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="orange-tint" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.957
                      0 0 0 0 0.263
                      0 0 0 0 0.078
                      0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>

      <img
        src="/map/layer 1.png"
        alt="Australian SDA Conference Map"
        className="w-full h-auto pointer-events-none"
        draggable={false}
      />

      {REGIONS.map((region, idx) => {
        const isHovered = hoveredIdx === idx;
        return (
          <img
            key={region.code}
            src={`/map/${region.file}`}
            alt={region.label}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            draggable={false}
            style={{
              transformOrigin: region.transformOrigin,
              transform: isHovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.3s ease',
              zIndex: isHovered ? 20 : 10,
              filter: [
                region.tint ? 'url(#orange-tint)' : '',
                region.tint
                  ? 'drop-shadow(1px 0 0 white) drop-shadow(-1px 0 0 white) drop-shadow(0 1px 0 white) drop-shadow(0 -1px 0 white)'
                  : '',
                isHovered ? 'brightness(1.15) drop-shadow(0 4px 12px rgba(0,0,0,0.3))' : '',
              ].filter(Boolean).join(' ') || 'none',
            }}
          />
        );
      })}

      {REGIONS.map((region, idx) => (
        <div
          key={`hit-${region.code}`}
          className="absolute"
          style={{
            left: `${region.hitBox[0]}%`,
            top: `${region.hitBox[1]}%`,
            width: `${region.hitBox[2]}%`,
            height: `${region.hitBox[3]}%`,
            zIndex: 25,
            cursor: region.active ? 'pointer' : 'default',
          }}
          onMouseEnter={() => setHoveredIdx(idx)}
          onMouseLeave={() => setHoveredIdx(null)}
          onTouchStart={() => setHoveredIdx(idx === hoveredIdx ? null : idx)}
          onClick={() => handleClick(region)}
        />
      ))}

      {/* Hover labels — positioned below each region's hitbox */}
      {REGIONS.map((region, idx) => {
        const isVisible = hoveredIdx === idx;
        const anchor = region.labelAnchor || 'bottom';

        // Position based on anchor direction
        const pos = anchor === 'left'
          ? {
              left: `${region.hitBox[0] - 2}%`,
              top: `${region.hitBox[1] + region.hitBox[3] / 2}%`,
              transform: isVisible
                ? 'translate(-100%, -50%) scale(1)'
                : 'translate(-100%, -50%) scale(0)',
              transformOrigin: 'right center',
            }
          : anchor === 'top'
          ? {
              left: `${region.hitBox[0] + region.hitBox[2] / 2}%`,
              top: `${region.hitBox[1] - 2}%`,
              transform: isVisible
                ? 'translate(-50%, -100%) scale(1)'
                : 'translate(-50%, -100%) scale(0)',
              transformOrigin: 'bottom center',
            }
          : {
              left: `${region.hitBox[0] + region.hitBox[2] / 2}%`,
              top: `${region.hitBox[1] + region.hitBox[3] + 2}%`,
              transform: isVisible
                ? 'translate(-50%, 0) scale(1)'
                : 'translate(-50%, 0) scale(0)',
              transformOrigin: 'top center',
            };

        return (
          <div
            key={`label-${region.code}`}
            className="absolute pointer-events-none"
            style={{
              ...pos,
              opacity: isVisible ? 1 : 0,
              transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease',
              zIndex: 30,
            }}
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-full shadow-lg px-4 py-1.5 text-center whitespace-nowrap">
              <span className="text-sm font-semibold text-gray-800">
                {region.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

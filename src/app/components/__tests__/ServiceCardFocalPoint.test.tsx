import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ServiceCard } from '../ServiceCard';

// Banners and cards crop their image, and the crop is what loses faces. The admin now
// chooses where to centre it vertically (primaryImage.focalY, 0-100% from the top) and
// the public site has to honour that rather than always centring.
//
// The care here is for records saved before the control existed: they carry no focalY,
// and must keep rendering exactly as they did — a plain centre crop — rather than
// jumping to some new default.

function renderCard(primaryImage?: { url: string; alt?: string; focalY?: number }) {
  const { container } = render(
    <MemoryRouter>
      <ServiceCard
        id="6a87a320b50dca029dd1ccbf"
        name="Community Yard Cleans"
        descriptionShort="Yard clean-ups"
        primaryImage={primaryImage}
      />
    </MemoryRouter>
  );
  return container.querySelector('img') as HTMLImageElement;
}

const UPLOADED = 'https://example.test/banner.webp';

describe('ServiceCard — banner framing', () => {
  it('honours a focal point chosen in the admin', () => {
    const img = renderCard({ url: UPLOADED, focalY: 20 });

    expect(img.style.objectPosition).toBe('center 20%');
  });

  it('keeps the top of the picture when asked', () => {
    const img = renderCard({ url: UPLOADED, focalY: 0 });

    expect(img.style.objectPosition).toBe('center 0%');
  });

  it('keeps the bottom when asked', () => {
    const img = renderCard({ url: UPLOADED, focalY: 100 });

    expect(img.style.objectPosition).toBe('center 100%');
  });

  it('centres a record saved before the control existed', () => {
    // The regression that would matter: every existing service has no focalY.
    const img = renderCard({ url: UPLOADED });

    expect(img.style.objectPosition).toBe('center 50%');
  });

  it('uses the uploaded image itself', () => {
    const img = renderCard({ url: UPLOADED, focalY: 30 });

    expect(img.getAttribute('src')).toBe(UPLOADED);
  });
});

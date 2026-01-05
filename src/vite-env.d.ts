/// <reference types="vite/client" />

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module 'react-responsive-masonry' {
  import { ComponentType, ReactNode } from 'react';

  interface MasonryProps {
    children?: ReactNode;
    columnsCount?: number;
    gutter?: string;
  }

  interface ResponsiveMasonryProps {
    children?: ReactNode;
    columnsCountBreakPoints?: Record<number, number>;
  }

  export const ResponsiveMasonry: ComponentType<ResponsiveMasonryProps>;
  const Masonry: ComponentType<MasonryProps>;
  export default Masonry;
}

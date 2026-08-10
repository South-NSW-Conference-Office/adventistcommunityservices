import {
  Apple,
  BookOpen,
  Flower2,
  HeartHandshake,
  HeartPulse,
  Home,
  Scissors,
  ShoppingBag,
  ToyBrick,
  SprayCan,
  Trees,
  Truck,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react';

// Single source of truth for service categories.
//
// These `type` values must match the `type` field on service records, or the
// filters silently match nothing. Previously three separate hardcoded lists
// existed (here, HeroSection, and Services) built from an aspirational type
// list rather than the data - only op_shop, food_pantry and health_program
// overlapped with reality, so most services were unreachable by any filter.
//
// Ordered by how many services currently use each type.

export interface ServiceCategory {
  /** Matches `service.type` on the API record. */
  type: string;
  /** Short label, used on the compact filter chips. */
  label: string;
  /** Fuller name, used on the "Browse by Type" cards. */
  name: string;
  icon: LucideIcon;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { type: 'yard_work',      label: 'Yard Work',     name: 'Yard Work',        icon: Trees },
  { type: 'odd_jobs',       label: 'Odd Jobs',      name: 'Odd Jobs',         icon: Wrench },
  { type: 'food_pantry',    label: 'Food Pantry',   name: 'Food Pantry',      icon: Apple },
  { type: 'lawn_care',      label: 'Lawn Care',     name: 'Lawn Care',        icon: Scissors },
  { type: 'cleaning',       label: 'Cleaning',      name: 'Cleaning',         icon: SprayCan },
  { type: 'gardening',      label: 'Gardening',     name: 'Gardening',        icon: Flower2 },
  { type: 'home_help',      label: 'Home Help',     name: 'Home Help',        icon: Home },
  { type: 'moving_houses',  label: 'Moving',        name: 'Moving Houses',    icon: Truck },
  { type: 'op_shop',        label: 'Op Shops',      name: 'Op Shop',          icon: ShoppingBag },
  { type: 'health_program', label: 'Health',        name: 'Health Program',   icon: HeartPulse },
  { type: 'pastoral_care',  label: 'Pastoral Care', name: 'Pastoral Care',    icon: HeartHandshake },
  { type: 'courses',        label: 'Classes',       name: 'Classes & Courses', icon: BookOpen },
  // --- Reserved: no service carries these types yet, so they show 0 --------
  // They will populate automatically once a matching service record exists.
  { type: 'kids_club',      label: 'Kids Club',     name: 'Kids Club',        icon: ToyBrick },
  { type: 'youth_outreach', label: 'Youth',         name: 'Youth Outreach',   icon: Users },
];

// Back-compat: the compact chip components consume { label, type }.
export const CATEGORIES = SERVICE_CATEGORIES;

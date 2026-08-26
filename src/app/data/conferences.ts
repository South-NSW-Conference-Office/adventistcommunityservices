export interface Conference {
  code: string;
  name: string;
  state: string;
  active: boolean;
  contactEmail: string;
}

export const CONFERENCES: Conference[] = [
  { code: 'snsw', name: 'South NSW Conference', state: 'Southern NSW', active: true, contactEmail: 'snswfinance@adventist.bot' },
  { code: 'nnsw', name: 'North NSW Conference', state: 'Northern NSW', active: true, contactEmail: 'snswfinance@adventist.bot' },
  { code: 'gsc', name: 'Greater Sydney Conference', state: 'Greater Sydney', active: false, contactEmail: 'snswfinance@adventist.bot' },
  { code: 'vic', name: 'Victorian Conference', state: 'Victoria', active: false, contactEmail: 'snswfinance@adventist.bot' },
  { code: 'sa', name: 'South Australian Conference', state: 'SA & NT', active: false, contactEmail: 'snswfinance@adventist.bot' },
  { code: 'wa', name: 'Western Australian Conference', state: 'Western Australia', active: false, contactEmail: 'snswfinance@adventist.bot' },
  { code: 'tas', name: 'Tasmanian Conference', state: 'Tasmania', active: false, contactEmail: 'snswfinance@adventist.bot' },
  { code: 'nq', name: 'North Queensland Conference', state: 'North Queensland', active: false, contactEmail: 'snswfinance@adventist.bot' },
  { code: 'sq', name: 'South Queensland Conference', state: 'South Queensland', active: false, contactEmail: 'snswfinance@adventist.bot' },
];
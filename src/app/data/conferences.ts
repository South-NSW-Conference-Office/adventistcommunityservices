export interface Conference {
  code: string;
  name: string;
  state: string;
  active: boolean;
  contactEmail: string;
}

export const CONFERENCES: Conference[] = [
  { code: 'snsw', name: 'South NSW Conference', state: 'Southern NSW', active: true, contactEmail: 'acs@adventist.org.au' },
  { code: 'nnsw', name: 'North NSW Conference', state: 'Northern NSW', active: true, contactEmail: 'acs@adventist.org.au' },
  { code: 'gsc', name: 'Greater Sydney Conference', state: 'Greater Sydney', active: false, contactEmail: 'acs@adventist.org.au' },
  { code: 'vic', name: 'Victorian Conference', state: 'Victoria', active: false, contactEmail: 'acs@adventist.org.au' },
  { code: 'sa', name: 'South Australian Conference', state: 'SA & NT', active: false, contactEmail: 'acs@adventist.org.au' },
  { code: 'wa', name: 'Western Australian Conference', state: 'Western Australia', active: false, contactEmail: 'acs@adventist.org.au' },
  { code: 'tas', name: 'Tasmanian Conference', state: 'Tasmania', active: false, contactEmail: 'acs@adventist.org.au' },
  { code: 'nq', name: 'North Queensland Conference', state: 'North Queensland', active: false, contactEmail: 'acs@adventist.org.au' },
  { code: 'sq', name: 'South Queensland Conference', state: 'South Queensland', active: false, contactEmail: 'acs@adventist.org.au' },
];
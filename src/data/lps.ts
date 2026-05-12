import type { FilterGroupId } from './filters';
import type { CoverageRegionId } from './regions';

export interface LP {
  id: string;
  name: string;
  contact: string;
  role: string;
  city: string;
  state?: string;       // US/CA state/province
  country: string;      // ISO alpha-2
  region: CoverageRegionId;
  subRegion: string;    // SubRegion.id
  aumUsd: number;       // in millions
  warmIntros: number;
  email: string;
  phone: string;
  addressLine: string;
  lastContactMonthsAgo: number | null;
  tags: Partial<Record<FilterGroupId, string[]>>;
}

const FIRST = ['Alex', 'Priya', 'Marcus', 'Sophie', 'Daniel', 'Yuki', 'Olivia', 'Kenji', 'Amelia', 'Hiro', 'Lina', 'Tom', 'Sara', 'Diego', 'Noor', 'Wei', 'Anika', 'Lars', 'Mei', 'James', 'Ines', 'Rajiv', 'Clara', 'Jonas'];
const LAST = ['Chen', 'Patel', 'Müller', 'Hartman', 'Okafor', 'Tanaka', 'Singh', 'Nakamura', 'Brown', 'Yamamoto', 'Garcia', 'Hughes', 'Cohen', 'Romero', 'Hassan', 'Wang', 'Sharma', 'Andersen', 'Lin', 'Wilson', 'Costa', 'Iyer', 'Schultz', 'Berg'];

const ROLES = ['CIO', 'Head of Alternatives', 'Portfolio Manager', 'Investment Director', 'Senior Analyst', 'Analyst'];
const COMPANY_TYPES = ['Pension Fund', 'Endowment', 'Foundation', 'Family Office', 'Insurance', 'Sovereign Wealth Fund', 'Fund of Funds', 'Consultant', 'OCIO / RIA'];
const STRATEGIES = ['Buyout', 'Growth Equity', 'Venture', 'Real Estate', 'Private Credit', 'Infrastructure', 'Distressed', 'Secondaries', 'Hedge Funds'];
const GEO_INTERESTS = ['Global', 'North America', 'Europe', 'Asia', 'Emerging Markets'];
const AUM_BUCKETS = ['< $500M', '$500M – $1B', '$1B – $5B', '$5B – $25B', '$25B+'];
const TICKET_BUCKETS = ['< $5M', '$5M – $25M', '$25M – $100M', '$100M+'];
const PACING = ['Underweight Alts', 'On Track', 'Overweight Alts'];
const ALTS_ALLOC = ['< 10%', '10 – 25%', '25 – 50%', '50%+'];
const DIRECT = ['Yes', 'Selective', 'No'];
const MGR_PREF = ['First-time funds', 'Established managers', 'Spinouts'];
const MEETING = ['In-person', 'Virtual', 'Conferences', 'Roadshows'];

interface CityDef {
  city: string;
  country: string;
  state?: string;
  region: CoverageRegionId;
  subRegion: string;
}

const CITIES: CityDef[] = [
  // ───────── United States ─────────
  // Tri-State
  { city: 'New York',       state: 'NY', country: 'US', region: 'na', subRegion: 'us-tristate' },
  { city: 'Stamford',       state: 'CT', country: 'US', region: 'na', subRegion: 'us-tristate' },
  { city: 'Princeton',      state: 'NJ', country: 'US', region: 'na', subRegion: 'us-tristate' },
  // Northeast
  { city: 'Boston',         state: 'MA', country: 'US', region: 'na', subRegion: 'us-northeast' },
  { city: 'Philadelphia',   state: 'PA', country: 'US', region: 'na', subRegion: 'us-northeast' },
  { city: 'Providence',     state: 'RI', country: 'US', region: 'na', subRegion: 'us-northeast' },
  // Southeast
  { city: 'Atlanta',        state: 'GA', country: 'US', region: 'na', subRegion: 'us-southeast' },
  { city: 'Miami',          state: 'FL', country: 'US', region: 'na', subRegion: 'us-southeast' },
  { city: 'Charlotte',      state: 'NC', country: 'US', region: 'na', subRegion: 'us-southeast' },
  // Midwest
  { city: 'Chicago',        state: 'IL', country: 'US', region: 'na', subRegion: 'us-midwest' },
  { city: 'Minneapolis',    state: 'MN', country: 'US', region: 'na', subRegion: 'us-midwest' },
  { city: 'Detroit',        state: 'MI', country: 'US', region: 'na', subRegion: 'us-midwest' },
  // Southwest
  { city: 'Dallas',         state: 'TX', country: 'US', region: 'na', subRegion: 'us-southwest' },
  { city: 'Houston',        state: 'TX', country: 'US', region: 'na', subRegion: 'us-southwest' },
  { city: 'Phoenix',        state: 'AZ', country: 'US', region: 'na', subRegion: 'us-southwest' },
  // West Coast
  { city: 'San Francisco',  state: 'CA', country: 'US', region: 'na', subRegion: 'us-west-coast' },
  { city: 'Los Angeles',    state: 'CA', country: 'US', region: 'na', subRegion: 'us-west-coast' },
  { city: 'Seattle',        state: 'WA', country: 'US', region: 'na', subRegion: 'us-west-coast' },
  // Mountain West
  { city: 'Denver',         state: 'CO', country: 'US', region: 'na', subRegion: 'us-mountain-west' },
  { city: 'Salt Lake City', state: 'UT', country: 'US', region: 'na', subRegion: 'us-mountain-west' },
  // Alaska / Hawaii
  { city: 'Anchorage',      state: 'AK', country: 'US', region: 'na', subRegion: 'us-alaska' },
  { city: 'Honolulu',       state: 'HI', country: 'US', region: 'na', subRegion: 'us-hawaii' },

  // ───────── Canada ─────────
  { city: 'Toronto',   state: 'ON', country: 'CA', region: 'na', subRegion: 'ca-east' },
  { city: 'Montreal',  state: 'QC', country: 'CA', region: 'na', subRegion: 'ca-east' },
  { city: 'Vancouver', state: 'BC', country: 'CA', region: 'na', subRegion: 'ca-west' },
  { city: 'Calgary',   state: 'AB', country: 'CA', region: 'na', subRegion: 'ca-west' },

  // ───────── Latin America ─────────
  // South America
  { city: 'São Paulo',      country: 'BR', region: 'latam', subRegion: 'latam-south' },
  { city: 'Rio de Janeiro', country: 'BR', region: 'latam', subRegion: 'latam-south' },
  { city: 'Buenos Aires',   country: 'AR', region: 'latam', subRegion: 'latam-south' },
  { city: 'Santiago',       country: 'CL', region: 'latam', subRegion: 'latam-south' },
  { city: 'Bogotá',         country: 'CO', region: 'latam', subRegion: 'latam-south' },
  { city: 'Lima',           country: 'PE', region: 'latam', subRegion: 'latam-south' },
  // Central America
  { city: 'Mexico City',    country: 'MX', region: 'latam', subRegion: 'latam-central' },
  { city: 'Monterrey',      country: 'MX', region: 'latam', subRegion: 'latam-central' },
  { city: 'Panama City',    country: 'PA', region: 'latam', subRegion: 'latam-central' },
  { city: 'San José',       country: 'CR', region: 'latam', subRegion: 'latam-central' },
  // Caribbean
  { city: 'San Juan',       country: 'PR', region: 'latam', subRegion: 'latam-caribbean' },
  { city: 'Nassau',         country: 'BS', region: 'latam', subRegion: 'latam-caribbean' },
  { city: 'Bridgetown',     country: 'BB', region: 'latam', subRegion: 'latam-caribbean' },

  // ───────── EMEA — Europe ─────────
  { city: 'London',    country: 'GB', region: 'emea', subRegion: 'emea-europe' },
  { city: 'Edinburgh', country: 'GB', region: 'emea', subRegion: 'emea-europe' },
  { city: 'Dublin',    country: 'IE', region: 'emea', subRegion: 'emea-europe' },
  { city: 'Frankfurt', country: 'DE', region: 'emea', subRegion: 'emea-europe' },
  { city: 'Zurich',    country: 'CH', region: 'emea', subRegion: 'emea-europe' },
  { city: 'Vienna',    country: 'AT', region: 'emea', subRegion: 'emea-europe' },
  { city: 'Paris',     country: 'FR', region: 'emea', subRegion: 'emea-europe' },
  { city: 'Amsterdam', country: 'NL', region: 'emea', subRegion: 'emea-europe' },
  { city: 'Brussels',  country: 'BE', region: 'emea', subRegion: 'emea-europe' },
  { city: 'Milan',     country: 'IT', region: 'emea', subRegion: 'emea-europe' },
  { city: 'Madrid',    country: 'ES', region: 'emea', subRegion: 'emea-europe' },
  { city: 'Lisbon',    country: 'PT', region: 'emea', subRegion: 'emea-europe' },
  { city: 'Stockholm', country: 'SE', region: 'emea', subRegion: 'emea-europe' },
  { city: 'Copenhagen',country: 'DK', region: 'emea', subRegion: 'emea-europe' },
  { city: 'Helsinki',  country: 'FI', region: 'emea', subRegion: 'emea-europe' },
  { city: 'Oslo',      country: 'NO', region: 'emea', subRegion: 'emea-europe' },
  { city: 'Warsaw',    country: 'PL', region: 'emea', subRegion: 'emea-europe' },

  // ───────── EMEA — Middle East & North Africa ─────────
  { city: 'Abu Dhabi', country: 'AE', region: 'emea', subRegion: 'emea-mena' },
  { city: 'Dubai',     country: 'AE', region: 'emea', subRegion: 'emea-mena' },
  { city: 'Riyadh',    country: 'SA', region: 'emea', subRegion: 'emea-mena' },
  { city: 'Doha',      country: 'QA', region: 'emea', subRegion: 'emea-mena' },
  { city: 'Tel Aviv',  country: 'IL', region: 'emea', subRegion: 'emea-mena' },
  { city: 'Istanbul',  country: 'TR', region: 'emea', subRegion: 'emea-mena' },
  { city: 'Cairo',     country: 'EG', region: 'emea', subRegion: 'emea-mena' },
  { city: 'Casablanca',country: 'MA', region: 'emea', subRegion: 'emea-mena' },

  // ───────── EMEA — Sub-Saharan Africa ─────────
  { city: 'Cape Town',    country: 'ZA', region: 'emea', subRegion: 'emea-ssa' },
  { city: 'Johannesburg', country: 'ZA', region: 'emea', subRegion: 'emea-ssa' },
  { city: 'Lagos',        country: 'NG', region: 'emea', subRegion: 'emea-ssa' },
  { city: 'Nairobi',      country: 'KE', region: 'emea', subRegion: 'emea-ssa' },

  // ───────── APAC — East Asia ─────────
  { city: 'Hong Kong', country: 'HK', region: 'apac', subRegion: 'apac-east' },
  { city: 'Beijing',   country: 'CN', region: 'apac', subRegion: 'apac-east' },
  { city: 'Shanghai',  country: 'CN', region: 'apac', subRegion: 'apac-east' },
  { city: 'Tokyo',     country: 'JP', region: 'apac', subRegion: 'apac-east' },
  { city: 'Seoul',     country: 'KR', region: 'apac', subRegion: 'apac-east' },
  { city: 'Taipei',    country: 'TW', region: 'apac', subRegion: 'apac-east' },

  // ───────── APAC — South & SE Asia ─────────
  { city: 'Singapore', country: 'SG', region: 'apac', subRegion: 'apac-south-se' },
  { city: 'Bangkok',   country: 'TH', region: 'apac', subRegion: 'apac-south-se' },
  { city: 'Jakarta',   country: 'ID', region: 'apac', subRegion: 'apac-south-se' },
  { city: 'Mumbai',    country: 'IN', region: 'apac', subRegion: 'apac-south-se' },
  { city: 'Bengaluru', country: 'IN', region: 'apac', subRegion: 'apac-south-se' },
  { city: 'Kuala Lumpur', country: 'MY', region: 'apac', subRegion: 'apac-south-se' },

  // ───────── APAC — Australia & Oceania ─────────
  { city: 'Sydney',    country: 'AU', region: 'apac', subRegion: 'apac-oceania' },
  { city: 'Melbourne', country: 'AU', region: 'apac', subRegion: 'apac-oceania' },
  { city: 'Auckland',  country: 'NZ', region: 'apac', subRegion: 'apac-oceania' },

  // ───────── APAC — Central Asia ─────────
  { city: 'Almaty',   country: 'KZ', region: 'apac', subRegion: 'apac-central-asia' },
  { city: 'Tashkent', country: 'UZ', region: 'apac', subRegion: 'apac-central-asia' },
];

const STREETS = ['Market Street', 'Park Avenue', 'Madison Avenue', 'Peachtree Street', 'Gresham Street', 'Main Street', 'Broadway', 'King Street', 'Queen Street', 'Bishopsgate', 'Royal Avenue'];
const EMAIL_DOMAINS = ['nylim.com', 'tiaa.org', 'metlife.com', 'calpers.ca.gov', 'gic.com.sg', 'adia.ae', 'gepfund.com', 'cdpq.com', 'nbim.no', 'kic.kr'];
const PHONE_PREFIXES: Record<string, string> = { US: '+1 (212)', CA: '+1 (416)', GB: '+44 20', FR: '+33 1', DE: '+49 69', CH: '+41 44', IT: '+39 02', ES: '+34 91', PT: '+351 21', NL: '+31 20', BE: '+32 2', AT: '+43 1', SE: '+46 8', DK: '+45 33', FI: '+358 9', NO: '+47 22', PL: '+48 22', CZ: '+420 2', JP: '+81 3', KR: '+82 2', CN: '+86 10', HK: '+852', SG: '+65', AU: '+61 2', NZ: '+64 9', IN: '+91 22', AE: '+971 2', SA: '+966 11', IL: '+972 3', QA: '+974', TR: '+90 212', BR: '+55 11', AR: '+54 11', CL: '+56 2', CO: '+57 1', PE: '+51 1', ZA: '+27 21', NG: '+234 1', KE: '+254 20', EG: '+20 2', MX: '+52 55', IE: '+353 1', ID: '+62 21', TH: '+66 2', TW: '+886 2', MY: '+60 3', PA: '+507', CR: '+506', PR: '+1 787', BS: '+1 242', BB: '+1 246', MA: '+212 5', KZ: '+7 727', UZ: '+998 71' };

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);

const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
const pickSome = <T,>(arr: T[], min = 1, max = 3): T[] => {
  const n = min + Math.floor(rand() * (max - min + 1));
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(rand() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
};

function makeLP(i: number): LP {
  const place = pick(CITIES);
  const aumBucket = pick(AUM_BUCKETS);
  const aumMid = { '< $500M': 250, '$500M – $1B': 750, '$1B – $5B': 3000, '$5B – $25B': 15000, '$25B+': 60000 }[aumBucket]!;
  const firstName = pick(FIRST);
  const lastName = pick(LAST);
  const slug = lastName.toLowerCase().replace(/[^a-z]/g, '');
  const phonePrefix = PHONE_PREFIXES[place.country] ?? '+1 (212)';
  return {
    id: `lp-${i}`,
    name: `${place.city} ${pick(['Capital', 'Partners', 'Investments', 'Asset Mgmt', 'Endowment', 'Pension Plan', 'Family Office', 'Wealth'])}`,
    contact: `${firstName} ${lastName}`,
    role: pick(ROLES),
    city: place.city,
    state: place.state,
    country: place.country,
    region: place.region,
    subRegion: place.subRegion,
    aumUsd: Math.round(aumMid * (0.6 + rand() * 0.8)),
    warmIntros: Math.floor(rand() * 6),
    email: `${firstName[0].toLowerCase()}.${slug}@${pick(EMAIL_DOMAINS)}`,
    phone: `${phonePrefix} ${100 + Math.floor(rand() * 900)}-${1000 + Math.floor(rand() * 9000)}`,
    addressLine: `${100 + Math.floor(rand() * 9900)} ${pick(STREETS)}, ${place.city}`,
    lastContactMonthsAgo: rand() < 0.45 ? Math.floor(rand() * 24) + 1 : null,
    tags: {
      companyType: [pick(COMPANY_TYPES)],
      strategy: pickSome(STRATEGIES, 1, 4),
      geoInterest: pickSome(GEO_INTERESTS, 1, 3),
      role: [pick(ROLES)],
      aum: [aumBucket],
      ticket: [pick(TICKET_BUCKETS)],
      pacing: [pick(PACING)],
      altsAllocation: [pick(ALTS_ALLOC)],
      directDeals: [pick(DIRECT)],
      managerPreference: pickSome(MGR_PREF, 1, 2),
      meetingPreference: pickSome(MEETING, 1, 3),
    },
  };
}

export const LPS: LP[] = Array.from({ length: 360 }, (_, i) => makeLP(i));

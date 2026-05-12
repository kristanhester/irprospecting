export type FilterGroupId =
  | 'companyType'
  | 'strategy'
  | 'geoInterest'
  | 'role'
  | 'aum'
  | 'ticket'
  | 'pacing'
  | 'altsAllocation'
  | 'directDeals'
  | 'managerPreference'
  | 'meetingPreference';

export interface FilterGroup {
  id: FilterGroupId;
  label: string;
  options: string[];
}

export const FILTER_GROUPS: FilterGroup[] = [
  {
    id: 'companyType',
    label: 'LP Company Type',
    options: [
      'Pension Fund',
      'Endowment',
      'Foundation',
      'Family Office',
      'Insurance',
      'Sovereign Wealth Fund',
      'Fund of Funds',
      'Consultant',
      'OCIO / RIA',
    ],
  },
  {
    id: 'strategy',
    label: 'Strategy Interests',
    options: [
      'Buyout',
      'Growth Equity',
      'Venture',
      'Real Estate',
      'Private Credit',
      'Infrastructure',
      'Distressed',
      'Secondaries',
      'Hedge Funds',
    ],
  },
  {
    id: 'geoInterest',
    label: 'Geographic Interests',
    options: [
      'Global',
      'North America',
      'Europe',
      'Asia',
      'Emerging Markets',
    ],
  },
  {
    id: 'role',
    label: 'Job Title / Role',
    options: [
      'CIO',
      'Head of Alternatives',
      'Portfolio Manager',
      'Investment Director',
      'Senior Analyst',
      'Analyst',
    ],
  },
  {
    id: 'aum',
    label: 'Portfolio Size (AUM)',
    options: ['< $500M', '$500M – $1B', '$1B – $5B', '$5B – $25B', '$25B+'],
  },
  {
    id: 'ticket',
    label: 'Average Ticket Size',
    options: ['< $5M', '$5M – $25M', '$25M – $100M', '$100M+'],
  },
  {
    id: 'pacing',
    label: 'Asset Allocation & Pacing',
    options: ['Underweight Alts', 'On Track', 'Overweight Alts'],
  },
  {
    id: 'altsAllocation',
    label: 'Alternatives Allocation',
    options: ['< 10%', '10 – 25%', '25 – 50%', '50%+'],
  },
  {
    id: 'directDeals',
    label: 'Direct Deal Interest',
    options: ['Yes', 'Selective', 'No'],
  },
  {
    id: 'managerPreference',
    label: 'Manager Relationship Preference',
    options: ['First-time funds', 'Established managers', 'Spinouts'],
  },
  {
    id: 'meetingPreference',
    label: 'Meeting & Access Preference',
    options: ['In-person', 'Virtual', 'Conferences', 'Roadshows'],
  },
];

export type FilterState = Record<FilterGroupId, string[]>;

export const emptyFilters: FilterState = FILTER_GROUPS.reduce(
  (acc, g) => ({ ...acc, [g.id]: [] }),
  {} as FilterState
);

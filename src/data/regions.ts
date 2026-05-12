export type CoverageRegionId =
  | 'na'
  | 'latam'
  | 'emea'
  | 'apac'
  | 'global';

export interface CoverageRegion {
  id: CoverageRegionId;
  label: string;
  countries: string[]; // ISO alpha-2
  countryIds: string[]; // ISO 3166-1 numeric (for TopoJSON)
}

export const REGIONS: CoverageRegion[] = [
  {
    id: 'na',
    label: 'North America',
    countries: ['US', 'CA'],
    countryIds: ['840', '124'],
  },
  {
    id: 'latam',
    label: 'Latin America',
    countries: ['MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'UY', 'VE', 'EC', 'BO', 'PY', 'GT', 'CR', 'PA', 'SV', 'HN', 'NI', 'BZ', 'CU', 'DO', 'JM', 'HT', 'TT', 'BS', 'BB', 'PR'],
    countryIds: ['484','076','032','152','170','604','858','862','218','068','600','320','188','591','222','340','558','084','192','214','388','332','780','044','052','630'],
  },
  {
    id: 'emea',
    label: 'EMEA',
    countries: [
      // Europe
      'GB','IE','FR','DE','CH','IT','ES','PT','NL','BE','LU','SE','NO','DK','FI','AT','PL','CZ','GR','HU','RO',
      // MENA
      'AE','SA','IL','QA','KW','BH','OM','JO','TR','EG','MA','TN','DZ','LY',
      // Sub-Saharan Africa
      'ZA','NG','KE','GH','ET','UG','TZ','RW','CI','SN',
    ],
    countryIds: [
      '826','372','250','276','756','380','724','620','528','056','442','752','578','208','246','040','616','203','300','348','642',
      '784','682','376','634','414','048','512','400','792','818','504','788','012','434',
      '710','566','404','288','231','800','834','646','384','686',
    ],
  },
  {
    id: 'apac',
    label: 'APAC',
    countries: [
      // East Asia
      'CN','JP','KR','HK','TW','MO','MN',
      // South & SE Asia
      'IN','SG','MY','TH','ID','PH','VN','BD','PK','LK','NP','MM','KH','LA',
      // Australasia
      'AU','NZ','PG','FJ',
      // Central Asia
      'KZ','UZ','KG','TJ','TM','AF',
    ],
    countryIds: [
      '156','392','410','344','158','446','496',
      '356','702','458','764','360','608','704','050','586','144','524','104','116','418',
      '036','554','598','242',
      '398','860','417','762','795','004',
    ],
  },
  {
    id: 'global',
    label: 'Global',
    countries: [],
    countryIds: [],
  },
];

export const getRegion = (id: CoverageRegionId | null) =>
  id ? REGIONS.find((r) => r.id === id) ?? null : null;

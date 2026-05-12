import type { CoverageRegionId } from './regions';

export type Bbox = [number, number, number, number]; // [west, south, east, north]

export interface SubRegion {
  id: string;
  label: string;
  parent: CoverageRegionId;
  groupId: string;
  groupLabel: string;
  owner?: string;
  dot: string;
  countries?: string[];
  usStates?: string[];
  bbox: Bbox;
}

// Group display order for the dropdown
export const GROUP_ORDER = ['us', 'ca', 'latam', 'emea', 'apac'] as const;

export const SUB_REGIONS: SubRegion[] = [
  // ───────────────────────── UNITED STATES (parent: na) ─────────────────────────
  { id: 'us-tristate',      label: 'Tri-State (NY/NJ/CT)', parent: 'na', groupId: 'us', groupLabel: 'United States', owner: 'OC-JR', dot: 'bg-blue-500',   usStates: ['NY','NJ','CT'], bbox: [-75.5, 39.5, -71, 42.2] },
  { id: 'us-northeast',     label: 'Northeast US',         parent: 'na', groupId: 'us', groupLabel: 'United States', owner: 'SL',    dot: 'bg-slate-400',  usStates: ['MA','ME','NH','VT','RI','PA'], bbox: [-81, 38.5, -66, 47.5] },
  { id: 'us-southeast',     label: 'Southeast US',         parent: 'na', groupId: 'us', groupLabel: 'United States', owner: 'SL',    dot: 'bg-violet-500', usStates: ['FL','GA','NC','SC','VA','AL','MS','LA','TN','KY','WV','AR'], bbox: [-95, 24, -75, 39] },
  { id: 'us-midwest',       label: 'Midwest US',           parent: 'na', groupId: 'us', groupLabel: 'United States', owner: 'OC',    dot: 'bg-amber-500',  usStates: ['IL','IN','IA','KS','MI','MN','MO','NE','ND','OH','SD','WI'], bbox: [-104, 36, -80, 49.5] },
  { id: 'us-southwest',     label: 'Southwest US',         parent: 'na', groupId: 'us', groupLabel: 'United States', owner: 'BM',    dot: 'bg-rose-500',   usStates: ['TX','OK','NM','AZ'], bbox: [-115, 26, -94, 37.5] },
  { id: 'us-west-coast',    label: 'West Coast US',        parent: 'na', groupId: 'us', groupLabel: 'United States', owner: 'SL',    dot: 'bg-violet-400', usStates: ['CA','OR','WA'], bbox: [-125, 32, -114, 49.5] },
  { id: 'us-mountain-west', label: 'Mountain West US',     parent: 'na', groupId: 'us', groupLabel: 'United States',                  dot: 'bg-slate-400', usStates: ['CO','UT','NV','ID','MT','WY'], bbox: [-120, 31, -102, 49] },
  { id: 'us-alaska',        label: 'Alaska',               parent: 'na', groupId: 'us', groupLabel: 'United States',                  dot: 'bg-slate-400', usStates: ['AK'], bbox: [-170, 51, -130, 72] },
  { id: 'us-hawaii',        label: 'Hawaii',               parent: 'na', groupId: 'us', groupLabel: 'United States',                  dot: 'bg-rose-400',  usStates: ['HI'], bbox: [-161, 18, -154, 23] },

  // ───────────────────────── CANADA (parent: na) ─────────────────────────
  { id: 'ca-east', label: 'Eastern Canada', parent: 'na', groupId: 'ca', groupLabel: 'Canada', owner: 'SK', dot: 'bg-red-500', countries: ['CA'], bbox: [-85, 41, -52, 62] },
  { id: 'ca-west', label: 'Western Canada', parent: 'na', groupId: 'ca', groupLabel: 'Canada', owner: 'SK', dot: 'bg-red-400', countries: ['CA'], bbox: [-141, 48, -95, 70] },

  // ───────────────────────── LATIN AMERICA (parent: latam) ─────────────────────────
  { id: 'latam-south',     label: 'South America',   parent: 'latam', groupId: 'latam', groupLabel: 'Latin America', owner: 'LP', dot: 'bg-violet-500', countries: ['BR','AR','CL','CO','PE','UY','EC','BO','VE','PY'], bbox: [-82, -56, -34, 13] },
  { id: 'latam-central',   label: 'Central America', parent: 'latam', groupId: 'latam', groupLabel: 'Latin America', owner: 'LP', dot: 'bg-fuchsia-500', countries: ['MX','GT','CR','PA','SV','HN','NI','BZ'], bbox: [-118, 5, -77, 33] },
  { id: 'latam-caribbean', label: 'Caribbean',       parent: 'latam', groupId: 'latam', groupLabel: 'Latin America', owner: 'LP', dot: 'bg-rose-400',    countries: ['CU','DO','JM','HT','TT','BS','BB','PR'], bbox: [-86, 10, -59, 27] },

  // ───────────────────────── EMEA (parent: emea) ─────────────────────────
  { id: 'emea-europe', label: 'Europe',                     parent: 'emea', groupId: 'emea', groupLabel: 'EMEA', owner: 'AP-RM', dot: 'bg-emerald-500', countries: ['GB','IE','FR','DE','CH','IT','ES','PT','NL','BE','LU','SE','NO','DK','FI','AT','PL','CZ','GR','HU','RO'], bbox: [-11, 35, 32, 71] },
  { id: 'emea-mena',   label: 'Middle East & North Africa', parent: 'emea', groupId: 'emea', groupLabel: 'EMEA', owner: 'AP-RM', dot: 'bg-amber-500',   countries: ['AE','SA','IL','QA','KW','BH','OM','JO','TR','EG','MA','TN','DZ','LY'], bbox: [-18, 12, 60, 38] },
  { id: 'emea-ssa',    label: 'Sub-Saharan Africa',         parent: 'emea', groupId: 'emea', groupLabel: 'EMEA', owner: 'AP-RM', dot: 'bg-teal-500',    countries: ['ZA','NG','KE','GH','ET','UG','TZ','RW','CI','SN'], bbox: [-18, -35, 52, 18] },

  // ───────────────────────── APAC (parent: apac) ─────────────────────────
  { id: 'apac-east',         label: 'East Asia',           parent: 'apac', groupId: 'apac', groupLabel: 'APAC', owner: 'CC', dot: 'bg-amber-500',   countries: ['CN','JP','KR','HK','TW','MO','MN'], bbox: [100, 18, 146, 54] },
  { id: 'apac-south-se',     label: 'South & SE Asia',     parent: 'apac', groupId: 'apac', groupLabel: 'APAC', owner: 'CC', dot: 'bg-orange-500',  countries: ['IN','SG','MY','TH','ID','PH','VN','BD','PK','LK','NP','MM','KH','LA'], bbox: [60, -11, 142, 38] },
  { id: 'apac-oceania',      label: 'Australia & Oceania', parent: 'apac', groupId: 'apac', groupLabel: 'APAC', owner: 'CC', dot: 'bg-orange-400',  countries: ['AU','NZ','PG','FJ'], bbox: [110, -50, 180, -8] },
  { id: 'apac-central-asia', label: 'Central Asia',        parent: 'apac', groupId: 'apac', groupLabel: 'APAC',              dot: 'bg-sky-500',     countries: ['KZ','UZ','KG','TJ','TM','AF'], bbox: [45, 35, 90, 56] },
];

export const getSubRegion = (id: string | null): SubRegion | null =>
  id ? SUB_REGIONS.find((s) => s.id === id) ?? null : null;

// Group sub-regions by groupId for the dropdown UI
export function groupedSubRegions(parent?: CoverageRegionId | null) {
  const filtered = parent && parent !== 'global'
    ? SUB_REGIONS.filter((s) => s.parent === parent)
    : SUB_REGIONS;
  const groups = new Map<string, { groupId: string; groupLabel: string; parent: CoverageRegionId; items: SubRegion[] }>();
  for (const s of filtered) {
    if (!groups.has(s.groupId)) {
      groups.set(s.groupId, { groupId: s.groupId, groupLabel: s.groupLabel, parent: s.parent, items: [] });
    }
    groups.get(s.groupId)!.items.push(s);
  }
  // Preserve GROUP_ORDER
  return Array.from(groups.values()).sort(
    (a, b) => GROUP_ORDER.indexOf(a.groupId as any) - GROUP_ORDER.indexOf(b.groupId as any)
  );
}

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { LPS, type LP } from './data/lps';
import { emptyFilters, FILTER_GROUPS, type FilterGroupId, type FilterState } from './data/filters';
import { getRegion, type CoverageRegionId } from './data/regions';

export type TabId = 'prospecting' | 'events' | 'roadshows' | 'coverage';
export type ProspectingView = 'map' | 'cards';

export interface SavedSearch {
  id: string;
  name: string;
  createdAt: string;
  region: CoverageRegionId | null;
  subRegion: string | null;
  countries: string[];
  filters: FilterState;
}

interface AppStore {
  // Top nav
  activeTab: TabId;
  setActiveTab: (t: TabId) => void;
  // Coverage
  region: CoverageRegionId | null;
  setRegion: (r: CoverageRegionId | null) => void;
  subRegion: string | null;
  setSubRegion: (id: string | null) => void;
  selectedCountries: string[];
  toggleCountry: (iso2: string) => void;
  clearCountries: () => void;
  // Filters
  filters: FilterState;
  toggleFilter: (group: FilterGroupId, option: string) => void;
  clearFilters: () => void;
  // Sidebar
  sidebarTab: 'filters' | 'integrations';
  setSidebarTab: (t: 'filters' | 'integrations') => void;
  // View
  view: ProspectingView;
  setView: (v: ProspectingView) => void;
  // Selection (in card view)
  selectedLPs: Set<string>;
  toggleLPSelection: (id: string) => void;
  clearLPSelection: () => void;
  // Saved searches
  savedSearches: SavedSearch[];
  saveSearch: (name: string) => void;
  applySavedSearch: (id: string) => void;
  deleteSavedSearch: (id: string) => void;
  // Integrations
  integrationStatus: Record<string, 'connected' | 'available'>;
  setIntegrationStatus: (id: string, s: 'connected' | 'available') => void;
  // Derived
  filteredLPs: LP[];
  totalActiveFilters: number;
  activeFilterChips: Array<{ group: FilterGroupId; option: string }>;
}

const Ctx = createContext<AppStore | null>(null);

const STORAGE_KEY = 'ir-prospecting:v1';

interface PersistedState {
  savedSearches?: SavedSearch[];
  integrationStatus?: Record<string, 'connected' | 'available'>;
}

function loadPersisted(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const persisted = loadPersisted();

  const [activeTab, setActiveTab] = useState<TabId>('prospecting');
  const [region, setRegionState] = useState<CoverageRegionId | null>(null);
  const [subRegion, setSubRegionState] = useState<string | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

  const setRegion = (r: CoverageRegionId | null) => {
    setRegionState(r);
    setSubRegionState(null);
  };

  const setSubRegion = (id: string | null) => {
    setSubRegionState(id);
  };
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [sidebarTab, setSidebarTab] = useState<'filters' | 'integrations'>('filters');
  const [view, setView] = useState<ProspectingView>('map');
  const [selectedLPs, setSelectedLPs] = useState<Set<string>>(new Set());
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(persisted.savedSearches ?? []);
  const [integrationStatus, setIntegrationStatusState] = useState<Record<string, 'connected' | 'available'>>(
    persisted.integrationStatus ?? { outlook: 'connected', salesforce: 'connected', iconnections: 'available', fintrx: 'available' }
  );

  // Persist saved searches + integration status
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ savedSearches, integrationStatus })
      );
    } catch {}
  }, [savedSearches, integrationStatus]);

  const toggleCountry = (iso2: string) => {
    setSelectedCountries((prev) =>
      prev.includes(iso2) ? prev.filter((c) => c !== iso2) : [...prev, iso2]
    );
  };

  const toggleFilter = (group: FilterGroupId, option: string) => {
    setFilters((prev) => {
      const current = prev[group];
      return {
        ...prev,
        [group]: current.includes(option) ? current.filter((o) => o !== option) : [...current, option],
      };
    });
  };

  const filteredLPs = useMemo(() => {
    const regionDef = getRegion(region);
    return LPS.filter((lp) => {
      if (subRegion) {
        if (lp.subRegion !== subRegion) return false;
      } else {
        if (region && region !== 'global' && lp.region !== region) return false;
        if (selectedCountries.length > 0) {
          if (!selectedCountries.includes(lp.country)) return false;
        } else if (regionDef && regionDef.countries.length > 0) {
          if (!regionDef.countries.includes(lp.country)) return false;
        }
      }
      for (const g of FILTER_GROUPS) {
        const wanted = filters[g.id];
        if (!wanted.length) continue;
        const lpVals = lp.tags[g.id] ?? [];
        const hasAny = wanted.some((w) => lpVals.includes(w));
        if (!hasAny) return false;
      }
      return true;
    });
  }, [region, subRegion, selectedCountries, filters]);

  const totalActiveFilters = Object.values(filters).reduce((sum, v) => sum + v.length, 0);

  const activeFilterChips = useMemo(() => {
    const out: Array<{ group: FilterGroupId; option: string }> = [];
    for (const g of FILTER_GROUPS) {
      for (const opt of filters[g.id]) out.push({ group: g.id, option: opt });
    }
    return out;
  }, [filters]);

  const saveSearch = (name: string) => {
    const id = `s-${Date.now()}`;
    setSavedSearches((s) => [
      ...s,
      {
        id,
        name,
        createdAt: new Date().toISOString(),
        region,
        subRegion,
        countries: selectedCountries,
        filters,
      },
    ]);
  };

  const applySavedSearch = (id: string) => {
    const s = savedSearches.find((x) => x.id === id);
    if (!s) return;
    setRegionState(s.region);
    setSubRegionState(s.subRegion);
    setSelectedCountries(s.countries);
    setFilters(s.filters);
  };

  const deleteSavedSearch = (id: string) => {
    setSavedSearches((arr) => arr.filter((s) => s.id !== id));
  };

  const setIntegrationStatus = (id: string, s: 'connected' | 'available') => {
    setIntegrationStatusState((prev) => ({ ...prev, [id]: s }));
  };

  return (
    <Ctx.Provider
      value={{
        activeTab,
        setActiveTab,
        region,
        setRegion,
        subRegion,
        setSubRegion,
        selectedCountries,
        toggleCountry,
        clearCountries: () => setSelectedCountries([]),
        filters,
        toggleFilter,
        clearFilters: () => setFilters(emptyFilters),
        sidebarTab,
        setSidebarTab,
        view,
        setView,
        selectedLPs,
        toggleLPSelection: (id) =>
          setSelectedLPs((s) => {
            const next = new Set(s);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
          }),
        clearLPSelection: () => setSelectedLPs(new Set()),
        savedSearches,
        saveSearch,
        applySavedSearch,
        deleteSavedSearch,
        integrationStatus,
        setIntegrationStatus,
        filteredLPs,
        totalActiveFilters,
        activeFilterChips,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used inside AppProvider');
  return v;
}

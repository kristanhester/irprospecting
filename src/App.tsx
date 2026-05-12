import { AppProvider, useApp } from './store';
import { TopNav } from './components/TopNav';
import { StepBar } from './components/StepBar';
import { WorldMap } from './components/WorldMap';
import { FilterSidebar } from './components/FilterSidebar';
import { StatsFooter } from './components/StatsFooter';
import { LPList } from './components/LPList';
import { LPGridView } from './components/LPGridView';
import { EventsView } from './components/EventsView';
import { RoadshowsView } from './components/RoadshowsView';
import { CoverageView } from './components/CoverageView';

function Shell() {
  const { activeTab, view } = useApp();

  return (
    <div className="h-full flex flex-col">
      <TopNav />
      {activeTab === 'prospecting' && view === 'map' && <StepBar />}
      <div className="flex-1 flex min-h-0">
        <div className="flex-1 relative flex flex-col min-w-0 min-h-0">
          {activeTab === 'prospecting' && view === 'map' && (
            <>
              <div className="flex-1 relative min-h-0 overflow-hidden">
                <WorldMap />
                <LPList />
              </div>
              <StatsFooter />
            </>
          )}
          {activeTab === 'prospecting' && view === 'cards' && <LPGridView />}
          {activeTab === 'events' && <EventsView />}
          {activeTab === 'roadshows' && <RoadshowsView />}
          {activeTab === 'coverage' && <CoverageView />}
        </div>
        {activeTab === 'prospecting' && <FilterSidebar />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}

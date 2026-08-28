import { useEffect, useMemo, useReducer } from 'react';
import type { Room, Scenario } from './types';
import { APP_COPY } from './constants/copy';
import { NEW_ROOM_DEFAULTS, SEED_SCENARIO } from './constants/seed';
import { MAX_ROOMS, MIN_ROOMS } from './constants/weights';
import { splitScenario } from './lib/split';
import { decodeScenario, syncUrl } from './lib/urlState';
import { RentInput } from './components/RentInput';
import { RoomCard } from './components/RoomCard';
import { BreakdownPanel } from './components/BreakdownPanel';
import { ShareBar } from './components/ShareBar';
import { FaqSection } from './components/FaqSection';
import { HouseDoodle } from './icons/HouseDoodle';
import { PlantDoodle } from './icons/PlantDoodle';

type Action =
  | { type: 'set-rent'; rent: string }
  | { type: 'update-room'; room: Room }
  | { type: 'add-room' }
  | { type: 'remove-room'; id: string };

function scenarioReducer(scenario: Scenario, action: Action): Scenario {
  switch (action.type) {
    case 'set-rent':
      return { ...scenario, rent: action.rent };
    case 'update-room':
      return {
        ...scenario,
        rooms: scenario.rooms.map((room) => (room.id === action.room.id ? action.room : room)),
      };
    case 'add-room': {
      if (scenario.rooms.length >= MAX_ROOMS) return scenario;
      const newRoom: Room = {
        id: crypto.randomUUID(),
        name: `Room ${scenario.rooms.length + 1}`,
        ...NEW_ROOM_DEFAULTS,
      };
      return { ...scenario, rooms: [...scenario.rooms, newRoom] };
    }
    case 'remove-room': {
      if (scenario.rooms.length <= MIN_ROOMS) return scenario;
      return { ...scenario, rooms: scenario.rooms.filter((room) => room.id !== action.id) };
    }
  }
}

function initialScenario(): Scenario {
  return decodeScenario(window.location.search) ?? SEED_SCENARIO;
}

export default function App() {
  const [scenario, dispatch] = useReducer(scenarioReducer, undefined, initialScenario);

  useEffect(() => {
    syncUrl(scenario);
  }, [scenario]);

  const result = useMemo(() => splitScenario(scenario), [scenario]);

  return (
    <div className="page">
      <header className="hero">
        <div className="hero__doodles" aria-hidden="true">
          <HouseDoodle className="hero__doodle hero__doodle--house" />
          <PlantDoodle className="hero__doodle hero__doodle--plant" />
        </div>
        <p className="hero__kicker">{APP_COPY.tagline}</p>
        <h1 className="hero__title">{APP_COPY.brand}</h1>
        <p className="hero__intro">{APP_COPY.intro}</p>
      </header>

      <main className="layout">
        <div className="layout__inputs">
          <RentInput
            rent={scenario.rent}
            onChange={(rent) => dispatch({ type: 'set-rent', rent })}
          />

          <section className="rooms" aria-labelledby="rooms-heading">
            <div className="rooms__header">
              <h2 id="rooms-heading">{APP_COPY.rooms.heading}</h2>
              <p>
                {scenario.rooms.length >= MAX_ROOMS
                  ? APP_COPY.rooms.maxRoomsNote
                  : APP_COPY.rooms.minRoomsNote}
              </p>
            </div>
            {scenario.rooms.map((room, index) => (
              <RoomCard
                key={room.id}
                room={room}
                index={index}
                canRemove={scenario.rooms.length > MIN_ROOMS}
                onChange={(updated) => dispatch({ type: 'update-room', room: updated })}
                onRemove={(id) => dispatch({ type: 'remove-room', id })}
              />
            ))}
            <button
              type="button"
              className="rooms__add"
              onClick={() => dispatch({ type: 'add-room' })}
              disabled={scenario.rooms.length >= MAX_ROOMS}
            >
              {APP_COPY.rooms.addRoom}
            </button>
          </section>
        </div>

        <div className="layout__receipt">
          <BreakdownPanel result={result} />
        </div>
      </main>

      <ShareBar />
      <FaqSection />

      <footer className="footer">
        <p>{APP_COPY.footer}</p>
      </footer>
    </div>
  );
}

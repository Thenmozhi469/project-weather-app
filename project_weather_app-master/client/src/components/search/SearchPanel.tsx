'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMapPin, FiStar, FiClock, FiX, FiLoader } from 'react-icons/fi';
import { searchLocations } from '@/lib/api';
import { useLocationStore, POPULAR_LOCATIONS } from '@/stores/locationStore';
import type { SearchSuggestion, SavedLocation } from '@/types/weather';

interface SearchPanelProps {
  onLocationSelect: (lat: number, lon: number, name: string) => void;
}

export default function SearchPanel({ onLocationSelect }: SearchPanelProps) {
  const [query, setQuery]           = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen]         = useState(false);
  const [isLoading, setIsLoading]   = useState(false);
  const inputRef                    = useRef<HTMLInputElement>(null);
  const dropdownRef                 = useRef<HTMLDivElement>(null);
  const debounceRef                 = useRef<ReturnType<typeof setTimeout>>(undefined);

  const { recentSearches, favorites, addRecentSearch, toggleFavorite, isFavorite } =
    useLocationStore();

  const doSearch = useCallback(async (q: string) => {
    if (q.length < 2) { setSuggestions([]); return; }
    setIsLoading(true);
    try {
      setSuggestions(await searchLocations(q));
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), 310);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, doSearch]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (loc: { lat: number; lon: number; name: string; region?: string; country?: string }) => {
    const saved: SavedLocation = {
      id: `${loc.lat}-${loc.lon}`,
      name: loc.name, region: loc.region ?? '', country: loc.country ?? '',
      lat: loc.lat, lon: loc.lon,
    };
    addRecentSearch(saved);
    onLocationSelect(loc.lat, loc.lon, loc.name);
    setQuery(''); setIsOpen(false);
    inputRef.current?.blur();
  };

  const showDropdown = isOpen && (query.length >= 2 || recentSearches.length > 0 || favorites.length > 0);

  return (
    <div className="relative w-full max-w-xl mx-auto" ref={dropdownRef}>

      {/* ── Input ── */}
      <div className="relative">
        {isLoading
          ? <FiLoader className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-base animate-spin" />
          : <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-base" />
        }
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search city, region or country…"
          className="glass-input pl-11 pr-10 text-sm"
          aria-label="Search for a location"
          autoComplete="off"
        />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={() => { setQuery(''); setSuggestions([]); inputRef.current?.focus(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Clear"
            >
              <FiX className="text-white/70 text-sm" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Dropdown ── */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full mt-2 w-full z-50 glass-card-elevated overflow-hidden"
            style={{ padding: 0 }}
          >
            <div className="max-h-[380px] overflow-y-auto custom-scrollbar">

              {/* ── Search results ── */}
              {query.length >= 2 && (
                <div className="p-2">
                  <div className="px-3 py-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    {isLoading ? 'Searching…' : `${suggestions.length} result${suggestions.length !== 1 ? 's' : ''}`}
                  </div>
                  {suggestions.map((s, i) => (
                    <motion.button
                      key={s.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => handleSelect(s)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-left"
                    >
                      <FiMapPin className="text-white/38 flex-shrink-0 text-sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{s.name}</p>
                        <p className="text-white/45 text-xs truncate">{s.region}, {s.country}</p>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); toggleFavorite({ id: `${s.lat}-${s.lon}`, name: s.name, region: s.region, country: s.country, lat: s.lat, lon: s.lon }); }}
                        className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/15 transition-colors"
                        aria-label={isFavorite(s.lat, s.lon) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <FiStar className={`text-sm ${isFavorite(s.lat, s.lon) ? 'text-yellow-400 fill-yellow-400' : 'text-white/30'}`} />
                      </button>
                    </motion.button>
                  ))}
                  {!isLoading && suggestions.length === 0 && (
                    <p className="px-3 py-5 text-white/38 text-sm text-center">No results for "{query}"</p>
                  )}
                </div>
              )}

              {/* ── Recents ── */}
              {query.length < 2 && recentSearches.length > 0 && (
                <div className="p-2 border-t border-white/5">
                  <div className="px-3 py-2 text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                    <FiClock className="text-xs" /> Recent
                  </div>
                  {recentSearches.map(r => (
                    <button key={r.id} onClick={() => handleSelect(r)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-left">
                      <FiClock className="text-white/38 flex-shrink-0 text-sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{r.name}</p>
                        <p className="text-white/45 text-xs truncate">{r.region}, {r.country}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* ── Favorites ── */}
              {favorites.length > 0 && (
                <div className="p-2 border-t border-white/5">
                  <div className="px-3 py-2 text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                    <FiStar className="text-xs" /> Favorites
                  </div>
                  {favorites.map(f => (
                    <button key={f.id} onClick={() => handleSelect(f)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-left">
                      <FiStar className="text-yellow-400/80 flex-shrink-0 text-sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{f.name}</p>
                        <p className="text-white/45 text-xs truncate">{f.country}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* ── Popular ── */}
              {query.length < 2 && (
                <div className="p-3 border-t border-white/5">
                  <div className="px-1 pb-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    🌍 Popular Cities
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_LOCATIONS.map(p => (
                      <motion.button
                        key={p.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleSelect(p)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/8 hover:bg-white/16 text-white/65 hover:text-white transition-all"
                      >
                        {p.name}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

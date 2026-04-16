import { useState, useEffect } from 'react';

/** Returns current viewport width and breakpoint booleans */
export function useBreakpoint() {
  const [w, setW] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handle = () => setW(window.innerWidth);
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);
  return {
    w,
    isMobile:  w < 640,
    isTablet:  w >= 640 && w < 1024,
    isDesktop: w >= 1024,
  };
}

/** Simple countdown timer hook — returns formatted time string */
export function useCountdown(targetTime) {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    if (!targetTime) return;
    const tick = () => {
      const diff = new Date(targetTime) - new Date();
      if (diff <= 0) { setTimeLeft('Expired'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(h > 0 ? `${h}h ${m}m` : m > 0 ? `${m}m ${s}s` : `${s}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetTime]);
  return timeLeft;
}

/** Debounce hook for search inputs */
export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

/** Geolocation hook */
export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      (err) => { setError(err.message); setLoading(false); }
    );
  };

  return { location, error, loading, getLocation };
}

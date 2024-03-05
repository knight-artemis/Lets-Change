import { useEffect, useState } from 'react';

export default function useGeoLocation(): {
  pos: GeolocationCoordinates | undefined;
  err: string | undefined;
} {
  const [pos, setPos] = useState<GeolocationCoordinates | undefined>();
  const [err, setErr] = useState<string>();

  useEffect(() => {
    const geo = navigator.geolocation;
    if (!geo) {
      setErr('location data noe evaleble');
      return undefined;
    }
    const watcher = geo.watchPosition(
      (e) => setPos(e.coords),
      (e) => setErr(e.message),
    );
    return () => geo.clearWatch(watcher);
  }, [setPos, setErr]);
  return {
    pos,
    err,
  };
}

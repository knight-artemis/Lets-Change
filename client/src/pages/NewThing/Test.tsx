import { Placemark } from '@pbe/react-yandex-maps';
import React from 'react';
import useGeoLocation from '../../hooks/useGeoLocation';

export default function Test():JSX.Element {
	const location = useGeoLocation();
  return (
    <Placemark
      onClick={() => console.log('click')}
      defaultGeometry={[location.pos?.latitude, location.pos?.longitude]}
      properties={{
        balloonContentBody:
          'This is balloon loaded by the Yandex.Maps API module system',
      }}
    />
  );
}

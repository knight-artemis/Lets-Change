import React, { useState } from 'react';
import { Map, Placemark } from '@pbe/react-yandex-maps';
import styles from './NewThing.module.css';
import Button from '../../components/Controls/Button/Button';
import useGeoLocation from '../../hooks/useGeoLocation';

export default function NewThing(): JSX.Element {
  const location = useGeoLocation();
  // console.log(typeof location.pos?.latitude)

  const [pinCoords, setPinCoords] = useState([
    location.pos?.latitude,
    location.pos?.longitude,
  ]);
  // console.log(plm);
  const handleClick = (e): void => {
    console.log(e);
    const coords = e.get('coords');
    console.log('Координаты клика:', coords);
    setPinCoords(coords);
  };

  return (
    <div className={styles.main}>
      <h1>Добавить вещь</h1>
      <h5>Добавьте название</h5>
      <h5>Добавьте описание</h5>
      <h5>Выберите категорию</h5>
      <h5>Выберите длительность размещения</h5>
      <h5>Выберите фото</h5>
      <h5>Выберите локацию</h5>
      <div>
        <Map
          onClick={(e) => handleClick(e)}
          width='500px'
          height='300px'
          defaultState={{
            center: [location.pos?.latitude, location.pos?.longitude],
            zoom: 15,
            controls: ['zoomControl', 'fullscreenControl'],
          }}
        >
          <Placemark
            onClick={() => console.log('click')}
            defaultGeometry={[location.pos?.latitude, location.pos?.longitude]}
            properties={{
              balloonContentBody:
                'This is balloon loaded by the Yandex.Maps API module system',
            }}
          />
        </Map>
      </div>
      <Button>Загрузить</Button>
    </div>
  );
}

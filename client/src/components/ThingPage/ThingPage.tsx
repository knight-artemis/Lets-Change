import React from 'react';
import styles from './ThingPage.module.css';

export default function ThingPage(): JSX.Element {
  return (
    <div className={`${styles.post}`}>
      <h1>Штанi за 40 грiвен</h1>
      <div className={`${styles.mainContent}`}>
        <div className={`${styles.photoBlock}`}>
          <div className={`${styles.mainPhotoDiv}`}>
            <img
              className={`${styles.mainPhoto}`}
              src='https://moy-razmer.ru/storage/images/gallery/images/4xt7IiTu3hjf4pWE.jpg'
              alt=''
            />
          </div>
          <div className={`${styles.littlePhotosDiv}`}>
            <img
              className={`${styles.littlePhoto}`}
              src='https://moy-razmer.ru/storage/images/gallery/images/4xt7IiTu3hjf4pWE.jpg'
              alt=''
            />
            <img
              className={`${styles.littlePhoto}`}
              src='https://moy-razmer.ru/storage/images/gallery/images/4xt7IiTu3hjf4pWE.jpg'
              alt=''
            />
            <img
              className={`${styles.littlePhoto}`}
              src='https://moy-razmer.ru/storage/images/gallery/images/4xt7IiTu3hjf4pWE.jpg'
              alt=''
            />
          </div>
        </div>
        <div className={`${styles.addContent}`}>
          <div className={`${styles.description}`}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum nemo
            assumenda eaque quibusdam facere necessitatibus temporibus illo
            placeat, nesciunt laudantium in libero totam cumque quae? Incidunt
            vero fuga amet fugiat.
          </div>
          <div className={`${styles.buttonDiv}`}>
            <button type='button' className={`${styles.button}`}>
              Давай меняться
            </button>
          </div>
          <div className={`${styles.mapDiv}`}>Место для карты</div>
        </div>
      </div>
    </div>
  );
}

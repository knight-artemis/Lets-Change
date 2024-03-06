import React from 'react'
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  ImageWithZoom,
} from 'pure-react-carousel'
import 'pure-react-carousel/dist/react-carousel.es.css'
import styles from './ThingPage.module.css'

export default function ThingPage(): JSX.Element {
  return (
    <div className={`${styles.post}`}>
      <h1>Штанi за 40 грiвен</h1>
      <div className={`${styles.mainContent}`}>
        <div className={`${styles.photoBlock}`}>
          <CarouselProvider
            naturalSlideWidth={100}
            naturalSlideHeight={100}
            totalSlides={3}
            // hasMasterSpinner
            // isIntrinsicHeight
          >
            <Slider>
              <Slide index={0}>
                <ImageWithZoom
                  className={`${styles.photo}`}
                  src='https://moy-razmer.ru/storage/images/gallery/images/4xt7IiTu3hjf4pWE.jpg'
                  alt='Штанi'
                />
              </Slide>
              <Slide index={1}>
                <ImageWithZoom
                  className={`${styles.photo}`}
                  src='https://moy-razmer.ru/storage/images/gallery/images/4xt7IiTu3hjf4pWE.jpg'
                  alt='Штанi'
                />
              </Slide>
              <Slide index={2}>
                <ImageWithZoom
                  className={`${styles.photo}`}
                  src='https://moy-razmer.ru/storage/images/gallery/images/4xt7IiTu3hjf4pWE.jpg'
                  alt='Штанi'
                />
              </Slide>
            </Slider>
            <ButtonBack>Back</ButtonBack>
            <ButtonNext>Next</ButtonNext>
          </CarouselProvider>
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
  )
}

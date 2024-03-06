import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
  ImageWithZoom,
} from 'pure-react-carousel'
import 'pure-react-carousel/dist/react-carousel.es.css'
import axios from 'axios'
import styles from './ThingPage.module.css'
import type { ThingType } from '../../types'

export default function ThingPage(): JSX.Element {
  const initialThing = {
    id: 0,
    userId: 0,
    categoryId: 0,
    thingName: '',
    description: '',
    thingAddress: '',
    thingLat: 0,
    thingLon: 0,
    startDate: new Date(),
    endDate: new Date(),
    isApproved: false,
    inDeal: false,
    User: {
      firstName: '',
      middleName: '',
      lastName: '',
    },
    Category: {
      categoryTitle: '',
    },
    Photos: [
      {
        photoUrl: '',
      },
    ],
  }

  const [thing, setThing] = useState<ThingType>(initialThing)

  const params = useParams()

  useEffect(() => {
    axios
      .get<ThingType>(`${import.meta.env.VITE_URL}/v1/things/${params.id}`, {
        withCredentials: true,
      })
      .then((res) => setThing(res.data))
      .catch((err) => console.log(err))
  }, [])

  return (
    <div className={`${styles.post}`}>
      <h1>{thing.thingName}</h1>
      <div className={`${styles.mainContent}`}>
        <div className={`${styles.photoBlock}`}>
          <CarouselProvider
            naturalSlideWidth={100}
            naturalSlideHeight={100}
            totalSlides={thing.Photos.length}
          >
            <Slider>
              {thing.Photos.map((photo, index) => (
                <Slide index={index}>
                  <ImageWithZoom
                    className={`${styles.photo}`}
                    src={`http://localhost:3003/uploads/things/${photo.photoUrl}`}
                    alt='Штанi'
                  />
                </Slide>
              ))}
            </Slider>
            <ButtonBack>Back</ButtonBack>
            <ButtonNext>Next</ButtonNext>
          </CarouselProvider>
        </div>
        <div className={`${styles.addContent}`}>
          <div className={`${styles.description}`}>{thing.description}</div>
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

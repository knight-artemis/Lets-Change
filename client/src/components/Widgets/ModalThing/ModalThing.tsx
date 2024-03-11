import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  ButtonBack,
  ButtonNext,
  CarouselProvider,
  ImageWithZoom,
  Slide,
  Slider,
} from 'pure-react-carousel'
import type { ThingType } from '../../../types'
import style from './ModalThing.module.css'

export default function ModalThing({
  thingId,
}: {
  thingId: number | undefined
}): JSX.Element {
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
        id: 0,
        photoUrl: '',
      },
    ],
  }
  const [thingInfo, setThingInfo] = useState<ThingType>(initialThing)

  useEffect(() => {
    const fetchThingInfo = async (): Promise<void> => {
      try {
        const response = await axios.get<ThingType>(
          `${import.meta.env.VITE_API}/v1/things/${thingId}`,
          {
            withCredentials: true,
          },
        )
        setThingInfo(response.data)
      } catch (error) {
        console.log(error)
      }
    }
    void fetchThingInfo()
  }, [thingId])

  return (
    <div className={`${style.thingModal}`}>
      <span>{thingInfo.thingName}</span>
      <CarouselProvider
        naturalSlideWidth={20}
        naturalSlideHeight={20}
        totalSlides={thingInfo.Photos.length}
        className={`${style.carouselProvider}`}
      >
        <Slider>
          {thingInfo.Photos.map((photo, index) => (
            <Slide key={`img-${photo.id}`} index={index}>
              <ImageWithZoom
                className={`${style.photo}`}
                src={`${import.meta.env.VITE_THINGS}/${photo.photoUrl}`}
                alt='Штанi'
              />
            </Slide>
          ))}
        </Slider>
        <ButtonBack>Back</ButtonBack>
        <ButtonNext>Next</ButtonNext>
      </CarouselProvider>
      <span>{thingInfo.description}</span>
      <span>{thingInfo.thingAddress}</span>
    </div>
  )
}

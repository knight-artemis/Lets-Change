/* eslint-disable react-hooks/exhaustive-deps */
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
import { GeolocationControl, Map, Placemark } from '@pbe/react-yandex-maps'
import 'pure-react-carousel/dist/react-carousel.es.css'
import axios from 'axios'
import styles from './ThingPage.module.css'
import type { ThingType } from '../../types'
import Modal from '../../components/Widgets/Modal/Modal'
import { useAppSelector } from '../../redux/hooks'
import InitChange from '../../components/ChangeHandlers/InitChange/InitChange'

type ByMeDealsType = {
  id: number
  thingId: number
}

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
        id: 0,
        photoUrl: '',
      },
    ],
  }

  const [thing, setThing] = useState<ThingType>(initialThing)
  const [modalActive, setModalActive] = useState<boolean>(true)
  const [initiate, setInitiate] = useState<boolean>(false)
  const user = useAppSelector((store) => store.userSlice.user)

  const params = useParams()

  useEffect(() => {
    void (async () => {
      try {
        const thingRes = await axios.get<ThingType>(
          `${import.meta.env.VITE_API}/v1/things/${params.id}`,
          {
            withCredentials: true,
          },
        );
        const myDealsRes = await axios.get<ByMeDealsType[]>(
          `${import.meta.env.VITE_API}/v1/deals/initiate-by-me`,
          {
            withCredentials: true,
          },
        )
        console.log(thingRes.data, myDealsRes.data)
        setThing(thingRes.data)
        setInitiate(!!myDealsRes.data.find((el) => el.thingId === thingRes.data.id))
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  console.log(initiate)

  return (
    <>
      <div className={`${styles.post}`}>
        <h1>{thing.thingName}</h1>
        <h2>{`${thing.User.firstName} ${thing.User.lastName}`}</h2>
        <div className={`${styles.mainContent}`}>
          <div className={`${styles.photoBlock}`}>
            <CarouselProvider
              naturalSlideWidth={100}
              naturalSlideHeight={100}
              totalSlides={thing.Photos.length}
            >
              <Slider>
                {thing.Photos.map((photo, index) => (
                  <Slide key={`img-${photo.id}`} index={index}>
                    <ImageWithZoom
                      className={`${styles.photo}`}
                      src={`${import.meta.env.VITE_THINGS}/${photo.photoUrl}`}
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
              {user.id !== thing.userId && !initiate && (
                <button
                  type='button'
                  className={`${styles.button}`}
                  onClick={() => setModalActive((prev) => !prev)}
                >
                  Давай меняться
                </button>
              )}
            </div>
            <div className={`${styles.mapDiv}`}>
              {/* {location.length > 0 && ( */}
              <Map
                // onClick={(e) => handleClick(e.get('coords'))}
                width='600px'
                height='500px'
                defaultState={{
                  center: [thing.thingLat, thing.thingLon],
                  zoom: 15,
                  controls: ['zoomControl', 'fullscreenControl'],
                }}
                state={{
                  center: [thing.thingLat, thing.thingLon],
                  zoom: 15,
                  controls: ['zoomControl', 'fullscreenControl'],
                }}
              >
                <GeolocationControl options={{ float: 'left' }} />
                {/* {address.length > 0 && ( */}
                <Placemark
                  onClick={() => console.log('click')}
                  geometry={[thing.thingLat, thing.thingLon]}
                  properties={{
                    balloonContentBody:
                      'This is balloon loaded by the Yandex.Maps API module system',
                  }}
                />
                {/* )} */}
              </Map>
              {/* )} */}
            </div>
          </div>
        </div>
      </div>
      <Modal active={modalActive} setActive={setModalActive}>
        <InitChange thingId={thing.id} />
      </Modal>
    </>
  )
}

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
import style from './ThingPage.module.css'
import type { ThingType } from '../../types'
import Modal from '../../components/Widgets/Modal/Modal'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import InitChange from '../../components/ChangeHandlers/InitChange/InitChange'
import { fetchGetNot } from '../../redux/user/userThunkActions'
import ThingUpdateForm from '../../components/ChangeHandlers/ThingUpdateForm/ThingUpdateForm'
import SideBar from '../../components/PageSkeleton/SideBar/SideBar'
import WholePage from '../../components/PageSkeleton/WholePage/WholePage'
import MainContent from '../../components/PageSkeleton/MainContent/MainContent'
import Grid from '../../components/PageSkeleton/Grid/Grid'
import TopLine from '../../components/PageSkeleton/TopLine/TopLine'
import Button from '../../components/Shared/Button/Button'

type ByMeDealsType = {
  id: number
  thingId: number
  status: number
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
  const [modalActive1, setModalActive1] = useState<boolean>(true)
  const [modalActive2, setModalActive2] = useState<boolean>(true)
  const [initiate, setInitiate] = useState<boolean>(false)
  const user = useAppSelector((store) => store.userSlice.user)
  const dispatcher = useAppDispatch()

  const params = useParams()

  useEffect(() => {
    void (async () => {
      try {
        await dispatcher(fetchGetNot())
        const thingRes = await axios.get<ThingType>(
          `${import.meta.env.VITE_API}/v1/things/${params.id}`,
          {
            withCredentials: true,
          },
        )
        const myDealsRes = await axios.get<ByMeDealsType[]>(
          `${import.meta.env.VITE_API}/v1/deals/initiate-by-me`,
          {
            withCredentials: true,
          },
        )
        // console.log(thingRes.data, myDealsRes.data)
        setThing(thingRes.data)
        setInitiate(
          !!myDealsRes.data.find(
            (el) => el.thingId === thingRes.data.id && el.status !== 4,
          ),
        )
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  return (
    <WholePage>
      <SideBar>
        <Button link>{'<'} Назад</Button>

        <h1>{thing.thingName}</h1>
        {thing.issue && <h2 style={{ color: 'red' }}>{thing.issue}</h2>}
        {!thing.isApproved && !thing.issue?.length && (
          <h2 style={{ color: 'orange' }}>Вещь пока на модерации</h2>
        )}

        <div className={style.category}>{thing.Category.categoryTitle}</div>

        <div className={`${style.photoBlock}`}>
          <CarouselProvider
            naturalSlideWidth={100}
            naturalSlideHeight={100}
            totalSlides={thing.Photos.length}
          >
            <Slider>
              {thing.Photos.map((photo, index) => (
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
        </div>
      </SideBar>
      <MainContent centerHorizontal>
        
        <div className={style.timeLeft}>{thing.endDate.toLocaleString()}</div>

        <div className={style.ownerName}>
          {thing.User.lastName
            ? `${thing.User.firstName} ${thing.User.lastName}`
            : `${thing.User.firstName}`}
        </div>

        <div className={style.address}>{thing.description}</div>
        <div className={style.address}>{thing.thingAddress}</div>

        <div className={style.mapDiv}>
          {/* {location.length > 0 && ( */}
          <Map
            // onClick={(e) => handleClick(e.get('coords'))}
            width='100%'
            height='100%'
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

        <div className={`${style.buttonDiv}`}>
          {user.id !== thing.userId && !initiate && (
            <Button
              // className={`${style.button}`}
              onClick={() => setModalActive1((prev) => !prev)}
            >
              Давай меняться
            </Button>
          )}
          {user.id !== 0 && user.id === thing.userId ? (
            <Button
              onClick={() => setModalActive2((prev) => !prev)}
            >
              Изменить
            </Button>
          ) : (
            <> </>
          )}
        </div>
        <Modal active={modalActive1} setActive={setModalActive1}>
          <InitChange thingId={thing.id} />
        </Modal>
        <Modal active={modalActive2} setActive={setModalActive2}>
          <ThingUpdateForm thingId={thing.id} initialThing={initialThing} />
        </Modal>
      </MainContent>
      {/* <div className={`${style.post}`}>
        <div className={`${style.mainContent}`}>
          <div className={`${style.addContent}`}>
            <div className={`${style.description}`}>{thing.description}</div>
            
            
          </div>
        </div>
      </div> */}
    </WholePage>
  )
}

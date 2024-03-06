/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import {
  Clusterer,
  GeolocationControl,
  Map,
  Placemark,
} from '@pbe/react-yandex-maps'
import style from './Main.module.css'
import switchStyle from './ToogleSwitch.module.css'
import Button from '../../components/Controls/Button/Button'
import type { SimplifiedThingType } from '../../types'
import Test from '../../components/MyPlacemark/MyPlacemark'

const ThingsInitVal = {
  id: 0,
  thingName: '',
  categoryId: 0,
  thingAddress: '',
  thingLat: 0,
  thingLon: 0,
  endDate: new Date(),
  photoUrl: '',
}

type CategoryType = {
  id: number
  categoryTitle: string
}
const CategoryInitVal = { id: 0, categoryTitle: '' }

function getTimeLeft(endDate: Date): string {
  const msDelta = new Date(endDate).getTime() - new Date().getTime()
  if (msDelta <= 0) return 'время вышло'

  const msInHour = 1000 * 60 * 60
  const msInDay = msInHour * 24
  const msInWeek = msInDay * 7
  const msInMonth = msInDay * 30

  if (msDelta < msInDay) {
    // Если разница меньше дня
    const hoursDiff = Math.round(msDelta / msInHour)
    return `осталось ${hoursDiff} часов`
  }
  if (msDelta < msInWeek) {
    // Если разница меньше недели
    const daysDiff = Math.round(msDelta / msInDay)
    return `осталось ${daysDiff} дней`
  }
  if (msDelta < msInMonth) {
    // Если разница меньше месяца
    const weeksDiff = Math.round(msDelta / msInWeek)
    return `осталось ${weeksDiff} недель`
  }
  // Если разница больше месяца
  const monthsDiff = Math.round(msDelta / msInMonth)
  return `осталось ${monthsDiff} месяцев`
}

export default function Main(): JSX.Element {
  const [things, setThings] = useState<SimplifiedThingType[]>([ThingsInitVal])
  const [categories, setCategories] = useState<CategoryType[]>([
    CategoryInitVal,
  ])
  const [isChecked, setIsChecked] = useState(false)
  const [location, setLocation] = useState<number[]>([])

  const handleToggleChange = (): void => {
    setIsChecked(!isChecked)
  }

  const navigate = useNavigate()

  const setAllThings = (): void => {
    axios
      .get<SimplifiedThingType[]>(`${import.meta.env.VITE_API}/v1/things`, {
        withCredentials: true,
      })
      .then((res) => setThings(res.data))
      .catch((err) => console.log('Ошибка получения всех вещей', err))
  }

  useEffect(() => {
    // список объявлений по свежести
    setAllThings()

    // список категорий
    axios
      .get<CategoryType[]>(`${import.meta.env.VITE_API}/v1/things/categories`, {
        withCredentials: true,
      })
      .then((res) => setCategories(res.data))
      .catch((err) => console.log('Ошибка получения списка категории', err))

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          setLocation([55.74, 37.61])
          console.error('Error getting geolocation:', error)
        },
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }, [])

  const categoryHandler = (id: number): void => {
    // тут сортировательная функция, устанавливает шмотки кокретной категоории
    //! нодо аддитивность категорий
    axios
      .get<SimplifiedThingType[]>(
        `${import.meta.env.VITE_API}/v1/things/categories/${id}`,
        { withCredentials: true },
      )
      .then((res) => setThings(res.data))
      .catch((err) => console.log('Ошибка получения вещей в категории', err))
  }

  return (
    <div className={style.wrapper}>
      <div className={style.sidebar}>
        <Button key='start' link onClick={() => void setAllThings()}>
          <img
            className={style.icon}
            src='./assets/icons/shirt.svg'
            alt='svg'
          />{' '}
          все категроии
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            link
            onClick={() => void categoryHandler(cat.id)}
          >
            {/* <div className={style.category}> */}
            <img
              className={style.icon}
              src='./assets/icons/shirt.svg'
              alt='svg'
            />
            {cat.categoryTitle}
            {/* </div> */}
          </Button>
        ))}
      </div>
      <div className={style.content}>
        <label htmlFor='toggleSwitch' className={switchStyle.switch}>
          <input
            id='toggleSwitch'
            type='checkbox'
            checked={isChecked}
            onChange={handleToggleChange}
          />
          <span className={switchStyle.slider} />
        </label>
        {isChecked ? (
          <div style={{ width: '800px', height: '100%', borderRadius: '20px' }}>
            {location.length > 0 && (
              <Map
                onClick={(e) => handleClick(e.get('coords'))}
                width='800px'
                height='100%'
                defaultState={{
                  center: location,
                  zoom: 15,
                  controls: ['zoomControl', 'fullscreenControl'],
                }}
              >
                <GeolocationControl options={{ float: 'left' }} />
                <Clusterer
                  options={{
                    preset: 'islands#invertedVioletClusterIcons',
                    // groupByCoordinates: false,
                  }}
                >
                  {things.map((thing) => (
                    <Test
                      key={`${thing.id}`}
                      coord={[thing.thingLat, thing.thingLon]}
                      onClick={() => navigate(`/thing/${thing.id}`)}
                      img={`${import.meta.env.VITE_THINGS}/${thing.photoUrl}`}
                      iconCaption={thing.thingName}
                    />
                  ))}
                </Clusterer>
              </Map>
            )}
          </div>
        ) : (
          things.map((thing: SimplifiedThingType) => (
            <Button
              key={thing.id}
              link
              onClick={() => void navigate(`/thing/${thing.id}`)}
            >
              <div className={style.card}>
                <div className={style.timeLeft}>
                  {getTimeLeft(thing.endDate)}
                </div>
                <div className={style.photo}>
                  <img
                    src={`${import.meta.env.VITE_THINGS}/${thing.photoUrl}`}
                    alt='фотка-шмотка'
                  />
                </div>
                <div className={style.name}>
                  <center>{thing.thingName}</center>
                </div>
                <div
                  className={clsx(
                    Math.random() > 0.5 ? style.favorite : style.notFavorite,
                  )}
                />
              </div>
            </Button>
          ))
        )}
      </div>
    </div>
  )
}

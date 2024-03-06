import axios from 'axios'
import React, { useEffect, useState } from 'react'
import style from './Main.module.css'
import Button from '../../components/Controls/Button/Button'

type ThingsType = {
  id: number
  thingName: string
  categoryId: number
  thingAddress: string
  thingLat: number
  thingLon: number
  endDate: Date
  photoUrl: string | null
}
// TODO добавить типизацию  категорий и массива категорий

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
  const [things, setThings] = useState([])
  const [categories, setCategories] = useState([{ id: 0, categoryTitle: '' }])

  useEffect(() => {
    axios
      .get<ThingsType[]>(`${import.meta.env.VITE_URL}/v1/things`, {
        withCredentials: true,
      })
      .then((res) => setThings(res.data))
      .catch((err) => console.log(err))

    setCategories([
      { id: 1, categoryTitle: 'игрушки' },
      { id: 2, categoryTitle: 'хренюшки' },
      { id: 3, categoryTitle: 'пиздюшки' },
    ])
  }, [])

  return (
    <div className={style.wrapper}>
      <div className={style.sidebar}>
        {categories.map((cat) => (
          <Button key={cat.id} link>
            <div className={style.category}>{cat.categoryTitle}</div>
          </Button>
        ))}
      </div>
      <div className={style.content}>
        {things.map((thing: ThingsType) => (
          <Button key={thing.id} link>
            <div className={style.card}>
              <div className={style.timeLeft}>{getTimeLeft(thing.endDate)}</div>
              <div className={style.photo}>
                {/* <img src='http://localhost:3003/uploads/a.jpg' alt='фотка-шмотка'/> */}
                {/* Затычка */}
                <img
                  src='https://instrument.ru/img/dev/catalog_no_photo.png'
                  alt='фотка-шмотка'
                />
              </div>
              <div className={style.name}>
                <center>{thing.thingName}</center>
              </div>
              <div className={style.favorite}>хз</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}

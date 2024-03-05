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
          <Button  key={cat.id}  link>
            <div className={style.category}>
              {cat.categoryTitle}
            </div>
          </Button>
        ))}
      </div>
      <div className={style.content}>
        {things.map((thing:ThingsType) => (
          <Button key={thing.id}  link>
            <div className={style.card}>
              <div className={style.timeLeft}>{String(thing.endDate)}</div>
              <div className={style.photo}>
                {/* <img src='http://localhost:3003/uploads/a.jpg' alt='фотка-шмотка'/> */}
                <img src={thing.photoUrl || 'null'} alt='фотка-шмотка'/>
              </div>
              <div className={style.name}>{thing.thingName}</div>
              <div className={style.favorite}>хз</div>
            </div>{' '}
          </Button>
        ))}
      </div>
    </div>
  )
}

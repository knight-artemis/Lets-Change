import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import type { SimplifiedThingType } from '../../types'
import { useAppSelector } from '../../redux/hooks'
import Card from '../../components/Widgets/Card/Card'
import style from './MyThings.module.css'
import Button from '../../components/Controls/Button/Button'

const ThingInitVal = {
  id: 0,
  thingName: '',
  categoryId: 0,
  thingAddress: '',
  thingLat: 0,
  thingLon: 0,
  endDate: new Date(),
  photoUrl: '',
}

export default function MyThings(): JSX.Element {
  const user = useAppSelector((store) => store.userSlice.user)

  const [things, setThings] = useState<SimplifiedThingType[]>([ThingInitVal])

  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get<SimplifiedThingType[]>(
        `${import.meta.env.VITE_API}/v1/things/user/${user.id}`,
        { withCredentials: true },
      )
      .then((res) => setThings(res.data))
      .catch((err) => console.log('Ошибка получения всех СВОИХ вещей', err))
  }, [user.id])

  return (
    <div className={style.content}>
      {things.length !== 0 ? (
        things.map((thing: SimplifiedThingType) => <Card thing={thing} />)
      ) : (
        <div className={style.emptyPage}>
          <span>Вы ещё не добавили никаких вещей</span>
          <Button link onClick={() => void navigate(`/new-thing`)}>
            <div className={style.svgLink}>
              <img
                className={style.icon}
                src='assets/icons/add-thing.svg'
                alt='svg'
              />
              <div>Добавить свою вещь для обмена</div>
            </div>
          </Button>
          <Button link onClick={() => void navigate(`/`)}>
            <div className={style.svgLink}>
              <img
                className={style.icon}
                src='assets/icons/search-large.svg'
                alt='svg'
              />
              <div>Посмотреть вещи других пользователей</div>
            </div>
          </Button>
        </div>
      )}
    </div>
  )
}

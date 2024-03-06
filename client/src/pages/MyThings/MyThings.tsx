import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import type { SimplifiedThingType } from '../../types'
import { useAppSelector } from '../../redux/hooks'
import Card from '../../components/Widgets/Card/Card'
import style from './MyThings.module.css'

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
      {things.map((thing: SimplifiedThingType) => (
        <Card thing={thing} />
      ))}
    </div>
  )
}

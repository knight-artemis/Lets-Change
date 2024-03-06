import React, { useEffect, useState } from 'react'
import styles from './MyThings.module.css'
import { useNavigate } from 'react-router-dom'
import { SimplifiedThingType } from '../../types'
import axios from 'axios'
import { useAppSelector } from '../../redux/hooks'

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

  const user = useAppSelector(store => store.userSlice.user)

    const [oneThing, setOneThing] = useState<SimplifiedThingType[]>([ThingInitVal])

    const navigate = useNavigate()

    useEffect(() => {
      axios
        .get<SimplifiedThingType[]>(
          `${import.meta.env.VITE_API}/v1/things/user/${user.id}`, { withCredentials: true })
        .then((res) => setOneThing(res.data))
        .catch((err) => console.log('Ошибка получения всех вещей', err))
    }, [thing.id])


  return (
	<div className={styles.main}>MyThings</div>
  )
}

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import lodash from 'lodash'
import { useNavigate } from 'react-router-dom'
import type { ThingType } from '../../types'
import Card from '../Widgets/Card/Card'
import style from './OtherThings.module.css'
import CardSimple from '../Widgets/CardSimple/CardSimple'

export default function OtherThings({
  thing,
}: {
  thing: ThingType
}): JSX.Element {
  const [otherThings, setOtherThings] = useState<ThingType[]>([])

  const navigate = useNavigate()

  useEffect(() => {
    const fetchOtherThings = async (): Promise<void> => {
      try {
        const response = await axios.get<ThingType[]>(
          `${import.meta.env.VITE_API}/v1/things/user/${thing.userId}`,
          {
            withCredentials: true,
          },
        )
        setOtherThings(
          lodash
            .shuffle(
              response.data.filter((el) => el.id !== thing.id && !el.inDeal),
            )
            .slice(0, 3),
        )
      } catch (error) {
        console.error('Error fetching other things:', error)
      }
    }
    void fetchOtherThings()
  }, [thing])

  const navigateThing = async (id: number): Promise<void> => {
    navigate(`/thing/${id}`)
  }

  return (
    <div className={style.otherDiv}>
      {otherThings.length ? (
        <>
          <h3>Еше у этого пользователя</h3>
          <div className={style.thingDiv}>
            {otherThings.map((el) => (
              // <Card thing={el} small />
              <button
                type='button'
                onClick={() => navigateThing(el.id)}
                className={style.button}
              >
                <CardSimple thing={el} modal={false} />
              </button>
            ))}
          </div>
        </>
      ) : (
        <span>У данного пользователя только одно объявление</span>
      )}
    </div>
  )
}

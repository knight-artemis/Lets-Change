import React from 'react'
import type { SimplifiedThingType } from '../../../types'
import styles from './SmallCard.module.css'
import getRemainigTime from '../../../service/getRemainigTime'

type SmallCardProps = {
  thing: SimplifiedThingType
}

export default function SmallCard({ thing }: SmallCardProps): JSX.Element {
 
  return (
    <div className={styles.card}>
      <div className={styles.photo}>
        <img
          src={`${import.meta.env.VITE_THINGS}/${thing.photoUrl}`}
          alt={thing.thingName}
        />
      </div>
      <div className={styles.description}>
        <div>
          {thing.thingName.length < 20
            ? thing.thingName
            : `${thing.thingName.slice(0, 17)}...`}
        </div>
        <div>{getRemainigTime(thing.endDate)}</div>
      </div>
    </div>
  )
}

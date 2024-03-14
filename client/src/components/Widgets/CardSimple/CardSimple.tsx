import React, { useState } from 'react'
import clsx from 'clsx'
import style from './CardSimple.module.css'
import Modal from '../Modal/Modal'
import ModalThing from '../ModalThing/ModalThing'
import getRemainigTime from '../../../service/getRemainigTime'
import Chip from '../../Shared/Chip/Chip'

type CardSimpleProps = {
  thing?: {
    thingName?: string
    photoUrl: string
    endDate: Date
  },
  thingId?: number
  size?: number
  hoverable?: boolean
}

export default function CardSimple({
  thing,
  thingId,
  size = 200,
  hoverable,
}: CardSimpleProps): JSX.Element {
  const [modalActive, setModalActive] = useState<boolean>(true)

  return (
    <>
      <Modal active={modalActive} setActive={setModalActive}>
        <ModalThing thingId={thingId} />
      </Modal>
      <div
        onClick={() => void setModalActive((prev) => !prev)}
        onKeyDown={(event) => event}
        role='button'
        tabIndex={0}
        className={clsx(style.card, hoverable && style.hoverable)}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {thing && thing.endDate &&
        <Chip top={1} left={-0.5} leftSide>
          осталось {thing && getRemainigTime(thing.endDate)}
        </Chip>}
        <div className={clsx(style.center, style.photoWrapper)}>
          <img
            className={clsx(style.center, style.photoBg)}
            src={`${import.meta.env.VITE_THINGS}/${thing?.photoUrl}`}
            alt={thing?.thingName}
          />
          <img
            className={clsx(style.center, style.photo)}
            src={`${import.meta.env.VITE_THINGS}/${thing?.photoUrl}`}
            alt={thing?.thingName}
          />
        </div>

        <div className={style.name}>
          <center>
            {thing?.thingName && thing.thingName.length < 30
              ? thing.thingName
              : `${thing?.thingName && thing.thingName.slice(0, 27)}...`}
          </center>
        </div>
      </div>
    </>
  )
}

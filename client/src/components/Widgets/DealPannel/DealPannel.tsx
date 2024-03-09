import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import type { OneDealFromMe, OneDealToMe } from '../../../types'
import { useAppSelector } from '../../../redux/hooks'
import style from './DealPannel.module.css'
import Button from '../../Controls/Button/Button'

export default function DealPannel({
  deal,
}: {
  deal: OneDealToMe | OneDealFromMe
}): JSX.Element {
  const navigate = useNavigate()
  const user = useAppSelector((store) => store.userSlice.user)

  const [state, setState] = useState({
    status: '',
    isBtn: false,
    btnText: '',
    color: '',
  })

  useEffect(() => {

    switch (deal.status) {
      case 0:
        setState(
          user.id === deal.initiatorId
            ? {
                status: 'ожидает подтверждения',
                isBtn: true,
                btnText: 'отменить',
                color: 'danger',
              }
            : {
                status: 'ожидает подтверждения',
                isBtn: true,
                btnText: 'подробнее',
                color: 'neutral',
              },
        )
        break
      case 1:
        setState({
          status: 'согласен меняться',
          isBtn: true,
          btnText: 'обсудить',
          color: 'good',
        })
        break
      case 2:
        setState(
          user.id === deal.initiatorId && deal.acceptedByInitiator
            ? {
                status: 'сделка завершена',
                isBtn: false,
                btnText: '',
                color: '',
              }
            : {
                status: 'ожидает подтверждения обмена',
                isBtn: true,
                btnText: 'подтвердить',
                color: 'good',
              },
        )
        break
      case 3:
        setState({
          status: 'сделка завершена',
          isBtn: false,
          btnText: '',
          color: '',
        })
        break
      case 4: //  а у отказавшегося вообще убрать показ этой сделки
        setState({
          status: 'от сделки отказались',
          isBtn: false,
          btnText: '',
          color: '',
        })
        break
      default:
        setState({
          status: 'статус не ясен О_о',
          isBtn: false,
          btnText: '',
          color: '',
        })
    }
  }, [deal.acceptedByInitiator, deal.initiatorId, deal.status, user.id])



  const btnHandler = () => {}



  return (
    // <Button
    //   key={deal.id}
    //   link
    //   onClick={() => void navigate(`/thing/${deal.thingId}`)}
    // >
    <div className={clsx(style.listItem, (deal.status === 3 ||  deal.status === 4) && style.disabled)}>
      <div className={style.photo}>
        <img
          src={`${import.meta.env.VITE_THINGS}/${deal.Thing.photoUrl}`}
          alt='фотка-шмотка'
        />
      </div>

      {/* <div className={style.body}> */}
      <div className={style.textCol}>
        <div className={style.name}>{deal.Thing.thingName}</div>
        <div className={style.timeLeft}>
          осталось <br /> время не завезли
        </div>
      </div>

      <div className={style.textCol}>
        <div className={style.description}>описание не завезли</div>

        {deal.initiatorId === user.id ? (
          <>
            <div className={style.description}>сделка предложена для:</div>
            <div className={style.name}>{deal.recieverName}</div>
          </>
        ) : (
          <>
            <div className={style.description}>сделку предложил:</div>
            <div className={style.name}>
              {(deal as OneDealToMe).initiatorName}
            </div>
          </>
        )}
      </div>
      <div className={style.textCol}>
        <div className={style.status}>
          Статус - {deal.status}: {state.status}
        </div>
        {state.isBtn && (
          <Button
            color={state.color}
            onClick={() => void navigate(`/deal/${deal.thingId}`)}
          >
            {/* <Button
                      color='good'
                      onClick={(event: MouseEvent<HTMLButtonElement>) => {
                        event.stopPropagation()
                        navigate(`/deal/${deal.thingId}`)
                      }}
                    > */}
            {state.btnText}
          </Button>
        )}
      </div>
      {/* </Button> */}
    </div>
  )
}

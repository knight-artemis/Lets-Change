import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

  const [state, setState] = useState({ status: '', isBtn: false, btnText: '' })

  useEffect(() => {
    const isInit = user.id === deal.initiatorId
    const isToMeDealAcc = isInit && deal.acceptedByInitiator
    const isFromMeDealAcc = !isInit && deal.acceptedByReceiver

    switch (deal.status) {
      case 0:
        setState(
          user.id === deal.initiatorId
            ? { status: 'ожидает подтверждения', isBtn: false, btnText: '' }
            : {
                status: 'ожидает подтверждения',
                isBtn: true,
                btnText: 'подробнее',
              },
        )
        break
      case 1:
        setState({
          status: 'согласен меняться',
          isBtn: true,
          btnText: 'обсудить',
        })
        break
      case 2:
        setState(
          user.id === deal.initiatorId && deal.acceptedByInitiator
            ? { status: 'сделка завершена', isBtn: false, btnText: '' }
            : {
                status: 'ожидает подтверждения обмена',
                isBtn: true,
                btnText: 'подтвердить',
              },
        )
        break
      case 3:
        setState({ status: 'сделка завершена', isBtn: false, btnText: '' })
        break
      case 4: //  а у отказавшегося вообще убрать показ этой сделки
        setState({
          status: 'от сделки отказались',
          isBtn: false,
          btnText: '',
        })
        break
      default:
        setState({ status: 'статус не ясен О_о', isBtn: false, btnText: '' })
    }
  }, [deal.initiatorId, deal.status, user.id])

  return (
    // <Button
    //   key={deal.id}
    //   link
    //   onClick={() => void navigate(`/thing/${deal.thingId}`)}
    // >
    <div className={style.listItem}>
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
        <div className={style.status}>Статус - {deal.status}: {state.status}</div>
        {state.isBtn && (
          <Button
            color='good'
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

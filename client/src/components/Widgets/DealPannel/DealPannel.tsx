import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import axios from 'axios'
import type { OneDealFromMe, OneDealToMe } from '../../../types'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import style from './DealPannel.module.css'
import Button from '../../Shared/Button/Button'
import CardSimple from '../CardSimple/CardSimple'
import { fetchGetNot } from '../../../redux/user/userThunkActions'

export default function DealPannel({
  deal,
  setSelectedDeals,
}: {
  deal: OneDealToMe | OneDealFromMe
  setSelectedDeals: React.Dispatch<React.SetStateAction<OneDealToMe[] | OneDealFromMe[]>>
}): JSX.Element {
  const navigate = useNavigate()
  const user = useAppSelector((store) => store.userSlice.user)

  const [state, setState] = useState({
    status: '',
    isBtn: false,
    btnText: '',
    color: '',
  })
  const dispatcher = useAppDispatch()

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
        setState(
          user.id === deal.initiatorId && !deal.acceptedByInitiator
            ? {
                status: 'от сделки отказались',
                isBtn: true,
                btnText: 'скрыть',
                color: 'gray',
              }
            : {
                status: 'вы отказались от сделки',
                isBtn: true,
                btnText: 'скрыть',
                color: 'gray',
              },
        )
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

  //! ТУТ ВСЁ НЕ ТАК ) оба хэндлера
  const acceptedHandler = async (id: number): Promise<void> => {
    await axios.patch(
      `${import.meta.env.VITE_API}/v1/deals/${id}`,
      {
        status: 3,
      },
      {
        withCredentials: true,
      },
    )
    // тут запрос в бд и подтверждение сделки
    // затем навигейт на страницу сделки
  }

  const rejectedHandler = async (id: number): Promise<void> => {
    // тут пишемручку на отказ. мб
    await axios.patch(
      `${import.meta.env.VITE_API}/v1/deals/${id}`,
      {
        status: 4,
      },
      {
        withCredentials: true,
      },
    )
    // тут запрос в бд и отказ от сделки
    // затем навигейт на страницу всех своих сделок
  }

  const archiveHandler = async (id: number): Promise<void> => {
    const resDeal = await axios.patch(
      `${import.meta.env.VITE_API}/v1/deals/${id}/note`,
      {
        initiatorNote: false,
      },
      {
        withCredentials: true,
      },
    )
    await dispatcher(fetchGetNot())
    setSelectedDeals((prev) => prev.filter(el=> el.id !== deal.id))
  }

  const btnHandler = async (id: number): Promise<void> => {
    switch (state.btnText) {
      case 'обсудить':
        navigate(`/deal/${id}`)
        break
      case 'подробнее':
        navigate(`/deal-to-consider/${id}`)
        break
      case 'подтвердить':
        // тут в ручку стук и удалить (или модалка с подтверждением)
        await acceptedHandler(id)
        break
      case 'отменить':
        // тут в ручку стук и удалить (или модалка с подтверждением)
        await rejectedHandler(id)
        break
      case 'скрыть':
        // тут в ручку стук и удалить (или модалка с подтверждением)
        console.log('archive')
        await archiveHandler(id)
        break
      default:
        break
    }
  }

  return (
    // <Button
    //   key={deal.id}
    //   link
    //   onClick={() => void navigate(`/thing/${deal.thingId}`)}
    // >
    <div
      className={clsx(
        style.listItem,
        (deal.status === 3 || deal.status === 4) && style.disabled,
      )}
    >
      <div className={style.photo}>
        <CardSimple
          hoverable
          size={150}
          thing={deal.Thing}
          thingId={deal.thingId}
        />
      </div>
      {/* 
      <div className={style.photo}>
        <img
          src={`${import.meta.env.VITE_THINGS}/${deal.Thing.photoUrl}`}
          alt='фотка-шмотка'
        />
      </div> */}

      {/* <div className={style.body}> */}
      <div className={style.textCol}>
        {/* <div className={style.name}>{deal.Thing.thingName}</div> */}
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
          <Button color={state.color} onClick={() => void btnHandler(deal.id)}>
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

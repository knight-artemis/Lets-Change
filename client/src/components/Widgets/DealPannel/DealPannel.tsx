/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import axios from 'axios'
import { string } from 'prop-types'
import type { ColorTypes, OneDealFromMe, OneDealToMe } from '../../../types'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import style from './DealPannel.module.css'
import Button from '../../Shared/Button/Button'
import CardSimple from '../CardSimple/CardSimple'
import { fetchGetNot } from '../../../redux/user/userThunkActions'
import Chip from '../../Shared/Chip/Chip'
import getRemainigTime from '../../../service/getRemainigTime'

type BtnStatusesType =
  | 'подробнее'
  | 'обсудить'
  | 'в чат'
  | 'скрыть'
  | 'подтвердить'
  | 'отменить'

type DealPannelButtonType = {
  status: string
  isBtn: boolean
  btnText?: BtnStatusesType
  color?: ColorTypes
}

export default function DealPannel({
  deal,
  setSelectedDeals,
}: {
  deal: OneDealToMe | OneDealFromMe
  setSelectedDeals: React.Dispatch<
    React.SetStateAction<OneDealToMe[] | OneDealFromMe[]>
  >
}): JSX.Element {
  const navigate = useNavigate()
  const user = useAppSelector((store) => store.userSlice.user)

  const [state, setState] = useState<DealPannelButtonType>({
    status: '',
    isBtn: false,
  })
  const dispatcher = useAppDispatch()
  console.log(deal)

  useEffect(() => {
    switch (deal.status) {
      case 0:
        setState({
          status: 'ожидает решения',
          isBtn: true,
          btnText: 'подробнее',
          color: 'neutral',
        })
        // setState(
        //   user.id === deal.initiatorId
        //     ? {
        //         status: 'ожидает подтверждения',
        //         isBtn: true,
        //         btnText: 'отменить',
        //         color: 'danger',
        //       }
        //     : {
        //         status: 'ожидает подтверждения',
        //         isBtn: true,
        //         btnText: 'подробнее',
        //         color: 'neutral',
        //       },
        // )
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
        setState({
          status: 'ожидает подтверждения обмена',
          isBtn: true,
          btnText: 'в чат',
          color: 'warning',
        })
        // setState(
        //   ((user.id === deal.initiatorId) && deal.acceptedByInitiator) ||
        //     ((user.id !== deal.initiatorId) && deal.acceptedByReceiver)
        //     ? {
        //         status: 'сделка состоялась',
        //         isBtn: true,
        //         btnText: 'скрыть',
        //         color: 'gray',
        //       }
        //     : {
        //         status: 'ожидает подтверждения обмена',
        //         isBtn: true,
        //         btnText: 'в чат',
        //         color: 'warning',
        //       },
        // )

        // setState(
        //   user.id === deal.initiatorId && deal.acceptedByInitiator
        //     ? {
        //         status: 'сделка завершена',
        //         isBtn: false,
        //         btnText: '',
        //         color: '',
        //       }
        //     : {
        //         status: 'ожидает подтверждения обмена',
        //         isBtn: true,
        //         btnText: 'подтвердить',
        //         color: 'good',
        //       },
        // )
        break
      case 3:
        setState({
          status: 'сделка завершена',
          isBtn: true,
          btnText: 'скрыть',
          color: 'gray',
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
        })
    }
  }, [
    deal.acceptedByInitiator,
    deal.acceptedByReceiver,
    deal.initiatorId,
    deal.status,
    user.id,
  ])

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
    setSelectedDeals((prev) => prev.filter((el) => el.id !== deal.id))
  }

  const btnHandler = async (id: number): Promise<void> => {
    switch (state.btnText) {
      case 'обсудить':
        navigate(`/deal/${id}`)
        break
      case 'в чат':
        navigate(`/deal/${id}`)
        break
      case 'подробнее':
        navigate(`/deal-to-consider/${id}`)
        break
      case 'подтвердить':
        // тут в ручку стук и удалить (или модалка с подтверждением)
        //! этот функционал удалён
        await acceptedHandler(id)
        break
      case 'отменить':
        // тут в ручку стук и удалить (или модалка с подтверждением)
        //! этот функционал удалён
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
      <center
        className={clsx(
          style.status,
          Number(deal.status) === 0
            ? style.await
            : Number(deal.status) === 1
              ? style.agreed
              : Number(deal.status) === 2
                ? style.oneChange
                : Number(deal.status) === 3
                  ? style.bothChange
                  : Number(deal.status) === 4
                    ? style.reject
                    : style.default,
        )}
      >
        {/* Статус: {state.status} */}
        Статус: {state.status}
      </center>
      <div className={style.wrapper}>
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
        <div className={style.middleCol}>
          {/* <div className={style.name}>{deal.Thing.thingName}</div> */}
          <div className={style.timeLeft}>
            осталось <br /> {getRemainigTime(deal.Thing.endDate)}
          </div>

          {deal.initiatorId === user.id ? (
            <>
              <div className={style.description}>
                сделка предложена для: {deal.recieverName}
              </div>
              {/* <div className={style.name}>{deal.recieverName}</div> */}
            </>
          ) : (
            <>
              <div className={style.description}>
                сделку предложил: {(deal as OneDealToMe).initiatorName}
              </div>
              {/* <div className={style.name}>
              {(deal as OneDealToMe).initiatorName}
            </div> */}
            </>
          )}

          {state.isBtn && (
            <Button
              color={state.color}
              onClick={() => void btnHandler(deal.id)}
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

        <div className={style.lastCol}>
          <div className={style.description}>
            Описание: {deal.Thing.description}
          </div>
          <div className={style.description}>
            Адрес: {deal.Thing.thingAddress}
          </div>

          {/* </div> */}
          {/* <div className={style.textCol}> */}
        </div>
        {/* </Button> */}
        {/* <div className={style.notification}> */}
        {deal.initiatorNote && (
          <Chip top={0.5} right={0.5} small color='none'>
            <img
              className={style.icon}
              src='/src/assets/icons/checkmark-circle.svg'
              alt='svg'
            />
          </Chip>
        )}
        {/* </div> */}
      </div>
    </div>
  )
}

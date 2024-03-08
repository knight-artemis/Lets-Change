import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { OneDealFromMe, OneDealToMe } from '../../../types'
import { useAppSelector } from '../../../redux/hooks'
import style from './DealPannel.module.css'
import Button from '../../Controls/Button/Button'

export default function DealPannel({deal}:{deal: OneDealToMe | OneDealFromMe}):JSX.Element {

    const navigate = useNavigate()
    const user = useAppSelector((store) => store.userSlice.user)

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
                      <div className={style.description}>
                        сделка предложена для:
                      </div>
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
                  <div className={style.status}>Статус: {deal.status}</div>
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
                    Подробнее
                  </Button>
                </div>
                {/* </Button> */}
              </div>
  )
}

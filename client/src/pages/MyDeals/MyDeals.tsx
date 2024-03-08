import React, { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'
import style from './MyDeals.module.css'
import SvgLink from '../../components/Controls/SvgLink/SvgLink'
import Button from '../../components/Controls/Button/Button'
import { useAppSelector } from '../../redux/hooks'
import type { MyDealsType, OneDealToMe, OneDealFromMe } from '../../types'

export default function MyDeals(): JSX.Element {
  const navigate = useNavigate()
  const user = useAppSelector((store) => store.userSlice.user)

  const [allDeals, setAllDeals] = useState<MyDealsType>()
  const [selectedDeals, setSelectedDeals] = useState<
    OneDealToMe[] | OneDealFromMe[]
  >()

  useEffect(() => {
    axios
      .get<MyDealsType>(
        `${import.meta.env.VITE_API}/v1/deals/user/${user.id}`,
        { withCredentials: true },
      )
      .then((res) => setAllDeals(res.data))
      .catch((err) => console.log('Ошибка получения списка моих сделок', err))
  }, [user.id])

  const fromMeOffers = (): void => {
    setSelectedDeals(allDeals?.fromMeDeals)
  }
  const toMeOffers = (): void => {
    setSelectedDeals(allDeals?.toMeDeals)
  }

  return (
    <>
      <div className={style.wrapper}>
        <div className={style.topContent}>
          <span className={style.span}>Тут можно поглянуть свои сделки</span>
        </div>

        <div className={style.mainContent}>
          <div className={style.sidebar}>
            <Button link onClick={() => void fromMeOffers()}>
              <SvgLink icon='assets/icons/shirt.svg' text='Мои предложения' />
            </Button>
            <Button link onClick={() => void toMeOffers()}>
              <SvgLink icon='assets/icons/shirt.svg' text='Мне предложили' />
            </Button>
          </div>

          <div className={style.list}>
            {selectedDeals?.map((deal) => (
              <Button
                key={deal.id}
                link
                onClick={() => void navigate(`/thing/${deal.thingId}`)}
              >
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
                        <div className={style.name}>{deal.initiatorName}</div>
                      </>
                    )}
                  </div>
                  <div className={style.textCol}>
                    <div className={style.status}>Статус: {deal.status}</div>
                    <Button
                      color='good'
                      onClick={(event: MouseEvent<HTMLButtonElement>) => {
                        event.stopPropagation()
                        void navigate(`/chat/${deal.thingId}`)
                      }}
                    >
                      Обсудить
                    </Button>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* <form
      action='http://localhost:3003/api/v1/test/testUpload'
      method='post'
      encType='multipart/form-data'
    >
      <input type='file' name='photo' multiple />
      <button type='submit'>Загрузить файл</button>
    </form> */}
    </>
  )
}

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
import DealPannel from '../../components/Widgets/DealPannel/DealPannel'

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
      .then((res) => {
        setAllDeals(res.data)
        setSelectedDeals(res.data.fromMeDeals)
      })
      .catch((err) => console.log('Ошибка получения списка моих сделок', err))
  }, [user.id])

  const fromMeOffers = (): void => {
    setSelectedDeals(allDeals?.fromMeDeals)
  }
  const toMeOffers = (): void => {
    setSelectedDeals(allDeals?.toMeDeals)
  }
  const myHystoryOffers = (): void => {
    setSelectedDeals(allDeals?.toMeDeals)
  }

  return (
    <>
      <div className={style.wrapper}>
        <div className={style.topContent}>
          {selectedDeals &&
          selectedDeals.length > 0 &&
          selectedDeals[0].initiatorId === user.id ? (
            <span className={style.span}>я хочу забрать эти вещи</span>
          ) : (
            <span className={style.span}>у меня хотят забрать эти вещи</span>
          )}
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
            {selectedDeals?.map((deal) => <DealPannel deal={deal} />)}
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

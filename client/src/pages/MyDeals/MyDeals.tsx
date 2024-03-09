import React, { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'
import style from './MyDeals.module.css'
import SvgLink from '../../components/Shared/SvgLink/SvgLink'
import Button from '../../components/Shared/Button/Button'
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
  const [mainText, setMainText] = useState<string>('Мои сделки')

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
    if (allDeals?.toMeDeals && allDeals?.toMeDeals.length > 0)
    setMainText('я хочу забрать эти вещи')
  else setMainText('я пока не предложил ни одной сделки')
}
const toMeOffers = (): void => {
  setSelectedDeals(allDeals?.toMeDeals)
  if (allDeals?.fromMeDeals && allDeals?.fromMeDeals.length > 0)
    setMainText('у меня хотят забрать эти вещи')
  else setMainText('мне пока не предложили  ни одной сделки')
  }
  const myArchiveOffers = (): void => {
    setSelectedDeals(allDeals?.toMeDeals)
  }

  // const getMainText2 = (): string => {
  //   return 'у меня пока нет сделок'
  // }

  // const getMainText = (): string => {
  //   if (allDeals?.toMeDeals.length === 0 && allDeals?.fromMeDeals.length === 0)
  //     return 'у меня пока нет сделок'
  //   if (
  //     selectedDeals &&
  //     selectedDeals.length > 0 &&
  //     selectedDeals[0].initiatorId === user.id
  //   )
  //     return 'я хочу забрать эти вещи'
  //   if (
  //     selectedDeals &&
  //     selectedDeals.length > 0 &&
  //     selectedDeals[0].initiatorId !== user.id
  //   )
  //     return 'у меня хотят забрать эти вещи'
  //   return 'у меня хотят забрать эти вещи'
  // }

  return (
    <>
      <div className={style.wrapper}>
        <div className={style.topContent}>
          <span className={style.span}>{mainText}</span>
        </div>

        <div className={style.mainContent}>
          <div className={style.sidebar}>
            <Button link onClick={() => void fromMeOffers()}>
              <SvgLink icon='assets/icons/shirt.svg' text='Я хочу' />
            </Button>
            <Button link onClick={() => void toMeOffers()}>
              <SvgLink icon='assets/icons/shirt.svg' text='У меня хотят' />
            </Button>
          </div>

          <div className={style.list}>
            {selectedDeals?.map((deal) => (
              <DealPannel key={deal.id} deal={deal} />
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

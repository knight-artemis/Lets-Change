import React, { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'
import style from './MyDeals.module.css'
import SvgLink from '../../components/Shared/SvgLink/SvgLink'
import Button from '../../components/Shared/Button/Button'
import { useAppSelector } from '../../redux/hooks'
import type {
  MyDealsType,
  OneDealToMe,
  OneDealFromMe,
  NotType,
} from '../../types'
import DealPannel from '../../components/Widgets/DealPannel/DealPannel'
import Chip from '../../components/Shared/Chip/Chip'

export default function MyDeals({
  toMe = true,
}: {
  toMe?: boolean
}): JSX.Element {
  const navigate = useNavigate()
  const user = useAppSelector((store) => store.userSlice.user)
  const notifications = useAppSelector<NotType>(
    (store) => store.userSlice.notifications,
  )

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
        setSelectedDeals(toMe ? res.data.toMeDeals : res.data.fromMeDeals)
        setMainText(
          toMe ? 'у меня хотят забрать эти вещи' : 'я хочу забрать эти вещи',
        )
      })
      .catch((err) => console.log('Ошибка получения списка моих сделок', err))
  }, [toMe, user.id])

  const fromMeDeals = (): void => {
    navigate('/my-deals/from-me')
    // setSelectedDeals(allDeals?.fromMeDeals)
    // if (allDeals?.toMeDeals && allDeals?.toMeDeals.length > 0)
    //   setMainText('я пока не предложил ни одной сделки')
    // else setMainText('я хочу забрать эти вещи')
  }
  const toMeDeals = (): void => {
    navigate('/my-deals/to-me')
    // setSelectedDeals(allDeals?.toMeDeals)
    // if (allDeals?.fromMeDeals && allDeals?.fromMeDeals.length > 0)
    //   setMainText('мне пока не предложили  ни одной сделки')
    // else setMainText('у меня хотят забрать эти вещи')
  }
  const myArchiveDeals = (): void => {
    navigate('/my-deals/archive')
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
            <Button link onClick={() => void fromMeDeals()}>
              <SvgLink  icon='./../assets/icons/shirt.svg' text='Я хочу' />
              {/* <Chip bottom={0.5} right={-0.5} small color='neutral'>
                {(notifications?.initiator || 0) +
                  (notifications?.reciever || 0)}
              </Chip> */}
            </Button>
            <Button link onClick={() => void toMeDeals()}>
             
              <SvgLink  icon='./../assets/icons/shirt.svg'  text=' У меня хотят' />
              
              {/* <Chip bottom={12} right={12} small color='neutral'>
                {(notifications?.initiator || 0) +
                  (notifications?.reciever || 0)}
              </Chip> */}
                  
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

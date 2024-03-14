import React, { useEffect, useState } from 'react'
import type { MouseEvent } from 'react'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'
import style from './MyDeals.module.css'
import SvgLink from '../../components/Shared/SvgLink/SvgLink'
import Button from '../../components/Shared/Button/Button'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import type {
  MyDealsType,
  OneDealToMe,
  OneDealFromMe,
  NotType,
} from '../../types'
import DealPannel from '../../components/Widgets/DealPannel/DealPannel'
import Chip from '../../components/Shared/Chip/Chip'
import { fetchGetNot } from '../../redux/user/userThunkActions'
import WholePage from '../../components/PageSkeleton/WholePage/WholePage'
import SideBar from '../../components/PageSkeleton/SideBar/SideBar'
import MainContent from '../../components/PageSkeleton/MainContent/MainContent'
import Grid from '../../components/PageSkeleton/Grid/Grid'
import TopLine from '../../components/PageSkeleton/TopLine/TopLine'

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
  const dispatcher = useAppDispatch()

  useEffect(() => {
    dispatcher(fetchGetNot())
      .then()
      .catch((err) => console.log(err))
    axios
      .get<MyDealsType>(
        `${import.meta.env.VITE_API}/v1/deals/user/${user.id}`,
        { withCredentials: true },
      )
      .then((res) => {
        setAllDeals(res.data)
        setSelectedDeals(
          toMe
            ? res.data.toMeDeals.filter((el) => el.status < 3)
            : res.data.fromMeDeals.filter(
                (el) => el.initiatorNote || el.status < 3,
              ),
          //! Это костылище ! костыличещное
        )
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
    <WholePage>
      <SideBar>
        <Button link onClick={() => void fromMeDeals()}>
          <div className={style.btn}>
            <SvgLink icon='./../assets/icons/shirt.svg' text='Я хочу' />
            {notifications.initiator > 0 && (
              <Chip top={-1} left={1.5} small color='neutral'>
                {notifications.initiator}
              </Chip>
            )}
          </div>
        </Button>
        <Button link onClick={() => void toMeDeals()}>
          <div className={style.btn}>
            <SvgLink icon='./../assets/icons/shirt.svg' text=' У меня хотят' />
            {notifications.reciever > 0 && (
              <Chip top={-1} left={1.5} small color='neutral'>
                {notifications.reciever}
              </Chip>
            )}
          </div>
        </Button>
      </SideBar>

      <MainContent>
        <TopLine>
          <div className={style.topContent}>
            <h1>{mainText}</h1>
          </div>
        </TopLine>
        {selectedDeals && selectedDeals.length > 0 ? (
          <Grid centerHorizontal>
            {selectedDeals?.map((deal) => (
              <DealPannel
                key={deal.id}
                deal={deal}
                setSelectedDeals={setSelectedDeals}
              />
            ))}
          </Grid>
        ) : (
          <Grid centerHorizontal centerVertical>
            <h2>У тебя ещё нет сделок в этой категории</h2>
          </Grid>
        )}
      </MainContent>
    </WholePage>
  )
}

import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import style from './Deal.module.css'
import type { OneDealDetailed } from '../../types'
import Button from '../../components/Shared/Button/Button'
import CardSimple from '../../components/Widgets/CardSimple/CardSimple'
import Chat from '../../components/Chat/Chat'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { fetchGetNot } from '../../redux/user/userThunkActions'
import WholePage from '../../components/PageSkeleton/WholePage/WholePage'
import SideBar from '../../components/PageSkeleton/SideBar/SideBar'
import MainContent from '../../components/PageSkeleton/MainContent/MainContent'
import Spinner from '../../components/Widgets/Spinner/Spinner'

type AxiosFinishedType = {
  acceptedByInitiator?: boolean
  acceptedByReceiver?: boolean
}
type AxiosFinishedReturnType = { succes: boolean }

export default function Deal(): JSX.Element {
  const [deal, setDeal] = useState<OneDealDetailed>()
  const [loading, setLoading] = useState<boolean>(true)

  const user = useAppSelector((store) => store.userSlice.user)
  const { id } = useParams()
  const dispatcher = useAppDispatch()
  const navigate = useNavigate()

  const accepted =
    user.id === deal?.initiatorId
      ? deal?.acceptedByInitiator
      : deal?.acceptedByReceiver
  console.log(deal?.acceptedByInitiator, deal?.acceptedByReceiver)

  useEffect(() => {
    console.log('RERENDER')
    void (async () => {
      try {
        setLoading(true)
        const res = await axios.get<OneDealDetailed>(
          `${import.meta.env.VITE_API}/v1/deals/${id}`,
          {
            withCredentials: true,
          },
        )
        setDeal(res.data)
        if (user.id === res.data.initiatorId) {
          await axios.patch(
            `${import.meta.env.VITE_API}/v1/deals/${res.data.id}/note`,
            { initiatorNote: false },
          )
        } else if (user.id === res.data.receiverId) {
          await axios.patch(
            `${import.meta.env.VITE_API}/v1/deals/${res.data.id}/note`,
            { recieverNote: false },
          )
        }
        await dispatcher(fetchGetNot())
      } catch (err) {
        console.log('какая то шняга', err)
      } finally {
        setLoading(false)
      }
    })()
    // const dealPrommise = axios
    //   .get<OneDealDetailed>(`${import.meta.env.VITE_API}/v1/deals/${id}`, {
    //     withCredentials: true,
    //   })
    //   .then((res) => setDeal(res.data))
    //   .catch((err) => console.log('Ошибка получения подробной сделки', err))
  }, [id])

  const finishedHandler = async (): Promise<void> => {
    const axiosRequest: AxiosFinishedType = {}
    if (deal) {
      if (user.id === deal.initiatorId) axiosRequest.acceptedByInitiator = true
      else if (user.id === deal.receiverId)
        axiosRequest.acceptedByReceiver = true
    }

    // const axiosRequest: AxiosFinishedType =
    //   user.id === deal?.initiatorId
    //     ? { acceptedByInitiator: true }
    //     : { acceptedByReceiver: true }
    try {
      setLoading(true)
      await axios.patch<AxiosFinishedType, AxiosFinishedReturnType>(
        `${import.meta.env.VITE_API}/v1/deals/${id}/finished`,
        { data: axiosRequest },
        { withCredentials: true },
      )
      console.log('Успешно закрыл')
      navigate(-1)
    } catch (error) {
      console.log('Ошибка закрытия сделки', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <WholePage>
      <SideBar center>
        <div className={style.text}>
          {deal && deal.initiatorId === user.id ? 'За эту вещь' : 'Твою вещь'}
        </div>
        <CardSimple
          hoverable
          thing={deal && deal.Thing}
          thingId={deal.thingId}
        />
        {/* <CardSimple hoverable thing={deal && deal.initiatorId === user.id ? deal.initiatorThings[0] : deal.Thing} /> */}
        <div className={style.text}>
          {deal && deal.initiatorId === user.id ? 'у тебя хотят' : 'меняют на'}
        </div>
        <CardSimple
          hoverable
          thing={deal && deal.initiatorThings.find((el) => el.isSelected)}
          thingId={deal.initiatorThings.find((el) => el.isSelected)?.id}
        />
        {!accepted && (
          <>
            <Button color='good' onClick={() => finishedHandler()}>
              Мы договорились
            </Button>
            <span className={style.text}>Нажми, если вы уже обменялись</span>
          </>
        )}
      </SideBar>

      <MainContent>
        <Chat deal={deal} />
      </MainContent>
    </WholePage>
  )
}

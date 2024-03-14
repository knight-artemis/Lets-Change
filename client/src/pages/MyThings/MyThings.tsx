import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { SpinnerInfinity } from 'spinners-react'
import type { SimplifiedThingType } from '../../types'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import Card from '../../components/Widgets/Card/Card'
import style from './MyThings.module.css'
import Button from '../../components/Shared/Button/Button'
import SvgLink from '../../components/Shared/SvgLink/SvgLink'
import { fetchGetNot } from '../../redux/user/userThunkActions'
import WholePage from '../../components/PageSkeleton/WholePage/WholePage'
import SideBar from '../../components/PageSkeleton/SideBar/SideBar'
import MainContent from '../../components/PageSkeleton/MainContent/MainContent'
import Grid from '../../components/PageSkeleton/Grid/Grid'
import TopLine from '../../components/PageSkeleton/TopLine/TopLine'
import Spinner from '../../components/Widgets/Spinner/Spinner'

export default function MyThings(): JSX.Element {
  const user = useAppSelector((store) => store.userSlice.user)

  const [things, setThings] = useState<SimplifiedThingType[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const navigate = useNavigate()
  const dispatcher = useAppDispatch()

  useEffect(() => {
    dispatcher(fetchGetNot())
      .then()
      .catch((err) => console.log(err))
    setLoading(true)
    axios
      .get<SimplifiedThingType[]>(
        `${import.meta.env.VITE_API}/v1/things/user/${user.id}`,
        { withCredentials: true },
      )
      .then((res) => setThings(res.data))
      .catch((err) => console.log('Ошибка получения всех СВОИХ вещей', err))
      .finally(() => setLoading(false))
  }, [user.id])

  if (loading) return <Spinner />

  return (
    <WholePage>
      <SideBar>
        <Button link onClick={() => void navigate(`/new-thing`)}>
          <SvgLink icon='src/assets/icons/add-thing.svg' text='Добавить вещь' />
        </Button>
        <Button link onClick={() => void navigate(`/`)}>
          <SvgLink
            icon='./src/assets/icons/search-large.svg'
            text='Посмотреть вещи других'
          />
        </Button>
      </SideBar>
      <MainContent>
        <TopLine>
          <h1>Мои вещи</h1>
        </TopLine>
        <Grid>
          {things.length ? (
            things.map((thing: SimplifiedThingType) => (
              <Card key={`card-${thing.id}`} thing={thing} />
            ))
          ) : (
            <div className={style.emptyPage}>
              <span>Вы ещё не добавили никаких вещей</span>
            </div>
          )}
        </Grid>
      </MainContent>
    </WholePage>

    // <div className={style.wrapper}>
    //   <div className={style.content}>

    //   </div>

    // </div>
  )
}

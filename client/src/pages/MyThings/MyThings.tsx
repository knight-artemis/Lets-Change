import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
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

const ThingInitVal = {
  id: 0,
  thingName: '',
  categoryId: 0,
  thingAddress: '',
  thingLat: 0,
  thingLon: 0,
  endDate: new Date(),
  photoUrl: '',
}

export default function MyThings(): JSX.Element {
  const user = useAppSelector((store) => store.userSlice.user)

  const [things, setThings] = useState<SimplifiedThingType[]>([ThingInitVal])

  const navigate = useNavigate()
  const dispatcher = useAppDispatch()

  useEffect(() => {
    dispatcher(fetchGetNot())
      .then()
      .catch((err) => console.log(err))
    axios
      .get<SimplifiedThingType[]>(
        `${import.meta.env.VITE_API}/v1/things/user/${user.id}`,
        { withCredentials: true },
      )
      .then((res) => setThings(res.data))
      .catch((err) => console.log('Ошибка получения всех СВОИХ вещей', err))
  }, [user.id])

  return (
    <WholePage>
      <SideBar>
        <Button link onClick={() => void navigate(`/new-thing`)}>
          <SvgLink
            icon='src/assets/icons/add-thing.svg'
            text='Добавить свою вещь для обмена'
          />
        </Button>
        <Button link onClick={() => void navigate(`/`)}>
          <SvgLink
            icon='./src/assets/icons/search-large.svg'
            text='Посмотреть вещи других пользователей'
          />
        </Button>
      </SideBar>
      <MainContent >
        <Grid centerHorizontal >
          {things.length !== 0 ? (
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

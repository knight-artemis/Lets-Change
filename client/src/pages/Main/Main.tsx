/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useActionData, useNavigate } from 'react-router-dom'
import {
  Clusterer,
  GeolocationControl,
  Map,
  Placemark,
} from '@pbe/react-yandex-maps'
import style from './Main.module.css'
import switchStyle from './ToogleSwitch.module.css'
import Button from '../../components/Shared/Button/Button'
import type { SimplifiedThingType } from '../../types'
import MyPlacemark from '../../components/MyPlacemark/MyPlacemark'
import Card from '../../components/Widgets/Card/Card'
import SvgLink from '../../components/Shared/SvgLink/SvgLink'
import Input from '../../components/Shared/Input/Input'
import { fetchGetNot } from '../../redux/user/userThunkActions'
import { useAppDispatch } from '../../redux/hooks'
import SideBar from '../../components/PageSkeleton/SideBar/SideBar'
import WholePage from '../../components/PageSkeleton/WholePage/WholePage'
import MainContent from '../../components/PageSkeleton/MainContent/MainContent'
import Grid from '../../components/PageSkeleton/Grid/Grid'
import TopLine from '../../components/PageSkeleton/TopLine/TopLine'
import Spinner from '../../components/Widgets/Spinner/Spinner'

const ThingsInitVal = {
  id: 0,
  thingName: '',
  categoryId: 0,
  thingAddress: '',
  thingLat: 0,
  thingLon: 0,
  endDate: new Date(),
  photoUrl: '',
}

const catArray = ['desktop-outline.svg', 'happy-outline.svg']

type CategoryType = {
  id: number
  categoryTitle: string
}

const CategoryInitVal = { id: 0, categoryTitle: '' }

export default function Main(): JSX.Element {
  const [things, setThings] = useState<SimplifiedThingType[]>([ThingsInitVal])
  const [categories, setCategories] = useState<CategoryType[]>([
    CategoryInitVal,
  ])
  const [isChecked, setIsChecked] = useState(false)
  const [location, setLocation] = useState<number[]>([])
  const [searchInput, setSearchInput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  const handleToggleChange = (): void => {
    setIsChecked(!isChecked)
  }

  const navigate = useNavigate()
  const dispatcher = useAppDispatch()

  const setAllThings = (): void => {
    setLoading(true)
    axios
      .get<SimplifiedThingType[]>(`${import.meta.env.VITE_API}/v1/things`, {
        withCredentials: true,
      })
      .then((res) => setThings(res.data))
      .catch((err) => console.log('Ошибка получения всех вещей', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    // список объявлений по свежести
    setAllThings()
    setLoading(true)
    dispatcher(fetchGetNot())
      // .then()
      .catch((err) => console.log(err))

    // список категорий
    axios
      .get<CategoryType[]>(`${import.meta.env.VITE_API}/v1/things/categories`, {
        withCredentials: true,
      })
      .then((res) => setCategories(res.data))
      .catch((err) => console.log('Ошибка получения списка категории', err))
      .finally(() => setLoading(false))

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation([position.coords.latitude, position.coords.longitude])
        },
        (error) => {
          setLocation([55.74, 37.61])
          console.error('Error getting geolocation:', error)
        },
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }, [])

  const categoryHandler = (id: number): void => {
    // тут сортировательная функция, устанавливает шмотки кокретной категоории
    //! нодо аддитивность категорий
    setLoading(true)
    axios
      .get<SimplifiedThingType[]>(
        `${import.meta.env.VITE_API}/v1/things/categories/${id}`,
        { withCredentials: true },
      )
      .then((res) => setThings(res.data))
      .catch((err) => console.log('Ошибка получения вещей в категории', err))
      .finally(() => setLoading(false))
  }

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchInput(() => e.target.value)
    setLoading(true)
    axios
      .get<SimplifiedThingType[]>(
        `${import.meta.env.VITE_API}/v1/things/search?search=${e.target.value}`,
        {
          withCredentials: true,
        },
      )
      .then((res) => setThings(res.data))
      .catch((err) => console.log('Ошибка получения всех вещей', err))
      .finally(() => setLoading(false))
  }

  // useEffect (() => {

  //   if (searchInput.trim() !== '') {
  //     void  setAllThings()
  //     }
  // }, [searchInput])

  // const searchHandler = () => {
  //   if (searchInput.trim() !== '') {
  //     console.log('🚀 ~ searchHandler ~ searchInput.trim():', searchInput.trim())
  //     setAllThings()
  //     console.log('things', things);
  //     setThings(things.filter(thing => thing.thingName.toLowerCase().includes(searchInput.toLowerCase())))
  //     console.log('things', things);
  //     // setThings(
  //     //   things.filter((thing) => {

  //     //     console.log("🚀 ~ things.filter ~ thing.thingName.toLowerCase():", thing.thingName.toLowerCase())
  //     //   return  thing.thingName.toLowerCase().includes(searchInput.toLowerCase())
  //     //   }),
  //     // )
  //   }
  // }
  console.log(`assets/icons/${catArray[0]}`)

  if (loading) return <Spinner/>   

  return (
    <WholePage>
      {/* <div className={style.wrapper}> */}
      {/* <div className={style.mainContent}> */}
      <SideBar>
        {/* <div className={style.sidebar}> */}
        <Button key='start' link onClick={() => void setAllThings()}>
          <SvgLink icon='assets/icons/shirt.svg' text='Все категории' />
        </Button>
        {categories.map((category, i) => (
          <Button
            key={category.id}
            link
            onClick={() => void categoryHandler(category.id)}
          >
            <SvgLink
              icon={`/assets/icons/${catArray[i]}`}
              text={category.categoryTitle}
            />
          </Button>
        ))}
        {/* </div> */}
      </SideBar>

      <MainContent>
        {/* <div className={style.topContent}> */}
        <TopLine>
          <div className={style.search}>
            {/* <SvgLink icon='assets/icons/search-large.svg' /> */}
            <Input
              name='toSearch'
              placeholder='Что ищем?'
              onChange={changeHandler}
              value={searchInput}
              // onKeyDown={(e) => {
              //   if (e.key === 'Enter') void searchHandler()
              // }}
            />
          </div>
          {/* <SvgLink icon='./src/assets/icons/blocks.svg' /> */}
          <img
            className={style.icon}
            src='src/assets/icons/blocks.svg'
            alt='svg'
          />
          {/* <span className={style.span}>списком</span> */}
          {/* <SvgLink icon='./src/assets/icons/list-color.svg' /> */}
          <label htmlFor='toggleSwitch' className={switchStyle.switch}>
            <input
              id='toggleSwitch'
              type='checkbox'
              checked={isChecked}
              onChange={handleToggleChange}
            />
            <span className={switchStyle.slider} />
          </label>
          {/* <SvgLink icon='src/assets/icons/globus-color.svg' /> */}
          {/* <SvgLink icon='src/assets/icons/globus.svg' /> */}
          <img
            className={style.icon}
            src='src/assets/icons/globus.svg'
            alt='svg'
          />
          {/* <span className={style.span}>на карте</span> */}
        </TopLine>
        {/* </div> */}

        {/* <div className={style.content}> */}
        {isChecked ? (
          <div style={{ width: '100%', height: '100%', borderRadius: '20px' }}>
            {/* {location.length > 0 && ( */}
            <Map
              // onClick={(e) => handleClick(e.get('coords'))}
              width='1000px'
              height='600px'
              defaultState={{
                center: location,
                zoom: 15,
                controls: ['zoomControl', 'fullscreenControl'],
              }}
              state={{
                center: location,
                zoom: 15,
                controls: ['zoomControl', 'fullscreenControl'],
              }}
            >
              <GeolocationControl options={{ float: 'left' }} />
              <Clusterer
                options={{
                  preset: 'islands#invertedVioletClusterIcons',
                  // groupByCoordinates: false,
                }}
              >
                {things.map((thing) => (
                  <MyPlacemark
                    key={`${thing.id}`}
                    coord={[thing.thingLat, thing.thingLon]}
                    onClick={() => navigate(`/thing/${thing.id}`)}
                    img={`${import.meta.env.VITE_THINGS}/${thing.photoUrl}`}
                    iconCaption={thing.thingName}
                  />
                ))}
              </Clusterer>
            </Map>
            {/* )} */}
          </div>
        ) : (
          <Grid spaceBetween>
            
            {things.length !== 0 ? (
              things.map((thing: SimplifiedThingType) => (
                <Card key={`card-${thing.id}`} thing={thing} isMain />
              ))
            ) : (
              <div className={style.notFound}>
                <span>В этой категории пока ничего нет </span>
                <img src='./src/assets/gifs/not-found.gif' alt='not-found' />
              </div>
            )}
          </Grid>
        )}
        {/* </div> */}
      </MainContent>
      {/* </div> */}
      {/* // </div> */}
    </WholePage>
  )
}

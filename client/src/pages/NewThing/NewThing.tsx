import React, { useEffect, useRef, useState } from 'react'
import { GeolocationControl, Map, Placemark } from '@pbe/react-yandex-maps'
import axios from 'axios'
import styles from './NewThing.module.css'
import Button from '../../components/Shared/Button/Button'
import type { CategoryType } from '../../types'
import { useAppDispatch } from '../../redux/hooks'
import { fetchGetNot } from '../../redux/user/userThunkActions'
import Modal from '../../components/Widgets/Modal/Modal'

type FormData = {
  thingName: string
  description: string
  categoryId: number
  thingAddress: string
  thingLat: number
  thingLon: number
  endDate: Date
  isApproved: boolean
  [key: string]: string | number | Date | boolean
}

type GeoResponse = {
  response: {
    GeoObjectCollection: {
      featureMember: {
        GeoObject: {
          description: string
          name: string
        }
      }[]
    }
  }
}

export default function NewThing(): JSX.Element {
  const calculateEndDate = (daysNum: number): Date => {
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + daysNum)
    return endDate
  }
  const CategoryInitVal = { id: 0, categoryTitle: '' }
  const initialFormsData: FormData = {
    thingName: '',
    description: '',
    categoryId: 1,
    thingAddress: '',
    thingLat: 0,
    thingLon: 0,
    endDate: calculateEndDate(7),
    isApproved: true, //! убрать когда будет админ
  }
  const [location, setLocation] = useState<number[]>([])
  const [address, setAddress] = useState<string>('')
  const [categories, setCategories] = useState<CategoryType[]>([
    CategoryInitVal,
  ])
  const [days, setDays] = useState<number>(7)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState(initialFormsData)
  const dispatcher = useAppDispatch()
  const [modalActive, setModalActive] = useState<boolean>(true)

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setDays(Number(e.target.value))
    setFormData({
      ...formData,
      endDate: calculateEndDate(Number(e.target.value)),
    })
  }

  useEffect(() => {
    dispatcher(fetchGetNot())
      .then()
      .catch((err) => console.log(err))
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

    axios
      .get<CategoryType[]>(`${import.meta.env.VITE_API}/v1/things/categories`, {
        withCredentials: true,
      })
      .then((res) => setCategories(res.data))
      .catch((err) => console.log('Ошибка получения списка категории', err))
  }, [])

  // const handleFileChange = (event) => {

  // }

  const handleChange = (
    event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ): void => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
      thingAddress: address,
      thingLat: location[0],
      thingLon: location[1],
    })
  }
  const handleUploadClick = async (): Promise<void> => {
    if (!fileInputRef.current?.files?.length)
      return console.log('please upload files')
    const data = new FormData()

    const { files } = fileInputRef.current
    for (let i = 0; i < files.length; i += 1) {
      data.append('photo', files[i])
    }

    Object.keys(formData).forEach((key: keyof FormData) => {
      const value = formData[key]
      data.append(key as string, value.toString())
    })

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/v1/things`,
        data,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      console.log('Ответ от сервера:', response.data)
      fileInputRef.current.value = ''
      setFormData(initialFormsData)
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error)
    }
  }

  const handleClick = async (coords: number[]): Promise<void> => {
    const result = await axios.get<GeoResponse>(
      `https://geocode-maps.yandex.ru/1.x/?apikey=d6a65ed5-d62c-4aa0-89ba-ed187e6aa79e&format=json&geocode=${coords[1]},${coords[0]}`,
    )
    console.log('Координаты клика:', coords)
    const descr =
      result.data.response.GeoObjectCollection.featureMember[0].GeoObject.description
        .split(', ')
        .reverse()
        .join(', ')
    const { name } =
      result.data.response.GeoObjectCollection.featureMember[0].GeoObject
    setAddress(`${descr}, ${name}`)
    setLocation(coords)
  }
  // console.log(address)

  const handleAccept = (): void => {
    console.log(address, location)
    setFormData({
      ...formData,
      thingAddress: address,
      thingLat: location[0],
      thingLon: location[1],
    })
    setModalActive((prev) => !prev)
  }

  return (
    <form className={styles.main} encType='multipart/form-data'>
      <h1>Добавить вещь</h1>
      <h5>Добавьте название</h5>
      <input
        type='text'
        name='thingName'
        value={formData.thingName}
        onChange={(e) => void handleChange(e)}
        placeholder='Введите заголовок'
      />
      <h5>Добавьте описание</h5>
      <input
        type='text'
        name='description'
        value={formData.description}
        onChange={(e) => void handleChange(e)}
        placeholder='Введите описание'
      />
      <h5>Выберите категорию</h5>
      <select
        name='categoryId'
        value={formData.categoryId}
        onChange={(e) => void handleChange(e)}
      >
        {categories.map((el) => (
          <option key={`opt-${el.id}}`} value={`${el.id}`}>
            {el.categoryTitle}
          </option>
        ))}
      </select>
      <h5>Выберите длительность размещения</h5>
      <p>Дней: {days}</p>
      <input
        type='range'
        min='1'
        max='30'
        value={days}
        onChange={(e) => handleSliderChange(e)}
      />
      <h5>Выберите фото</h5>
      <input
        ref={fileInputRef}
        type='file'
        name='photo'
        multiple
        accept='.jpg, .jpeg, .png'
        // onChange={handleFileChange}
      />
      {/* <MyPlacemarkUpload /> */}
      <h5>{address.length ? address : 'Выберите локацию'}</h5>
      <Button onClick={() => void setModalActive((prev) => !prev)}>
        {address.length ? 'изменить местоположение' : 'выбрать местоположение'}
      </Button>
      <Modal active={modalActive} setActive={setModalActive}>
        <>
          <Map
            onClick={(e: { get: (arg0: string) => number[] }) =>
              handleClick(e.get('coords'))
            }
            width='600px'
            height='500px'
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
            {address.length > 0 && (
              <Placemark
                onClick={() => console.log('click')}
                geometry={location}
                properties={{
                  balloonContentBody:
                    'This is balloon loaded by the Yandex.Maps API module system',
                }}
              />
            )}
          </Map>
          {address.length > 0 ? <p>{address}</p> : <p> </p>}
          {/* <Button color='good'>Загрузить</Button>
      <Button color='warning'>Загрузить</Button>
      <Button color='neutral'>Загрузить</Button>
      <Button color='danger'>Загрузить</Button> */}
          <Button disabled={!address.length} onClick={() => handleAccept()}>Подтвердить локацию</Button>
        </>
      </Modal>
      <Button onClick={() => void handleUploadClick()}>Загрузить</Button>
    </form>
  )
}

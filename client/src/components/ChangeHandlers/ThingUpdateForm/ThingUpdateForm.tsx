import type { AxiosResponse } from 'axios'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { GeolocationControl, Map, Placemark } from '@pbe/react-yandex-maps'
import { useNavigate } from 'react-router-dom'
import type { CategoryType, PhotoType, ThingType } from '../../../types'
import styles from './ThingUpdateForm.module.css'
import Modal from '../../Widgets/Modal/Modal'
import Button from '../../Shared/Button/Button'
import { notifySuccess } from '../../../toasters'

export default function ThingUpdateForm({
  thing,
  setThing,
  setActive,
}: {
  thing: ThingType
  setThing: React.Dispatch<React.SetStateAction<ThingType>>
  setActive: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element {
  const CategoryInitVal = { id: 0, categoryTitle: '' }
  const [categories, setCategories] = useState<CategoryType[]>([
    CategoryInitVal,
  ])

  const navigate = useNavigate()

  const initialsInputs = {
    thingName: thing.thingName,
    description: thing.description,
    thingAddress: thing.thingAddress,
    thingLat: thing.thingLat,
    thingLon: thing.thingLon,
    categoryId: thing.categoryId,
    Photos: thing.Photos,
    newPhotos: [],
  }

  type UpdThingtype = {
    thingName: string
    description: string
    thingAddress: string
    thingLat: number
    thingLon: number
    categoryId: number
    Photos: PhotoType[]
    newPhotos?: []
  }
  const [inputs, setInputs] = useState<UpdThingtype>(initialsInputs)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [modalActive, setModalActive] = useState<boolean>(true)
  const [location, setLocation] = useState<number[]>([
    thing.thingLat,
    thing.thingLon,
  ])
  const [address, setAddress] = useState<string>(thing.thingAddress)

  useEffect(() => {
    setInputs(thing)
    const fetchThingInfo = async (): Promise<void> => {
      try {
        axios
          .get<CategoryType[]>(
            `${import.meta.env.VITE_API}/v1/things/categories`,
            {
              withCredentials: true,
            },
          )
          .then((res) => setCategories(res.data))
          .catch((err) => console.log('Ошибка получения списка категории', err))
      } catch (error) {
        console.log(error)
      }
    }
    void fetchThingInfo()
  }, [thing])

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const removePhoto = (photoUrlToRemove: string): void => {
    const updatedPhotos = inputs.Photos.filter(
      (photo) => photo.photoUrl !== photoUrlToRemove,
    )
    setInputs((prev) => ({
      ...prev,
      Photos: updatedPhotos,
    }))
  }

  const updateThingInfo = async (): Promise<void> => {
    const formData = new FormData()

    formData.append('thingName', inputs.thingName)
    formData.append('description', inputs.description)
    formData.append('thingAddress', inputs.thingAddress)
    formData.append('thingLat', String(inputs.thingLat))
    formData.append('thingLon', String(inputs.thingLon))
    formData.append('categoryId', String(inputs.categoryId))

    inputs.Photos.forEach((photo) => {
      formData.append('photos', photo.photoUrl)
    })

    if (fileInputRef.current?.files?.length) {
      for (let i = 0; i < fileInputRef.current.files.length; i += 1) {
        formData.append('newPhotos', fileInputRef.current.files[i])
      }
    }

    const updatedThing = await axios.put<
      UpdThingtype,
      AxiosResponse<ThingType>
    >(`${import.meta.env.VITE_API}/v1/things/${thing.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    })
    setThing(updatedThing.data)
    setActive((prev) => !prev)
    notifySuccess('Карточка вещи была успешно обновлена.')
    navigate('/my-things')
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

  const handleAccept = (): void => {
    console.log(address, location)
    setInputs({
      ...inputs,
      thingAddress: address,
      thingLat: location[0],
      thingLon: location[1],
    })
    setModalActive((prev) => !prev)
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

  // useEffect(() => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         setLocation([position.coords.latitude, position.coords.longitude])
  //       },
  //       (error) => {
  //         setLocation([55.74, 37.61])
  //         console.error('Error getting geolocation:', error)
  //       },
  //     )
  //   } else {
  //     console.error('Geolocation is not supported by this browser.')
  //   }
  // }, [])

  return (
    <form className={styles.main} encType='multipart/form-data'>
      <h1>Изменить данные о вещи</h1>
      <h5>Название</h5>
      <input
        type='text'
        name='thingName'
        value={inputs.thingName}
        onChange={(e) => void changeHandler(e)}
        placeholder='Введите заголовок'
      />
      <h5>Описание</h5>
      <input
        type='text'
        name='description'
        value={inputs.description}
        onChange={(e) => void changeHandler(e)}
        placeholder='Введите описание'
      />
      <h5>Категория</h5>
      <select
        name='categoryId'
        value={inputs.categoryId}
        onChange={(e) => void changeHandler(e)}
      >
        {categories.map((el) => (
          <option key={`opt-${el.id}}`} value={`${el.id}`}>
            {el.categoryTitle}
          </option>
        ))}
      </select>
      <h5>Фотографии</h5>
      <div className={`${styles.imgDiv}`}>
        {inputs.Photos.map((el) => (
          <span key={el.id} className={`${styles.imgSpan}`}>
            <img
              className={`${styles.littlePhoto}`}
              src={`${import.meta.env.VITE_THINGS}/${el.photoUrl}`}
              alt='Мини-фотки'
            />
            <button type='button' onClick={() => removePhoto(el.photoUrl)}>
              Удалить
            </button>
          </span>
        ))}
      </div>
      <h5>Добавить фотографии</h5>
      <input
        type='file'
        name='newPhotos'
        multiple
        ref={fileInputRef}
        accept='.jpg, .jpeg, .png'
      />
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
              center: [thing.thingLat, thing.thingLon],
              zoom: 15,
              controls: ['zoomControl', 'fullscreenControl'],
            }}
            state={{
              center: [thing.thingLat, thing.thingLon],
              zoom: 15,
              controls: ['zoomControl', 'fullscreenControl'],
            }}
          >
            <GeolocationControl options={{ float: 'left' }} />
            {address.length > 0 && (
              <Placemark
                onClick={() => console.log('click')}
                geometry={[thing.thingLat, thing.thingLon]}
                properties={{
                  balloonContentBody:
                    'This is balloon loaded by the Yandex.Maps API module system',
                }}
              />
            )}
          </Map>
          {address.length > 0 ? <p>{address}</p> : <p> </p>}
          <Button disabled={!address.length} onClick={() => handleAccept()}>
            Подтвердить локацию
          </Button>
        </>
      </Modal>
      {/* <Button onClick={() => handleAccept()}>Подтвердить локацию</Button> */}
      <button type='button' onClick={() => void updateThingInfo()}>
        Обновить данные
      </button>
    </form>
  )
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useRef, useState } from 'react'
import { GeolocationControl, Map, Placemark } from '@pbe/react-yandex-maps'
import axios from 'axios'
// import { useNavigate } from 'react-router-dom'
import styles from './NewThing.module.css'
import Button from '../../components/Controls/Button/Button'
import type { CategoryType } from '../../types'

export default function NewThing(): JSX.Element {
  const CategoryInitVal = { id: 0, categoryTitle: '' }

  const [location, setLocation] = useState<number[]>([])
  const [address, setAddress] = useState<string>('')
  const [categories, setCategories] = useState<CategoryType[]>([
    CategoryInitVal,
  ])

  const inirialFormsData = {
    thingName: '',
    description: '',
    categoryId: 0,
    thingAddress: '',
    thingLat: 0,
    thingLon: 0,
    isApproved: true,
  }
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState(inirialFormsData)

  useEffect(() => {
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
  //   // Ваша логика обработки выбранных файлов
  // }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>): void => {
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
    // event.preventDefault() // Предотвращаем стандартное действие кнопки (отправку формы)
    if (!fileInputRef.current.files.length)
      return console.log('please upload files')
    const data = new FormData() // Создаем новый объект FormData

    // Добавляем выбранные файлы в объект FormData
    const { files } = fileInputRef.current
    for (let i = 0; i < files.length; i += 1) {
      data.append('photo', files[i])
    }

    // Добавляем значения контролируемых инпутов в объект FormData
    for (const key in formData) {
      data.append(key, formData[key])
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/v1/things`,
        data,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data', // Устанавливаем правильный заголовок Content-Type
          },
        },
      )
      console.log('Ответ от сервера:', response.data)
      fileInputRef.current.value = null
      setFormData(inirialFormsData)
      // Отправляем форму через Axios

      // Сбрасываем значения инпута файлов

      // Сбрасываем значения контролируемых инпутов
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error)
    }
  }
  // console.log(categories)

  const handleClick = async (coords: number[]): Promise<void> => {
    const result = await axios.get(
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
    setFormData({
      ...formData,
      thingAddress: address,
      thingLat: location[0],
      thingLon: location[1],
    })
  }
  console.log(formData)

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
      <h5>Выберите фото</h5>
      <input
        ref={fileInputRef}
        type='file'
        name='photo'
        multiple
        // onChange={handleFileChange}
      />
      {/* <MyPlacemarkUpload /> */}
      <h5>Выберите локацию</h5>

      {/* {location.length > 0 && ( */}
      <Map
        onClick={(e) => handleClick(e.get('coords'))}
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
      {/* )} */}
      {address.length > 0 && <p>{address}</p>}
      {/* <Button color='good'>Загрузить</Button>
      <Button color='warning'>Загрузить</Button>
      <Button color='neutral'>Загрузить</Button>
      <Button color='danger'>Загрузить</Button> */}
      <Button onClick={() => handleAccept()}>Подтвердить локацию</Button>
      <Button onClick={() => void handleUploadClick()}>Загрузить</Button>
    </form>
  )
}

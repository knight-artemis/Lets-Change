/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useRef, useState } from 'react'
import {
  Clusterer,
  GeolocationControl,
  Map,
  Placemark,
} from '@pbe/react-yandex-maps'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import styles from './NewThing.module.css'
import Button from '../../components/Controls/Button/Button'
import Test from './Test'
import type { CategoryType } from '../../types'

const kazanCoordinates = [
  [55.7942, 49.1117],
  [55.7948, 49.1101],
  [55.7884, 49.1225],
  [55.7857, 49.1235],
  [55.7903, 49.1095],
  [55.7949, 49.1344],
  [55.7957, 49.1431],
  [55.7909, 49.1169],
  [55.7839, 49.1351],
  [55.7803, 49.1486],
  [55.7998, 49.1262],
  [55.7863, 49.1019],
  [55.8015, 49.1054],
  [55.8016, 49.1323],
  [55.8025, 49.1059],
  [55.7972, 49.1204],
  [55.8054, 49.1084],
  [55.8097, 49.0997],
  [55.8042, 49.1124],
  [55.7993, 49.1219],
  [55.8072, 49.1223],
  [55.8034, 49.1227],
  [55.7989, 49.1188],
  [55.8047, 49.1126],
  [55.8069, 49.1224],
  [55.7953, 49.1012],
  [55.7904, 49.1021],
  [55.7939, 49.1218],
  [55.7946, 49.1235],
  [55.7961, 49.1301],
  [55.7982, 49.1227],
  [55.7941, 49.1152],
  [55.7985, 49.1336],
  [55.8019, 49.1288],
  [55.8037, 49.1251],
  [55.7991, 49.1233],
  [55.7975, 49.1265],
  [55.7943, 49.1195],
  [55.8056, 49.1312],
  [55.8052, 49.1187],
  [55.7947, 49.1121],
  [55.7947, 49.1259],
  [55.8018, 49.1154],
  [55.8014, 49.1248],
  [55.7927, 49.1263],
  [55.7973, 49.1266],
  [55.7969, 49.1067],
  [55.8029, 49.1171],
  [55.812241, 49.181862],
  [55.812332, 49.182525],
  [55.812123, 49.181279],
  [55.812565, 49.182961],
  [55.812487, 49.181499],
  [55.812679, 49.182814],
  [55.812088, 49.182245],
  [55.812427, 49.181743],
  [55.812792, 49.181103],
  [55.812345, 49.182369],
  [55.812172, 49.181679],
  [55.812634, 49.181871],
  [55.812278, 49.182662],
  [55.812563, 49.18203],
  [55.812784, 49.182456],
  [55.812415, 49.182148],
  [55.812231, 49.181993],
  [55.812695, 49.181569],
  [55.812392, 49.182217],
  [55.812186, 49.182781],
]
const CategoryInitVal = { id: 0, categoryTitle: '' }

export default function NewThing(): JSX.Element {
  const [location, setLocation] = useState<number[]>([])
  const [address, setAddress] = useState<string>('')
  const [categories, setCategories] = useState<CategoryType[]>([
    CategoryInitVal,
  ])
  const navigate = useNavigate()

  const fileInputRef = useRef(null)
  const inirialFormsData = {
    thingName: '',
    description: '',
    categoryId: 0,
    thingAddress: '',
    thingLat: 0,
    thingLon: 0,
  }
  const [formData, setFormData] = useState(inirialFormsData)

  const handleFileChange = (event) => {
    // Ваша логика обработки выбранных файлов
  }

  const handleChange = (event) => {
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
    // console.log('FORM DATA',{ ...formData, thingAddress: address, thingLat: location[0], thingLon: location[1] })
    const data = new FormData() // Создаем новый объект FormData

    // Добавляем выбранные файлы в объект FormData
    const {files} = fileInputRef.current
    for (let i = 0; i < files.length; i++) {
      data.append('photo', files[i])
    }

    // Добавляем значения контролируемых инпутов в объект FormData
    for (const key in formData) {
      console.log(key, formData[key])
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
        onChange={handleChange}
        placeholder='Введите заголовок'
      />
      <h5>Добавьте описание</h5>
      <input
        type='text'
        name='description'
        value={formData.description}
        onChange={handleChange}
        placeholder='Введите описание'
      />
      <h5>Выберите категорию</h5>
      <select name='categoryId' value={formData.categoryId} onChange={handleChange}>
        {categories.map((el) => (
          <option key={`opt-${el.id}}`} value={`${el.id}`}>{el.categoryTitle}</option>
        ))}
      </select>
      <h5>Выберите длительность размещения</h5>
      <h5>Выберите фото</h5>
      <input
        ref={fileInputRef}
        type='file'
        name='photo'
        multiple
        onChange={handleFileChange}
      />
      {/* <TestUpload /> */}
      <h5>Выберите локацию</h5>

      {location.length > 0 && (
        <Map
          onClick={(e) => handleClick(e.get('coords'))}
          width='600px'
          height='500px'
          defaultState={{
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
          <Clusterer
            options={{
              preset: 'islands#invertedVioletClusterIcons',
              // groupByCoordinates: false,
            }}
          >
            {kazanCoordinates.map((coordinates, index) => (
              <Test
                key={index}
                coord={coordinates}
                onClick={() => navigate('/')}
              />
            ))}
          </Clusterer>
        </Map>
      )}
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

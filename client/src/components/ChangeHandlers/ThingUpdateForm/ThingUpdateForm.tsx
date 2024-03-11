import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import type { CategoryType, ThingType } from '../../../types'
import styles from './ThingUpdateForm.module.css'

export default function ThingUpdateForm({
  thingId,
  initialThing,
}: {
  thingId: number
  initialThing: ThingType
}): JSX.Element {
  const CategoryInitVal = { id: 0, categoryTitle: '' }
  const [categories, setCategories] = useState<CategoryType[]>([
    CategoryInitVal,
  ])

  const [inputs, setInputs] = useState<ThingType>(initialThing)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchThingInfo = async (): Promise<void> => {
      try {
        const response = await axios.get<ThingType>(
          `${import.meta.env.VITE_API}/v1/things/${thingId}`,
          {
            withCredentials: true,
          },
        )
        setInputs(response.data)
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
  }, [thingId])

  useEffect(() => {
    console.log(inputs)
  }, [inputs])

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

  // const updateThingInfo = async (): Promise<void> => {}

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
      <h5>Категория категорию</h5>
      <select
        name='categoryId'
        value={inputs.categoryId}
        // onChange={(e) => void changeHandler(e)}
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
          <span className={`${styles.imgSpan}`}>
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
        name='photo'
        multiple
        ref={fileInputRef}
        accept='.jpg, .jpeg, .png'
      />
      <h5>Выберите локацию</h5>

      {/* <Button onClick={() => handleAccept()}>Подтвердить локацию</Button> */}
      <button type='button'>Обновить данные</button>
    </form>
  )
}

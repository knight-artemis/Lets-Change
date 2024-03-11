import axios from 'axios'
import type { Dispatch, SetStateAction } from 'react'
import React, { useState } from 'react'
import type { CategoryType, ThingType } from '../../types'
import Button from '../../components/Shared/Button/Button'
import Input from '../../components/Shared/Input/Input'

type CardPropsType = {
  thing: ThingType
  setThings: Dispatch<SetStateAction<ThingType[]>>
  categories: CategoryType[]
}

export default function Card({
  thing,
  setThings,
  categories,
}: CardPropsType): JSX.Element {
  const [issue, setIssue] = useState('')

  const changeIssueHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setIssue(e.target.value)
  }

  const acceptHandler = async (id: number): Promise<void> => {
    try {
      await axios.patch<ThingType>(
        `${import.meta.env.VITE_API}/v1/admin/accept/${id}`,
        {},
        { withCredentials: true },
      )
      setThings((prev) => prev.filter((el) => el.id !== id))
    } catch (error) {
      console.log(error)
    }
  }

  const rejectHandler = async (id: number): Promise<void> => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API}/v1/admin/reject/${id}`,
        { issue, oldIssue: thing.issue },
        { withCredentials: true },
      )
      setThings((prev) => prev.filter((el) => el.id !== id))
    } catch (error) {
      console.log(error)
    }
  }
//   console.log(thing)
  return (
    <div>
      <p>название: {thing.thingName}</p>
      <p>Описание: {thing.description}</p>
      <p>
        Категория:{' '}
        {categories.find((el) => el.id === thing.categoryId)?.categoryTitle}
      </p>
      <p>Заменчание: {thing.issue}</p>
      {thing.Photos.length > 0 &&
        thing.Photos.map((photo) => (
          <img
            key={`photo-${photo.id}`}
            style={{ width: '100px', height: '100px' }}
            src={`${import.meta.env.VITE_THINGS}/${photo.photoUrl}`}
            alt='фотка-шмотка'
          />
        ))}
      <Button color='good' onClick={() => void acceptHandler(thing.id)}>
        Подтвердить
      </Button>
      <Input
        onChange={(e) => changeIssueHandler(e)}
        type='text'
        name='issue'
        value={issue}
      />
      <Button color='danger' onClick={() => void rejectHandler(thing.id)}>
        Отказать
      </Button>
    </div>
  )
}

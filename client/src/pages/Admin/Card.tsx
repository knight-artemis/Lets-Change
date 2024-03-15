import axios from 'axios'
import type { Dispatch, SetStateAction } from 'react'
import React, { useState } from 'react'
import type { CategoryType, ThingType } from '../../types'
import Button from '../../components/Shared/Button/Button'
import Input from '../../components/Shared/Input/Input'
import styles from './Card.module.css'
import Modal from '../../components/Widgets/Modal/Modal'

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
  const [isOpen, setIsOpen] = useState(true)

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
    <div className={styles.main}>
      <div className={styles.inline}>
        <h3>{thing.thingName}</h3>
        <p>
          {categories.find((el) => el.id === thing.categoryId)?.categoryTitle}
        </p>
      </div>
      <p>
        {thing.description.length > 120
          ? `${thing.description.slice(0, 120)}...`
          : thing.description}
      </p>
      <div className={styles.photos}>
        {thing.Photos.length > 0 &&
          thing.Photos.map((photo) => (
            <img
              key={`photo-${photo.id}`}
              style={{ width: 'auto', height: '150px' }}
              src={`${import.meta.env.VITE_THINGS}/${photo.photoUrl}`}
              alt='фотка-шмотка'
            />
          ))}
      </div>
      <div className={styles.btns}>
        <Button color='good' onClick={() => void acceptHandler(thing.id)}>
          Подтвердить
        </Button>
        <div className={styles.reject}>
          <textarea
            className={styles.textarea}
            onChange={(e) => changeIssueHandler(e)}
            name='issue'
            value={issue}
            placeholder='Введите причину отказа'
            rows={3}
          />
          <Button color='danger' onClick={() => void rejectHandler(thing.id)}>
            Отказать
          </Button>
        </div>
      </div>
    </div>
  )
}

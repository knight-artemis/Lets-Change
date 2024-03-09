import type { ChangeEvent } from 'react'
import React, { useState } from 'react'
import type { UserType } from '../../types'
import style from './InitialsChangeForm.module.css'
import { useAppDispatch } from '../../redux/hooks'
import { fetchUpd } from '../../redux/user/userThunkActions'

export default function InitialsChangeForm({
  user,
  setActive,
}: {
  user: UserType
  setActive: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element {
  const dispatch = useAppDispatch()

  const initialState = {
    lastName: user?.lastName || '',
    firstName: user?.firstName || '',
    middleName: user?.middleName || '',
  }

  type ShortUserType = {
    lastName: string
    firstName: string
    middleName: string
  }

  const [input, setInput] = useState<ShortUserType>(initialState)

  const changeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setInput((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  const changeInitials = async (): Promise<void> => {
    const updUser = {
      ...user,
      lastName: input.lastName,
      firstName: input.firstName,
      middleName: input.middleName,
    }
    try {
      console.log('changeInitials сработал')
      await dispatch(fetchUpd(updUser))
      setActive((prev) => !prev)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={`${style.form}`}>
      <h3>ФИО</h3>
      <span>
        Фамилия
        <input
          type='text'
          name='lastName'
          onChange={changeHandler}
          value={input.lastName}
        />
      </span>
      <span>
        Имя
        <input
          type='text'
          name='firstName'
          onChange={changeHandler}
          value={input.firstName}
        />
      </span>
      <span>
        Отчество
        <input
          type='text'
          name='middleName'
          onChange={changeHandler}
          value={input.middleName}
        />
      </span>
      <button type='button' onClick={() => void changeInitials()}>
        Сохранить изменения
      </button>
    </div>
  )
}

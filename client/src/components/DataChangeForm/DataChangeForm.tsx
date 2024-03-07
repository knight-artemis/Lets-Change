import type { ChangeEvent } from 'react'
import React, { useState } from 'react'
import type { UserType } from '../../types'
import style from './DataChangeForm.module.css'

export default function DataChangeForm({user}: {user: UserType}): JSX.Element {
  
  const initialState = {
    lastName: user?.lastName || '',
    firstName: user?.firstName || '',
    middleName: user?.middleName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  }

  type ShortUserType = {
    lastName: string
    firstName: string
    middleName: string
    email: string
    phone: string
  }

  const [input, setInput] = useState<ShortUserType>(initialState)

  const changeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setInput((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  return (
    <div className={`${style.form}`}>
      <span>
        Фамилия
        <input
          type='text'
          name=''
          id=''
          onChange={changeHandler}
          defaultValue={user?.lastName}
        />
      </span>
      <span>
        Имя
        <input
          type='text'
          name=''
          id=''
          onChange={changeHandler}
          defaultValue={user?.firstName}
        />
      </span>
      <span>
        Отчество
        <input
          type='text'
          name=''
          id=''
          onChange={changeHandler}
          defaultValue={user?.middleName}
        />
      </span>
      <span>
        Почта
        <input
          type='text'
          name=''
          id=''
          onChange={changeHandler}
          defaultValue={user?.email}
        />
      </span>
      <span>
        Телефон
        <input
          type='text'
          name=''
          id=''
          onChange={changeHandler}
          defaultValue={user?.phone}
        />
      </span>
      <button type='button'>Изменить данные</button>
    </div>
  )
}

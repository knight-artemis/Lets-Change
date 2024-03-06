import type { ChangeEvent } from 'react'
import React, { useState } from 'react'
import type { UserType } from '../../types'

export default function DataChangeForm({user}: {user: UserType}): JSX.Element {
  
  const initialState = {
    lastName: user?.lastName || '',
    firstName: user?.firstName || '',
    middleName: user?.middleName || '',
    email: user?.email || '',
    userAddress: user?.userAddress || '',
    phone: user?.phone || '',
  }

  type ShortUserType = {
    lastName: string
    firstName: string
    middleName: string
    email: string
    userAddress: string
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
    <div>
      <form action=''>
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
          Адрес
          <input
            type='text'
            name=''
            id=''
            onChange={changeHandler}
            defaultValue={user?.userAddress}
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
      </form>
    </div>
  )
}

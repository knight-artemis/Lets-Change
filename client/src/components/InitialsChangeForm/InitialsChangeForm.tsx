import type { ChangeEvent } from 'react'
import React, { useState } from 'react'
import type { UserType } from '../../types'
import style from './InitialsChangeForm.module.css'

export default function InitialsChangeForm({ user }: { user: UserType }): JSX.Element {
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

  return (
    <div className={`${style.form}`}>
      <h3>ФИО</h3>
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
      <button type='button'>Сохранить изменения</button>
    </div>
  )
}

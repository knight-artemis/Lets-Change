import React, { useState } from 'react'
import type { ChangeEvent } from 'react'
import type { UserType } from '../../types'
import style from './PhoneChangeForm.module.css'

export default function PhoneChahgeForm({
  user,
}: {
  user: UserType
}): JSX.Element {
  type DataType = {
    phone: string
  }

  const initialState = {
    phone: user.phone
  }

  const [input, setInput] = useState<DataType>(initialState)

  const changeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setInput((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  return (
    <div className={`${style.form}`}>
      <h3>Телефон</h3>
        <input
          type='text'
          name=''
          id=''
          onChange={changeHandler}
          defaultValue={user?.phone}
        />
        <button type='button'>Сохранить телефон</button>
    </div>
  )
}

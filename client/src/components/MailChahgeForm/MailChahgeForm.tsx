import React, { useState } from 'react'
import type { ChangeEvent } from 'react'
import type { UserType } from '../../types'
import style from './MailChahgeForm.module.css'

export default function MailChahgeForm({ user }: { user: UserType }): JSX.Element {

  type DataType = {
    email: string
  }

  const initialState = {
    email: user.email
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
      <h3>Почта</h3>
      <input
        type='text'
        name=''
        id=''
        onChange={changeHandler}
        defaultValue={user?.email}
      />
      <button type='button'>Сохранить почту</button>
    </div>
  )
}

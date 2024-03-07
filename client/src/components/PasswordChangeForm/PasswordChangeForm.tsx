import React, { useState } from 'react'
import type { ChangeEvent } from 'react'
import style from './PasswordChangeForm.module.css'

export default function PasswordChangeForm(): JSX.Element {
  type PasswordChangeType = {
    oldPassword: string
    newPassword: string
    repitePassword: string
  }

  const initialState = {
    oldPassword: '',
    newPassword: '',
    repitePassword: '',
  }

  const [input, setInput] = useState<PasswordChangeType>(initialState)

  const changeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setInput((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  return (
    <div className={`${style.form}`}>
      <span>
        Старый пароль
        <input type='password' name='' id='' onChange={() => changeHandler} />
      </span>
      <span>
        Новый пароль пароль
        <input type='password' name='' id='' onChange={() => changeHandler} />
      </span>
      <span>
        Повторите пароль
        <input type='password' name='' id='' onChange={() => changeHandler} />
          </span>
          <button type='button'>Изменить пароль</button>
    </div>
  )
}

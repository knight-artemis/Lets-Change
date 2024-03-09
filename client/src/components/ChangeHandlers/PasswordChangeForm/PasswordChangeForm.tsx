import React, { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import style from './PasswordChangeForm.module.css'
import type { UserType } from '../../../types'

export default function PasswordChangeForm({
  setActive,
}: {setActive: React.Dispatch<React.SetStateAction<boolean>>}): JSX.Element {
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

  const changePass = async (): Promise<void> => {
    if (input.newPassword === input.repitePassword) {
      axios
        .put<PasswordChangeType, AxiosResponse<UserType>>(
          `${import.meta.env.VITE_API}/v1/user/passUpd`,
          input,
          { withCredentials: true },
        )
        .then((res) => console.log(res))
        .then(() => setActive((prev) => !prev))
        .catch((err) => console.log(err))
    } else {
      console.log('Пароли не совпадают')
    }
  }

  return (
    <div className={`${style.form}`}>
      <h3>Изменение пароля</h3>
      <span>
        Старый пароль
        <input
          type='password'
          name='oldPassword'
          onChange={changeHandler}
          value={input.oldPassword}
        />
      </span>
      <span>
        Новый пароль пароль
        <input
          type='password'
          name='newPassword'
          onChange={changeHandler}
          value={input.newPassword}
        />
      </span>
      <span>
        Повторите пароль
        <input
          type='password'
          name='repitePassword'
          onChange={changeHandler}
          value={input.repitePassword}
        />
      </span>
      <button type='button' onClick={() => void changePass()}>
        Изменить пароль
      </button>
    </div>
  )
}

import axios from 'axios'
import React, { useState } from 'react'
import type { ChangeEvent } from 'react'
import type { SetProps } from '../../types'

export default function ForgetPassForm({ setActive }: SetProps): JSX.Element {
  type EmailType = {
    email: string
  }

  const initialValue = {
    email: '',
  }

  const [input, setInput] = useState<EmailType>(initialValue)

  const changeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setInput((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  const resetPassword = async (): Promise<void> => {
    axios
      .post<EmailType>(`${import.meta.env.VITE_API}/v1/user/resetpass`, input, {
        withCredentials: true,
      })
      .then((res) => console.log(res))
      .then(() => setActive((prev) => !prev))
      .catch((err) => console.log(err))
  }

  return (
    <>
      <div>Введите почтовый адрес, привязанный к профилю</div>
      <input
        type='email'
        name='email'
        onChange={changeHandler}
        value={input.email}
      />
      <button type='button' onClick={() => void resetPassword()}>
        Запросить временный пароль
      </button>
    </>
  )
}

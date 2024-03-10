import axios from 'axios'
import React, { useState } from 'react'
import type { ChangeEvent } from 'react'
import type { SetProps } from '../../../types'
import { notifySuccess, notifyWarning } from '../../../toasters'

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
    const checkMail = await axios.post(
      `${import.meta.env.VITE_API}/v1/auth/checkmail`,
      { email: input.email },
      {
        withCredentials: true,
      },
    )
    if (
      !/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
        input.email,
      )
    ) {
      notifyWarning('Неверный формат почты.')
    } else if (!checkMail.data) {
      notifyWarning('Пользователя с таким почтовым адресом не существует.')
    } else {
      axios
        .post<EmailType>(
          `${import.meta.env.VITE_API}/v1/user/resetpass`,
          input,
          {
            withCredentials: true,
          },
        )
        .then((res) => console.log(res))
        .then(() => setActive((prev) => !prev))
        .then(() => notifySuccess('Временный пароль был направлен на вашу почту.'))
        .catch((err) => console.log(err))
    }
  }

  return (
    <>
      <div>Укажите почтовый адрес, привязанный к профилю</div>
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

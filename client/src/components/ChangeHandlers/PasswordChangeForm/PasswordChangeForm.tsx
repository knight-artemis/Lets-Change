import React, { useState } from 'react'
import type { ChangeEvent } from 'react'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import style from './PasswordChangeForm.module.css'
import type { UserType } from '../../../types'
import { notifySuccess, notifyWarning } from '../../../toasters'

export default function PasswordChangeForm({
  user,
  setActive,
}: {
  user: UserType
  setActive: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element {
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
    const checkPass = await axios.post(
      `${import.meta.env.VITE_API}/v1/auth/checkPass`,
      {
        email: user.email,
        password: input.oldPassword,
      },
      {
        withCredentials: true,
      },
    )

    console.log(checkPass.data, 'Я чекпасс')

    try {
      if (!input.oldPassword || !input.oldPassword || !input.oldPassword) {
        notifyWarning('Пожалуйста, заполните все поля.')
      } else if (!checkPass.data) {
        notifyWarning('Введенный старый пароль неверен.')
      } else if (
        !/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()-_+=;:,./?|`~[]{}]).*$/.test(
          input.newPassword,
        )
      ) {
        notifyWarning(
          'Новый пароль должен быть не менее 8 символов длинной, содержать в себе как минимум 1 цифру и 1 символ.',
        )
      } else if (input.newPassword !== input.repitePassword) {
        notifyWarning('Введенные пароли не совпадают.')
      } else if (input.newPassword === input.repitePassword) {
        axios
          .put<PasswordChangeType, AxiosResponse<UserType>>(
            `${import.meta.env.VITE_API}/v1/user/passUpd`,
            input,
            { withCredentials: true },
          )
          .then((res) => console.log(res))
          .then(() => setActive((prev) => !prev))
          .then(() => notifySuccess('Пароль был успешно изменен.'))
          .catch((err) => console.log(err))
      } else {
        console.log('Пароли не совпадают')
      }
    } catch (error) {
      console.log(error)
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

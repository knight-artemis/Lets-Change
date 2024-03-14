import type { ChangeEvent } from 'react'
import React, { useState } from 'react'
import type { UserType } from '../../../types'
import style from './InitialsChangeForm.module.css'
import { useAppDispatch } from '../../../redux/hooks'
import { fetchUpd } from '../../../redux/user/userThunkActions'
import { notifySuccess, notifyWarning } from '../../../toasters'
import Button from '../../Shared/Button/Button'
import Input from '../../Shared/Input/Input'

export default function InitialsChangeForm({
  user,
  setActive,
}: {
  user: UserType
  setActive: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element {
  const dispatch = useAppDispatch()

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

  const changeInitials = async (): Promise<void> => {
    const updUser = {
      ...user,
      lastName: input.lastName,
      firstName: input.firstName,
      middleName: input.middleName,
    }
    try {
      if (!input.firstName) {
        notifyWarning('Вы не можете удалить свое имя')
      } else if (
        input.firstName &&
        !/^[a-zA-Zа-яА-Я0-9]{3,}$/.test(input.firstName)
      ) {
        notifyWarning(
          'Ваше имя должно быть не короче 3 символов и не должно содержать специальных символов.',
        )
      } else if (
        input.lastName &&
        !/^[a-zA-Zа-яА-Я0-9]{3,}$/.test(input.lastName)
      ) {
        notifyWarning(
          'Ваша фамилия должна быть не короче 3 символов и не должна содержать специальных символов.',
        )
      } else if (
        input.middleName &&
        !/^[a-zA-Zа-яА-Я0-9]{3,}$/.test(input.middleName)
      ) {
        notifyWarning(
          'Ваше отчество должно быть не короче 3 символов и не должно содержать специальных символов.',
        )
      } else {
        await dispatch(fetchUpd(updUser))
        setActive((prev) => !prev)
        notifySuccess('Данные были успешно обновлены.')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={style.wrapper}>
      <h3>ФИО</h3>
      <div className={`${style.form}`}>
        <span>
          Фамилия
          <Input
            type='text'
            name='lastName'
            onChange={changeHandler}
            value={input.lastName}
          />
        </span>
        <span>
          Имя
          <Input
            type='text'
            name='firstName'
            onChange={changeHandler}
            value={input.firstName}
          />
        </span>
        <span>
          Отчество
          <Input
            type='text'
            name='middleName'
            onChange={changeHandler}
            value={input.middleName}
          />
        </span>
        <Button onClick={() => void changeInitials()}>
          Сохранить изменения
        </Button>
      </div>
    </div>
  )
}

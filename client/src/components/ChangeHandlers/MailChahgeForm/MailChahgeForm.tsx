import React, { useState } from 'react'
import type { ChangeEvent } from 'react'
import type { UserType } from '../../../types'
import style from './MailChahgeForm.module.css'
import { useAppDispatch } from '../../../redux/hooks'
import { fetchUpd } from '../../../redux/user/userThunkActions'

export default function MailChahgeForm({
  user,
  setActive,
}: {
  user: UserType
  setActive: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element {
  const dispatch = useAppDispatch()

  type DataType = {
    email: string
  }

  const initialState = {
    email: user.email,
  }

  const [input, setInput] = useState<DataType>(initialState)

  const changeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setInput((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  const changeEmail = async (): Promise<void> => {
    const updUser = {
      ...user,
      email: input.email,
    }
    console.log('🚀 ~ changeInitials ~ updUser:', updUser)
    try {
      console.log('changeInitials сработал')
      await dispatch(fetchUpd(updUser))
      setActive((prev) => !prev)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={`${style.form}`}>
      <h3>Почта</h3>
      <input
        type='text'
        name='email'
        onChange={changeHandler}
        value={input.email}
      />
      <button type='button' onClick={() => void changeEmail()}>
        Сохранить почту
      </button>
    </div>
  )
}

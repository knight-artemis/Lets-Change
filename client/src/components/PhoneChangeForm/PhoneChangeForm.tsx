import React, { useState } from 'react'
import type { ChangeEvent } from 'react'
import type { UserType } from '../../types'
import style from './PhoneChangeForm.module.css'
import { useAppDispatch } from '../../redux/hooks'
import { fetchUpd } from '../../redux/user/userThunkActions'

export default function PhoneChahgeForm({
  user,
}: {
  user: UserType
  }): JSX.Element {
  
  const dispatch = useAppDispatch()
  
  type DataType = {
    phone: string
  }

  const initialState = {
    phone: user?.phone || ''
  }

  const [input, setInput] = useState<DataType>(initialState)

  const changeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setInput((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

    const changePhone = async (): Promise<void> => {
      const updUser = {
        ...user,
        phone: input.phone,
      }
      console.log('🚀 ~ changeInitials ~ updUser:', updUser)
      try {
        console.log('changeInitials сработал')
        await dispatch(fetchUpd(updUser))
      } catch (error) {
        console.log(error)
      }
    }

  return (
    <div className={`${style.form}`}>
      <h3>Телефон</h3>
      <input
        type='text'
        name='phone'
        onChange={changeHandler}
        value={input.phone}
      />
      <button type='button' onClick={() => void changePhone()}>
        Сохранить телефон
      </button>
    </div>
  )
}

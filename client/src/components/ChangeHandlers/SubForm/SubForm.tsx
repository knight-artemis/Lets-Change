import React, { ChangeEvent, useEffect, useState } from 'react'
import style from './SubForm.module.css'
import type { UserType } from '../../../types'
import { useAppDispatch } from '../../../redux/hooks'
import { fetchUpd } from '../../../redux/user/userThunkActions'

export default function SubForm({
  user,
  setActive,
}: {
  user: UserType
  setActive: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element {
  const dispatch = useAppDispatch()

  const [input, setInput] = useState<number>(0)

  const calculateEndDate = (type: number): Date => {
    const endDate = new Date()
    let daysNum = 0
    if (type === 1) {
      daysNum = 14
    } else if (type === 2) {
      daysNum = 30
    } else if (type === 3) {
      daysNum = 90
    } else if (type === 4) {
      daysNum = 180
    } else if (type === 5) {
      daysNum = 365
    }
    endDate.setDate(endDate.getDate() + daysNum)
    return endDate
  }

  const subscribe = async (): Promise<void> => {
    const updUser = {
      ...user,
      subExp: calculateEndDate(input),
    }
    try {
      console.log('changeInitials сработал')
      await dispatch(fetchUpd(updUser))
      setActive((prev) => !prev)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    console.log(input)
  }, [input])

const changeHandler = (event: ChangeEvent<HTMLSelectElement>): void => {
  setInput(parseInt(event.target.value, 10))
}

  const subPrice = (subStat: number): number => {
    let price = 0
    if (subStat === 1) {
      price = 500
    } else if (subStat === 2) {
      price = 1000
    } else if (subStat === 3) {
      price = 2000
    } else if (subStat === 4) {
      price = 3000
    } else price = 5000
    return price
  }
  return (
    <div className={`${style.form}`}>
      <h3>Оформить подписку</h3>
      <select name='subduration'>
        value ={input}
        onChange={(e) => void changeHandler(e)}
        <option value='' disabled selected hidden>
          Продолжительность подписки
        </option>
        <option value='1'>2 недели</option>
        <option value='2'>1 месяц</option>
        <option value='3'>3 месяца</option>
        <option value='4'>6 месяцев</option>
        <option value='5'>1 год</option>
      </select>
      <span>Стоимость подписки: {subPrice(input)} </span>
      <button type='button'>Оплатить подписку</button>
    </div>
  )
}

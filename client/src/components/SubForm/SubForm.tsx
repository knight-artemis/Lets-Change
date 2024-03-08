import React from 'react'
import style from './SubForm.module.css'

export default function SubForm(): JSX.Element {
  return (
    <div className={`${style.form}`}>
      <h3>Оформить подписку</h3>
      <select name='subStatus'>
        <option value='' disabled selected hidden>
          Уровень подписки
        </option>
        <option value='1'>1</option>
        <option value='2'>2</option>
        <option value='3'>3</option>
        <option value='4'>4</option>
        <option value='5'>5</option>
      </select>
      <select name='subduration'>
        <option value='' disabled selected hidden>
          Продолжительность подписки
        </option>
        <option value='1'>2 недели</option>
        <option value='2'>1 месяц</option>
        <option value='3'>3 месяца</option>
        <option value='4'>6 месяцев</option>
          </select>
          <span>Стоимость подписки: </span>
      <button type='button'>Оплатить подписку</button>
    </div>
  )
}

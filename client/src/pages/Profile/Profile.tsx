import React, { useEffect } from 'react'
import styles from './Profile.module.css'
import { useAppSelector } from '../../redux/hooks'

export default function Profile(): JSX.Element {

  const user = useAppSelector((store) => store.userSlice.user)

  return (
    <div className={styles.main}>
      <div className={styles.userInfo}>
        <h2>Информация о пользователе</h2>
        <img className={styles.avatar} src={user.avatarUrl} alt='' />
        <button type='button'>Изменить аватар</button>
        <span>
          ФИО: {user?.lastName} {user?.middleName} {user?.firstName}
        </span>
        <span>Почта: {user?.email}</span>
        <span>Адрес: {user?.userAddress}</span>
        <span>Телефон: {user?.phone}</span>
        <button type='button'>Изменить</button>
        <button type='button'>Изменить пароль</button>
      </div>
      <div className={styles.commonInfo}>
        <h2>Прочие данные:</h2>
        <span>Общее количество вещей:</span>
        <span>Количество совершенных обменов:</span>
        <span>Количество вещей, переданных на благотворительность:</span>
        <span>Статус подписки:</span>
        <span>Рейтинг пользователя:</span>
      </div>
    </div>
  )
}

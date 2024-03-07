import React, { useState } from 'react'
import styles from './Profile.module.css'
import { useAppSelector } from '../../redux/hooks'
import Modal from '../../components/Modal/Modal'
import DataChangeForm from '../../components/DataChangeForm/DataChangeForm'
import PasswordChangeForm from '../../components/PasswordChangeForm/PasswordChangeForm'
import AvatarChangeForm from '../../components/AvatarChangeForm/AvatarChangeForm'

export default function Profile(): JSX.Element {
  const [modalActive1, setModalActive1] = useState<boolean>(true)
  const [modalActive2, setModalActive2] = useState<boolean>(true)
  const [modalActive3, setModalActive3] = useState<boolean>(true)

  const user = useAppSelector((store) => store.userSlice.user)

  return (
    <div className={styles.main}>
      <div className={styles.userInfo}>
        <h2>Информация о пользователе</h2>
        <img className={styles.avatar} src={user.avatarUrl} alt='' />
        <button type='button' onClick={() => setModalActive1((prev) => !prev)}>
          Изменить аватар
        </button>
        <Modal active={modalActive1} setActive={setModalActive1}>
          <AvatarChangeForm />
        </Modal>
        <span>
          ФИО: {user?.lastName} {user?.middleName} {user?.firstName}
        </span>
        <span>Почта: {user?.email}</span>
        <span>Адрес: {user?.userAddress}</span>
        <span>Телефон: {user?.phone}</span>
        <button type='button' onClick={() => setModalActive2((prev) => !prev)}>
          Изменить данные
        </button>
        <Modal active={modalActive2} setActive={setModalActive2}>
          <DataChangeForm user={user} />
        </Modal>
        <button type='button' onClick={() => setModalActive3((prev) => !prev)}>
          Изменить пароль
        </button>
        <Modal active={modalActive3} setActive={setModalActive3}>
          <PasswordChangeForm />
        </Modal>
      </div>
      <div className={styles.commonInfo}>
        <h2>Прочие данные</h2>
        <span>Общее количество вещей: {user?.thingsCount}</span>
        <span>Количество совершенных обменов: {user?.dealsCount}</span>
        <span>
          Количество вещей, переданных на благотворительность:{' '}
          {user?.charityCount}
        </span>
        <span>Статус подписки:</span>
        <span>Рейтинг пользователя: {user?.rating}</span>
      </div>
    </div>
  )
}

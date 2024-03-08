import React, { useState } from 'react'
import styles from './Profile.module.css'
import { useAppSelector } from '../../redux/hooks'
import Modal from '../../components/Modal/Modal'
import PasswordChangeForm from '../../components/PasswordChangeForm/PasswordChangeForm'
import AvatarChangeForm from '../../components/AvatarChangeForm/AvatarChangeForm'
import MailChahgeForm from '../../components/MailChahgeForm/MailChahgeForm'
import PhoneChahgeForm from '../../components/PhoneChangeForm/PhoneChangeForm'
import InitialsChangeForm from '../../components/InitialsChangeForm/InitialsChangeForm'
import AddressChangeForm from '../../components/AddressChangeForm/AddressChangeForm'
import SubForm from '../../components/SubForm/SubForm'

export default function Profile(): JSX.Element {
  const [modalActive1, setModalActive1] = useState<boolean>(true)
  const [modalActive2, setModalActive2] = useState<boolean>(true)
  const [modalActive3, setModalActive3] = useState<boolean>(true)
  const [modalActive4, setModalActive4] = useState<boolean>(true)
  const [modalActive5, setModalActive5] = useState<boolean>(true)
  const [modalActive6, setModalActive6] = useState<boolean>(true)
  const [modalActive7, setModalActive7] = useState<boolean>(true)

  const user = useAppSelector((store) => store.userSlice.user)

  //! Разобратся с парсингом даты окончания подписки и определиться, как мы ее будет отображать (только дату или дней до окончания и т.д.)

  return (
    <div className={styles.main}>
      <div className={styles.userInfo}>
        <h2>Информация о пользователе</h2>
        <div className={styles.avatarDiv}>
          {user.avatarUrl ? (
            <div>
              <button
                type='button'
                onClick={() => setModalActive1((prev) => !prev)}
              >
                Изменить аватар
              </button>
              <img className={styles.avatar} src={user.avatarUrl} alt='' />
            </div>
          ) : (
            <button
              type='button'
              onClick={() => setModalActive1((prev) => !prev)}
            >
              Добавить аватар
            </button>
          )}
          <Modal active={modalActive1} setActive={setModalActive1}>
            <AvatarChangeForm />
          </Modal>
        </div>
        {user.lastName && user.middleName && user.firstName ? (
          <span>
            ФИО: {user?.lastName} {user?.middleName} {user?.firstName}
            <button
              type='button'
              onClick={() => setModalActive2((prev) => !prev)}
            >
              Изменить ФИО
            </button>
          </span>
        ) : (
          <span>
            ФИО: {user?.lastName} {user?.middleName} {user?.firstName}
            <button
              type='button'
              onClick={() => setModalActive2((prev) => !prev)}
            >
              Дополнить{' '}
            </button>
          </span>
        )}
        <Modal active={modalActive2} setActive={setModalActive2}>
          <InitialsChangeForm user={user} />
        </Modal>
        <span>
          Почта:
          {user?.email}
          <button
            type='button'
            onClick={() => setModalActive3((prev) => !prev)}
          >
            Изменить почту
          </button>
        </span>
        <Modal active={modalActive3} setActive={setModalActive3}>
          <MailChahgeForm user={user} />
        </Modal>
        {user.phone ? (
          <span>
            Телефон: {user?.phone}
            <button
              type='button'
              onClick={() => setModalActive4((prev) => !prev)}
            >
              Изменить телефон
            </button>
          </span>
        ) : (
          <span>
            <button
              type='button'
              onClick={() => setModalActive4((prev) => !prev)}
            >
              {' '}
              Добавить телефон{' '}
            </button>
          </span>
        )}
        <Modal active={modalActive4} setActive={setModalActive4}>
          <PhoneChahgeForm user={user} />
        </Modal>
        {user.userAddress ? (
          <span>
            Адрес: {user?.userAddress}
            <button
              type='button'
              onClick={() => setModalActive5((prev) => !prev)}
            >
              {' '}
              Изменить Адрес
            </button>
          </span>
        ) : (
          <span>
            <button
              type='button'
              onClick={() => setModalActive5((prev) => !prev)}
            >
              {' '}
              Добавить адрес{' '}
            </button>
          </span>
        )}
        <Modal active={modalActive5} setActive={setModalActive5}>
          <AddressChangeForm />
        </Modal>
        <button type='button' onClick={() => setModalActive6((prev) => !prev)}>
          Изменить пароль
        </button>
        <Modal active={modalActive6} setActive={setModalActive6}>
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
        {/* <span>Статус подписки:</span> */}
        <span>
          {user.subStatus ? (
            <>
              Статус подписки: Ваш уровень подписки {user.subStatus}, она
              истекает {user.subExp}.
            </>
          ) : (
            <>
              Статус подписки: подписка не активна.
              <button
                type='button'
                onClick={() => setModalActive7((prev) => !prev)}
              >
                Оформить подписку
              </button>
            </>
          )}
        </span>
        <Modal active={modalActive7} setActive={setModalActive7}>
          <SubForm />
        </Modal>
        <span>Рейтинг пользователя: {user?.rating}</span>
      </div>
    </div>
  )
}

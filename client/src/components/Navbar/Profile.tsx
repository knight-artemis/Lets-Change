import React, { useEffect, useState } from 'react'
import axios from 'axios'
import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import styles from './Profile.module.css'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import Modal from '../Widgets/Modal/Modal'
import PasswordChangeForm from '../ChangeHandlers/PasswordChangeForm/PasswordChangeForm'
import AvatarChangeForm from '../ChangeHandlers/AvatarChangeForm/AvatarChangeForm'
import MailChahgeForm from '../ChangeHandlers/MailChahgeForm/MailChahgeForm'
import PhoneChahgeForm from '../ChangeHandlers/PhoneChangeForm/PhoneChangeForm'
import InitialsChangeForm from '../ChangeHandlers/InitialsChangeForm/InitialsChangeForm'
import AddressChangeForm from '../ChangeHandlers/AddressChangeForm/AddressChangeForm'
import {
  fetchGetNot,
  fetchLogout,
  fetchUpd,
} from '../../redux/user/userThunkActions'
import type { UserType } from '../../types'
import Avatar from '../Widgets/Avatar/Avatar'
import SideBar from '../PageSkeleton/SideBar/SideBar'
import Button from '../Shared/Button/Button'
import { notifySuccess, notifyWarning } from '../../toasters'

export default function Profile({
  isOpen,
  setlk,
}: {
  isOpen: boolean
  setlk: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [modalActive1, setModalActive1] = useState<boolean>(true)
  const [modalActive2, setModalActive2] = useState<boolean>(true)
  const [modalActive3, setModalActive3] = useState<boolean>(true)
  const [modalActive4, setModalActive4] = useState<boolean>(true)
  const [modalActive5, setModalActive5] = useState<boolean>(true)
  const [modalActive6, setModalActive6] = useState<boolean>(true)
  const [modalActive7, setModalActive7] = useState<boolean>(true)

  const user = useAppSelector((store) => store.userSlice.user)
  useEffect(() => {
    dispatch(fetchGetNot())
      .then()
      .catch((err) => console.log(err))
  }, [dispatch])

  const deleteAvatar = async (): Promise<void> => {
    try {
      const response = await axios.get<UserType>(
        `${import.meta.env.VITE_API}/v1/user/deleteAvatar`,
        { withCredentials: true },
      )
      console.log(response)
      await dispatch(fetchUpd(response.data))
      notifySuccess('Аватар успешно удален.')
    } catch (error) {
      console.log(error)
      notifyWarning('Не удалось удалить аватар.')
    }
  }

  const logOutHandler = async (): Promise<void> => {
    await dispatch(fetchLogout())
    navigate('/')
    setlk((prev) => !prev)
  }

  //! Разобратся с парсингом даты окончания подписки и определиться, как мы ее будет отображать (только дату или дней до окончания и т.д.)

  //! убрать. это отсележивал нэйминг отсутствия аватаров
  console.log(`${import.meta.env.VITE_AVATARS}/${user.avatarUrl}`)

  return (
    <>
      <div className={clsx(styles.menu, isOpen && styles.open)}>
        <button
          className={clsx(styles.close, styles.link)}
          type='button'
          onClick={() => setlk((prev) => !prev)}
        >
          <img
            className={styles.icon}
            src='/src/assets/icons/close-circle-outline.svg'
            alt='svg'
          />
        </button>
        <SideBar>
          {/* <center className={styles.header}>Информация о пользователе</center> */}
          <div className={styles.center}>
            <Button link onClick={() => setModalActive1((prev) => !prev)}>
              <Avatar
                size={14}
                src={`${import.meta.env.VITE_AVATARS}/${user.avatarUrl}`}
                letter={user.firstName[0]}
              />
            </Button>
            {user.avatarUrl && (
              <>
                {/* <Button onClick={() => setModalActive1((prev) => !prev)}>
                Изменить аватар
              </Button> */}
                <div className={styles.delAvatar}>
                  <Button link onClick={() => void deleteAvatar()}>
                    <img
                      className={styles.icon}
                      src='/src/assets/icons/close-circle-outline.svg'
                      alt='svg'
                    />
                  </Button>
                </div>
              </>
            )}
          </div>
          <Modal active={modalActive1} setActive={setModalActive1}>
            <AvatarChangeForm setActive={setModalActive1} />
          </Modal>
          {user.lastName && user.middleName && user.firstName ? (
            <>
              {/* <span> */}
              {/* </span> */}
              <Button link onClick={() => setModalActive2((prev) => !prev)}>
                {user?.lastName} {user?.middleName} {user?.firstName}
                {/* Изменить ФИО */}
              </Button>
            </>
          ) : (
            <>
              {/* <span>
                ФИО: {user?.lastName} {user?.middleName} {user?.firstName}
              </span> */}
              <Button link onClick={() => setModalActive2((prev) => !prev)}>
                {user?.lastName} {user?.middleName} {user?.firstName}
                {/* Дополнить */}
              </Button>
            </>
          )}{' '}
          <Modal active={modalActive2} setActive={setModalActive2}>
            <InitialsChangeForm user={user} setActive={setModalActive2} />
          </Modal>
          {/* <span>
            Почта: {user?.email}
          </span> */}
          <Button link onClick={() => setModalActive3((prev) => !prev)}>
            {user?.email}
            {/* Изменить почту */}
          </Button>
          <Modal active={modalActive3} setActive={setModalActive3}>
            <MailChahgeForm user={user} setActive={setModalActive3} />
          </Modal>
          {user.phone ? (
            <>
              {/* <span>Телефон: {user?.phone}</span> */}
              <Button link onClick={() => setModalActive4((prev) => !prev)}>
                {user?.phone}
                {/* Изменить телефон */}
              </Button>
            </>
          ) : (
            <>
              {/* <span>Вы не добавили телефон</span> */}
              <Button link onClick={() => setModalActive4((prev) => !prev)}>
                Добавить телефон
              </Button>
            </>
          )}
          <Modal active={modalActive4} setActive={setModalActive4}>
            <PhoneChahgeForm user={user} setActive={setModalActive4} />
          </Modal>
          {user.userAddress ? (
            <>
              {/* <span>Адрес: {user?.userAddress}</span> */}
              <Button link onClick={() => setModalActive5((prev) => !prev)}>
                {/* Изменить Адрес */}
                {user?.userAddress}
              </Button>
            </>
          ) : (
            <>
              {/* <span>Вы не добавили адрес</span> */}
              <Button link onClick={() => setModalActive5((prev) => !prev)}>
                Добавить адрес
              </Button>
            </>
          )}
          <Modal active={modalActive5} setActive={setModalActive5}>
            <AddressChangeForm user={user} setActive={setModalActive5} />
          </Modal>
          <Button onClick={() => setModalActive6((prev) => !prev)}>
            Изменить пароль
          </Button>
          <Button onClick={() => void logOutHandler()}>Выйти</Button>
          <Modal active={modalActive6} setActive={setModalActive6}>
            <PasswordChangeForm user={user} setActive={setModalActive6} />
          </Modal>
        </SideBar>
      </div>
      {isOpen && (
        <div
          onClick={() => setlk((prev) => !prev)}
          className={styles.menuBackdrop}
        />
      )}
    </>
  )
}

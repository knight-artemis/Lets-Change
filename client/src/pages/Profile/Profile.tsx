import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Bounce, toast } from 'react-toastify'
import styles from './Profile.module.css'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import Modal from '../../components/Widgets/Modal/Modal'
import PasswordChangeForm from '../../components/ChangeHandlers/PasswordChangeForm/PasswordChangeForm'
import AvatarChangeForm from '../../components/ChangeHandlers/AvatarChangeForm/AvatarChangeForm'
import MailChahgeForm from '../../components/ChangeHandlers/MailChahgeForm/MailChahgeForm'
import PhoneChahgeForm from '../../components/ChangeHandlers/PhoneChangeForm/PhoneChangeForm'
import InitialsChangeForm from '../../components/ChangeHandlers/InitialsChangeForm/InitialsChangeForm'
import AddressChangeForm from '../../components/ChangeHandlers/AddressChangeForm/AddressChangeForm'
import SubForm from '../../components/ChangeHandlers/SubForm/SubForm'
import { fetchGetNot, fetchUpd } from '../../redux/user/userThunkActions'
import type { UserType } from '../../types'
import Avatar from '../../components/Widgets/Avatar/Avatar'
import WholePage from '../../components/PageSkeleton/WholePage/WholePage'
import SideBar from '../../components/PageSkeleton/SideBar/SideBar'
import MainContent from '../../components/PageSkeleton/MainContent/MainContent'
import Grid from '../../components/PageSkeleton/Grid/Grid'
import Button from '../../components/Shared/Button/Button'

export default function Profile(): JSX.Element {
  const dispatch = useAppDispatch()

  const notifySuccess = (message: string): void => {
    toast.success(message, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
    })
  }

  const notifyWarning = (message: string): void => {
    toast.warn(message, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
    })
  }

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
  }, [])

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

  //! Разобратся с парсингом даты окончания подписки и определиться, как мы ее будет отображать (только дату или дней до окончания и т.д.)

  //! убрать. это отсележивал нэйминг отсутствия аватаров
  console.log(`${import.meta.env.VITE_AVATARS}/${user.avatarUrl}`)

  return (
    <WholePage>
      <SideBar>
        <center  className={styles.header}>Информация о пользователе</center>
        <div className={styles.center}>

        <Avatar
          size={15}
          src={`${import.meta.env.VITE_AVATARS}/${user.avatarUrl}`}
          letter={user.firstName[0]}
          />
          </div>
        {user.avatarUrl ? (
          <>
            <Button onClick={() => setModalActive1((prev) => !prev)}>
              Изменить аватар
            </Button>
            <Button onClick={() => void deleteAvatar()}>Удалить аватар</Button>
          </>
        ) : (
          <Button onClick={() => setModalActive1((prev) => !prev)}>
            Добавить аватар
          </Button>
        )}
        <Modal active={modalActive1} setActive={setModalActive1}>
          <AvatarChangeForm setActive={setModalActive1} />
        </Modal>
        {user.lastName && user.middleName && user.firstName ? (
          <>
            <span>
              ФИО: {user?.lastName} {user?.middleName} {user?.firstName}
            </span>
            <Button onClick={() => setModalActive2((prev) => !prev)}>
              Изменить ФИО
            </Button>
          </>
        ) : (
          <>
            <span>
              ФИО: {user?.lastName} {user?.middleName} {user?.firstName}
            </span>
            <Button onClick={() => setModalActive2((prev) => !prev)}>
              Дополнить
            </Button>
          </>
        )}{' '}
        <Modal active={modalActive2} setActive={setModalActive2}>
          <InitialsChangeForm user={user} setActive={setModalActive2} />
        </Modal>
        <span>
          Почта:
          {user?.email}
        </span>
        <Button onClick={() => setModalActive3((prev) => !prev)}>
          Изменить почту
        </Button>
        <Modal active={modalActive3} setActive={setModalActive3}>
          <MailChahgeForm user={user} setActive={setModalActive3} />
        </Modal>
        {user.phone ? (
          <>
            <span>Телефон: {user?.phone}</span>
            <Button onClick={() => setModalActive4((prev) => !prev)}>
              Изменить телефон
            </Button>
          </>
        ) : (
          <>
            <span>Вы не добавили телефон</span>
            <Button onClick={() => setModalActive4((prev) => !prev)}>
              Добавить телефон
            </Button>
          </>
        )}
        <Modal active={modalActive4} setActive={setModalActive4}>
          <PhoneChahgeForm user={user} setActive={setModalActive4} />
        </Modal>
        {user.userAddress ? (
          <>
            <span>Адрес: {user?.userAddress}</span>
            <Button onClick={() => setModalActive5((prev) => !prev)}>
              Изменить Адрес
            </Button>
          </>
        ) : (
          <>
            <span>Вы не добавили адрес</span>
            <Button onClick={() => setModalActive5((prev) => !prev)}>
              Добавить адрес
            </Button>
          </>
        )}
        <Modal active={modalActive5} setActive={setModalActive5}>
          <AddressChangeForm setActive={setModalActive5} />
        </Modal>
        <Button onClick={() => setModalActive6((prev) => !prev)}>
          Изменить пароль
        </Button>{' '}
        <Modal active={modalActive6} setActive={setModalActive6}>
          <PasswordChangeForm user={user} setActive={setModalActive6} />
        </Modal>
      </SideBar>
      <MainContent>
      {/* <div className={styles.main}> */}
        <div className={styles.userInfo}>
          {/* <div className={styles.avatarDiv}></div> */}
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
                <Button onClick={() => setModalActive7((prev) => !prev)}>
                  Оформить подписку
                </Button>
              </>
            )}
          </span>
          <Modal active={modalActive7} setActive={setModalActive7}>
            <SubForm />
          </Modal>
          <span>Рейтинг пользователя: {user?.rating}</span>
        </div>
      {/* </div>  */}
      </MainContent>
    </WholePage>
  )
}

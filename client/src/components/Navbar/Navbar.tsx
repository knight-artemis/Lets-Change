import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import styles from './Navbar.module.css'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { fetchLogout } from '../../redux/user/userThunkActions'
import Chip from '../Shared/Chip/Chip'
import type { NotType } from '../../types'
import { fetchAdminLogout } from '../../redux/admin/adminThunkActions'
import Avatar from '../Widgets/Avatar/Avatar'
import Button from '../Shared/Button/Button'
import Profile from './Profile'
import AddThing from './AddThing'

export default function Navbar(): JSX.Element {
  const navigate = useNavigate()
  const user = useAppSelector((store) => store.userSlice.user)
  const admin = useAppSelector((store) => store.adminSlice.admin)
  const [lk, setlk] = useState(false)
  const [addThing, setAddThing] = useState(false)
  const notifications = useAppSelector<NotType>(
    (store) => store.userSlice.notifications,
  )
  const notif = notifications.initiator + notifications.reciever
  const dispatch = useAppDispatch()
  // const [modalProfActive, setModalProfActive] = useState<boolean>(true)

  const logOutAdminHandler = async (): Promise<void> => {
    await dispatch(fetchAdminLogout())
  }

  return (
    <nav className={styles.navbar}>
      {admin.id > 0 ? (
        <Link
          className={styles.link}
          to='/admin'
          onClick={() => void logOutAdminHandler()}
        >
          Выйти
        </Link>
      ) : (
        <div className={styles.wrapper}>
          {user.id ? (
            <>
              <div className={styles.menu}>
                <Link className={styles.link} to='/'>
                  Все вещи
                </Link>
                <Link className={styles.link} to='/my-things'>
                  Мои вещи
                </Link>
                <Link
                  className={clsx(styles.link, styles.relative)}
                  to='/my-deals/from-me'
                >
                  Сделки
                  {notif > 0 && (
                    <Chip bottom={0.8} right={-1} small color='neutral'>
                      {notif}
                    </Chip>
                  )}
                </Link>
                {/* <p>({notifications.initiator + notifications.reciever})</p> */}
                {/* <Link className={styles.link} to='/new-thing'>
                  Добавить вещь
                </Link> */}
                <button className={styles.addThingBtn}
                  type='button'
                  onClick={() => setAddThing((prev) => !prev)}
                >
                  {/* <Button link onClick={() => void navigate('/profile')}> */}
                  Добавить вещь
                </button>
                {/* <Link className={styles.link} to='/profile'>
                Профиль
              </Link> */}
              </div>
              <div className={styles.user}>
                <span>{user.firstName}</span>
                {user.id > 0 && (
                  <Button link onClick={() => setlk((prev) => !prev)}>
                    {/* <Button link onClick={() => void navigate('/profile')}> */}
                    <Avatar
                      border={1}
                      size={3}
                      src={`${import.meta.env.VITE_AVATARS}/${user.avatarUrl}`}
                      letter={user.firstName[0]}
                    />
                  </Button>
                )}
                {/* <Link
                  className={styles.link}
                  to='/'
                  onClick={() => void logOutHandler()}
                >
                  Выйти
                </Link> */}
              </div>
            </>
          ) : (
            <Link className={clsx(styles.link, styles.right)} to='/auth'>
              Войти
            </Link>
          )}
        </div>
      )}
      {user.id > 0 && <Profile isOpen={lk} setlk={setlk} />}
      {user.id > 0 && <AddThing isOpen={addThing} setAddThing={setAddThing} />}
    </nav>
  )
}

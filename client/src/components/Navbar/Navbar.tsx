import React from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import styles from './Navbar.module.css'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { fetchLogout } from '../../redux/user/userThunkActions'
import SvgLink from '../Shared/SvgLink/SvgLink'
import Chip from '../Shared/Chip/Chip'
import type { NotType } from '../../types'
import { fetchAdminLogout } from '../../redux/admin/adminThunkActions'

export default function Navbar(): JSX.Element {
  const user = useAppSelector((store) => store.userSlice.user)
  const admin = useAppSelector((store) => store.adminSlice.admin)
  const notifications = useAppSelector<NotType>(
    (store) => store.userSlice.notifications,
  )
  const dispatch = useAppDispatch()

  const logOutHandler = async (): Promise<void> => {
    await dispatch(fetchLogout())
  }

  const logOutAdminHandler = async (): Promise<void> => {
    await dispatch(fetchAdminLogout())
  }

  return (
    <nav className={styles.navbar}>
      <Link className={styles.link} to={admin.id ? '/admin' : '/'}>
        <SvgLink text='LOGO' />
      </Link>
      <span>{user.firstName}</span>

      {admin.id > 0 ? (
        <Link className={styles.link} to='/' onClick={() => void logOutAdminHandler()}>
          Выйти
        </Link>
      ) : (
        <div className={styles.menu}>
          <Link className={styles.link} to='/'>
            Главная
          </Link>
          {user.id ? (
            <>
              <Link className={styles.link} to='/my-things'>
                Мои вещи
              </Link>
              <Link
                className={clsx(styles.link, styles.relative)}
                to='/my-deals/from-me'
              >
                Сделки
                <Chip bottom={0.5} right={-0.5} small color='neutral'>
                  {(notifications?.initiator || 0) +
                    (notifications?.reciever || 0)}
                </Chip>
              </Link>
              {/* <p>({notifications.initiator + notifications.reciever})</p> */}
              <Link className={styles.link} to='/new-thing'>
                Добавить вещь
              </Link>
              <Link className={styles.link} to='/profile'>
                Профиль
              </Link>
              <Link
                className={styles.link}
                to='/'
                onClick={() => void logOutHandler()}
              >
                Выйти
              </Link>
            </>
          ) : (
            <Link className={styles.link} to='/auth'>
              Войти
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}

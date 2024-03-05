import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchLogout } from '../../redux/user/userThunkActions';

export default function Navbar(): JSX.Element {
  const user = useAppSelector((store) => store.userSlice.user);
  const dispatch = useAppDispatch();

  const logOutHandler = async():Promise<void> => {
    await dispatch(fetchLogout());
  }
  return (
    <nav className={styles.Navbar}>
      <div>logo</div>
      <div className={styles.menu}>
        <Link className={styles.link} to='/'>Главная</Link>
        {user.id ? (
          <>
            <Link className={styles.link} to='/my-things'>Мои вещи</Link>
            <Link className={styles.link} to='/my-deals'>Сделки</Link>
            <Link className={styles.link} to='/new-thing'>Добавить вещь</Link>
            <Link className={styles.link} to='/profile'>Профиль</Link>
            <Link className={styles.link} to='/' onClick={()=> void logOutHandler()}>Выйти</Link>
          </>
        ) : (
          <Link to='/auth'>Войти</Link>
        )}
      </div>
    </nav>
  );
}

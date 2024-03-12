import React from 'react'
import Navbar from '../Navbar/Navbar'
import style from './Header.module.css'

export default function Header(): JSX.Element {
  return (
    <header className={`${style.header}`}>
      <div className={style.left}>
        <img src='./assets/icons/logo.svg' alt='LOGO' />
      </div>
      <div className={style.right}>
        <Navbar />
      </div>
    </header>
  )
}

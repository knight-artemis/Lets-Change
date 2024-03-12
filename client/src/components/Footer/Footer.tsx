import React from 'react'
import style from './Footer.module.css'

export default function Footer(): JSX.Element {
  return (
    <footer className={`${style.footer}`}>
      <img
        src='assets/icons/logo-light.svg'
        alt='LOGO'
        className={style.logo}
      />
    </footer>
  )
}

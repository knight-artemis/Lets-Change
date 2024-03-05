import React from 'react'
import Navbar from '../Navbar/Navbar'
import style from './Header.module.css'

export default function Header(): JSX.Element {
  return (
    <header className={`${style.header}`}>
      <Navbar />
    </header>
  )
}

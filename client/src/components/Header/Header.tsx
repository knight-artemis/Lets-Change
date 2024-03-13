import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import style from './Header.module.css'
import Button from '../Shared/Button/Button'
import { useAppSelector } from '../../redux/hooks'

export default function Header(): JSX.Element {
  const navigate = useNavigate()
  const admin = useAppSelector((store) => store.adminSlice.admin)
  return (
    <header className={style.header}>
      <div className={style.left}>
        <Button link onClick={() => void navigate(admin.id ? '/admin' : '/')}>
          <img src='/assets/icons/logo.svg' alt='LOGO' />
        </Button>
      </div>
      <div className={style.right}>
        <Navbar />
      </div>
    </header>
  )
}

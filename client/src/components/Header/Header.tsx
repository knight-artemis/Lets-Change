import React from 'react'
import Navbar from '../Navbar/Navbar'
import styles from './Header.module.css'

export default function Header(): JSX.Element {
  return (
    <div className={`${styles.Header}`}>
      <Navbar />
    </div>
  )
}

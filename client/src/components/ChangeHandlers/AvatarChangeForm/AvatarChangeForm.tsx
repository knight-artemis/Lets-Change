import React from 'react'
import styles from './AvatarChangeForm.module.css'
import type { SetProps } from '../../../types'

export default function AvatarChangeForm({ setActive }: SetProps): JSX.Element {

  const updAvatar = async (): Promise<void> => {
    setActive((prev) => !prev)
  }

  return (
    <form className={styles.form} encType='multipart/form-data'>
      <h3>Аватар</h3>
      <input type='file' name='avatar' />
      <button type='button' onClick={() => void updAvatar()}>
        Использовать файл
      </button>
    </form>
  )
}

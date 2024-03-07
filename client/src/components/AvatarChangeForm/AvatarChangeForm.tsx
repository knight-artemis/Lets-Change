import React from 'react'
import styles from './AvatarChangeForm.module.css'

export default function AvatarChangeForm(): JSX.Element {
    return (
      <form encType='multipart/form-data' className={styles.form}>
        <h3>Аватар</h3>
        <input type='file' name='photo' multiple />
        <button type='submit'>Использовать файл</button>
      </form>
    )
}

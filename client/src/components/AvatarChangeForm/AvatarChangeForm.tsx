import React from 'react'
import styles from './AvatarChangeForm.module.css'

export default function AvatarChangeForm(): JSX.Element {
    return (
      <form encType='multipart/form-data' className={styles.form}>
        <h5>Выберите фото</h5>
        <input type='file' name='photo' multiple />
        <button type='submit'>Загрузить файл</button>
      </form>
    )
}

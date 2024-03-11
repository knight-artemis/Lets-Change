import React, { useRef } from 'react'
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import styles from './AvatarChangeForm.module.css'
import type { SetProps, UserType } from '../../../types'
import { useAppDispatch } from '../../../redux/hooks'
import { fetchUpd } from '../../../redux/user/userThunkActions'
import { notifySuccess, notifyWarning } from '../../../toasters'

export default function AvatarChangeForm({ setActive }: SetProps): JSX.Element {
  const dispatch = useAppDispatch()

  type RequestType = {
    avatar: HTMLInputElement
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadAvatar = async (): Promise<void> => {
    if (
      !fileInputRef.current?.files ||
      fileInputRef.current.files.length === 0
    ) {
      notifyWarning('Пожалуйста, выберите изображение.')
      return
    }

    const formData = new FormData()
    formData.append('avatar', fileInputRef.current.files[0])

    try {
      const response = await axios.post<RequestType, AxiosResponse<UserType>>(
        `${import.meta.env.VITE_API}/v1/user/avatarUpd`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      await dispatch(fetchUpd(response.data))
      setActive((prev) => !prev)
      fileInputRef.current.value = ''
      notifySuccess('Аватар успешно загружен.')
    } catch (error) {
      console.error('Error uploading avatar:', error)
    }
  }

  return (
    <form className={styles.form} encType='multipart/form-data'>
      <h3>Аватар</h3>
      <input
        type='file'
        name='avatar'
        ref={fileInputRef}
        accept='.jpg, .jpeg, .png'
      />
      <button type='button' onClick={() => void uploadAvatar()}>
        Использовать файл
      </button>
    </form>
  )
}

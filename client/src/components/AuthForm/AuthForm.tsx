import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Bounce, toast } from 'react-toastify'
import styles from './AuthForm.module.css'
import { useAppDispatch } from '../../redux/hooks'
import type { UserDataType } from '../../types'
import { fetchAuth } from '../../redux/user/userThunkActions'
import Button from '../Shared/Button/Button'
import Modal from '../Widgets/Modal/Modal'
import ForgetPassForm from '../ChangeHandlers/ForgetPassForm/ForgetPassForm'
import 'react-toastify/dist/ReactToastify.css'

export default function Auth(): JSX.Element {
  const initialState = { email: '', password: '', firstName: '' }
  const [inputs, setInputs] = useState<UserDataType>(initialState)
  const [isLogin, setIsLogin] = useState(true)
  const [modalActive, setModalActive] = useState<boolean>(true)
  const dispatch = useAppDispatch()
  // const user = useAppSelector((store) => store.userSlice.user);
  const navigate = useNavigate()

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const authHandler = (): void => {
    setIsLogin((prev) => !prev)
    setInputs(initialState)
  }

  const notify = (message: string): void => {
    toast.warn(message, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
    })
  }

  const addUserHandler = async (): Promise<void> => {
    const checkMail = await axios.post(
      `${import.meta.env.VITE_API}/v1/auth/checkmail`,
      { email: inputs.email },
      {
        withCredentials: true,
      },
    )

    const checkPass = await axios.post(
      `${import.meta.env.VITE_API}/v1/auth/checkPass`,
      {
        email: inputs.email,
        password: inputs.password,
      },
      {
        withCredentials: true,
      },
    )

    try {
      if (!inputs.firstName && !isLogin) {
        notify('Пожалуйста, введите Ваше имя.')
      } else if (
        (!isLogin && inputs.firstName.length < 3) ||
        /[^a-zA-Zа-яА-Я0-9]/.test(inputs.firstName)
      ) {
        notify(
          'Ваше имя должно быть не короче 3 символов и не должно содержать специальных символов.',
        )
      } else if (!inputs.email) {
        notify('Пожалуйста, введите Вашу почту.')
      } else if (
        inputs.email &&
        !/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
          inputs.email,
        )
      ) {
        notify('Неверный формат почты.')
      } else if (!inputs.password && !isLogin) {
        notify('Пожалуйста, придумайте пароль.')
      } else if (
        !isLogin &&
        inputs.password &&
        !/^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/.test(
          inputs.password,
        )
      ) {
        notify(
          'Пароль должен быть не менее 8 символов длинной, содержать в себе как минимум 1 цифру и 1 символ.',
        )
      } else if (!inputs.password && isLogin) {
        notify('Пожалуйста, введите пароль.')
      } else if (!isLogin && checkMail.data) {
        notify('Пользователь с такой почтой уже существует.')
      } else if (isLogin && !checkMail.data) {
        notify('Пользователя с такой почтой не существует.')
      } else if (isLogin && checkMail.data && !checkPass.data) {
        notify('Неверный пароль.')
      } else {
        await dispatch(
          fetchAuth({ type: !isLogin ? 'reg' : 'log', data: inputs }),
        )
        navigate('/')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form className={styles.form}>
      {!isLogin && (
        <input
          onChange={changeHandler}
          name='firstName'
          type='text'
          required
          value={inputs.firstName}
          placeholder='firstName'
        />
      )}
      <input
        onChange={changeHandler}
        name='email'
        type='text'
        required
        value={inputs.email}
        placeholder='email'
      />

      <input
        onChange={changeHandler}
        name='password'
        type='password'
        required
        value={inputs.password}
        placeholder='password'
      />
      <Button onClick={() => void addUserHandler()}>
        {isLogin ? 'Авторизоваться' : 'Зарегистрироваться'}
      </Button>
      {isLogin && (
        <Button onClick={() => setModalActive((prev) => !prev)}>
          Забыли пароль?
        </Button>
      )}
      <Modal active={modalActive} setActive={setModalActive}>
        <ForgetPassForm setActive={setModalActive} />
      </Modal>
      <Button link onClick={() => void authHandler()}>
        {isLogin ? 'Хочу зарегистрироваться' : 'Уже зарегистрирован?'}
      </Button>
      {/* {message && <p styles={{ color: '#1D9947' }}>{message}</p>} */}
      {/* {error && <p styles={{ color: '#fa6a6a' }}>{error}</p>} */}
    </form>
  )
}

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styles from './AuthForm.module.css'
import { useAppDispatch } from '../../redux/hooks'
import type { UserDataType } from '../../types'
import { fetchAuth } from '../../redux/user/userThunkActions'
import Button from '../Shared/Button/Button'
import Modal from '../Widgets/Modal/Modal'
import ForgetPassForm from '../ChangeHandlers/ForgetPassForm/ForgetPassForm'
import 'react-toastify/dist/ReactToastify.css'
import { notifySuccess, notifyWarning } from '../../toasters'
import SvgLink from '../Shared/SvgLink/SvgLink'
import Input from '../Shared/Input/Input'

export default function Auth(): JSX.Element {
  const initialState = { email: '', password: '', firstName: '' }
  const [inputs, setInputs] = useState<UserDataType>(initialState)
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [modalActive, setModalActive] = useState<boolean>(true)
  const dispatch = useAppDispatch()
  // const user = useAppSelector((store) => store.userSlice.user)
  const navigate = useNavigate()

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const authHandler = (): void => {
    setIsLogin((prev) => !prev)
    setInputs(initialState)
  }

  //! Для того, чтобы заработали валидации необходимо раскомментировать все внутри addUserHandler

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
        notifyWarning('Пожалуйста, введите Ваше имя.')
      } else if (
        !isLogin &&
        !/^[a-zA-Zа-яА-Я0-9]{3,}$/.test(inputs.firstName)
      ) {
        notifyWarning(
          'Ваше имя должно быть не короче 3 символов и не должно содержать специальных символов.',
        )
      } else if (!inputs.email) {
        notifyWarning('Пожалуйста, введите Вашу почту.')
      } else if (
        inputs.email &&
        !/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
          inputs.email,
        )
      ) {
        notifyWarning('Неверный формат почты.')
      } else if (!inputs.password && !isLogin) {
        notifyWarning('Пожалуйста, придумайте пароль.')
      } else if (
        !isLogin &&
        inputs.password &&
        !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
          inputs.password,
        )
      ) {
        notifyWarning(
          'Пароль должен быть не менее 8 символов длинной, содержать в себе строчные и заглавные буквы, минимум одну цифру и какой-либо из следующих символов: #?!@$%^&*-',
        )
      } else if (!inputs.password && isLogin) {
        notifyWarning('Пожалуйста, введите пароль.')
      } else if (!isLogin && checkMail.data) {
        notifyWarning('Пользователь с такой почтой уже существует.')
      } else if (isLogin && !checkMail.data) {
        notifyWarning('Пользователя с такой почтой не существует.')
      } else if (isLogin && checkMail.data && !checkPass.data) {
        notifyWarning('Неверный пароль.')
      } else {
        await dispatch(
          fetchAuth({ type: !isLogin ? 'reg' : 'log', data: inputs }),
        )
        navigate('/')
        if (isLogin) {
          notifySuccess('C возвращением на портал "Давай меняться."')
        } else if (!isLogin) {
          notifySuccess(
            'Благодарим за регистрацию на портале "Давай меняться".',
          )
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form className={styles.form}>
      <div className={styles.inputs}>
        {!isLogin && (
          <Input
            onChange={changeHandler}
            name='firstName'
            type='text'
            required
            value={inputs.firstName}
            placeholder='firstName'
          />
        )}
        <Input
          onChange={changeHandler}
          name='email'
          type='text'
          required
          value={inputs.email}
          placeholder='email'
        />
        <div className={styles.pass}>
          <Input
            onChange={changeHandler}
            name='password'
            type={showPassword ? 'text' : 'password'}
            required
            value={inputs.password}
            placeholder='password'
          />
          <Button link onClick={() => void setShowPassword((prev) => !prev)}>
            {showPassword ? (
              <img
                className={styles.icon}
                src='./src/assets/icons/eye-off-outline.svg'
                alt='svg'
              />
            ) : (
              <img
                className={styles.icon}
                src='./src/assets/icons/eye-outline.svg'
                alt='svg'
              />
            )}
          </Button>
        </div>
        {isLogin && (
          <Button link onClick={() => setModalActive((prev) => !prev)}>
            Забыли пароль?
          </Button>
        )}
      </div>
      <div className={styles.btns}>
        <Button onClick={() => void addUserHandler()}>
          {isLogin ? 'Авторизоваться' : 'Зарегистрироваться'}
        </Button>
        <Button link onClick={() => void authHandler()}>
          {isLogin ? 'Хочу зарегистрироваться' : 'Уже зарегистрирован?'}
        </Button>
      </div>
      <Modal active={modalActive} setActive={setModalActive}>
        <ForgetPassForm setActive={setModalActive} />
      </Modal>
      {/* {message && <p styles={{ color: '#1D9947' }}>{message}</p>} */}
      {/* {error && <p styles={{ color: '#fa6a6a' }}>{error}</p>} */}
    </form>
  )
}

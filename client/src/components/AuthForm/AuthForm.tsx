import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './AuthForm.module.css'
import { useAppDispatch } from '../../redux/hooks'
import type { UserDataType } from '../../types'
import { fetchAuth } from '../../redux/user/userThunkActions'
import Button from '../Controls/Button/Button'
import Modal from '../Modal/Modal'
import ForgetPassForm from '../ForgetPassForm/ForgetPassForm'

export default function Auth(): JSX.Element {
  const initialState = { email: '', password: '' }
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

  const addUserHandler = async (): Promise<void> => {
    try {
      await dispatch(
        fetchAuth({ type: !isLogin ? 'reg' : 'log', data: inputs }),
      )
      navigate('/')
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
        <ForgetPassForm setActive={setModalActive}  />
      </Modal>
      <Button link onClick={() => void authHandler()}>
        {isLogin ? 'Хочу зарегистрироваться' : 'Уже зарегистрирован?'}
      </Button>
      {/* {message && <p styles={{ color: '#1D9947' }}>{message}</p>} */}
      {/* {error && <p styles={{ color: '#fa6a6a' }}>{error}</p>} */}
    </form>
  )
}

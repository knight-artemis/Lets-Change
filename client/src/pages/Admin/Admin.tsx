import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import type { CategoryType, ThingType } from '../../types'
import Input from '../../components/Shared/Input/Input'
import Button from '../../components/Shared/Button/Button'
import { fetchCheck } from '../../redux/user/userThunkActions'
import {
  fetchAuthAdmin,
  fetchCheckAdmin,
} from '../../redux/admin/adminThunkActions'
import Card from './Card'
import styles from './Admin.module.css'

export default function Admin(): JSX.Element {
  const admin = useAppSelector((store) => store.adminSlice.admin)
  const [things, setThings] = useState<ThingType[]>([])
  const user = useAppSelector((store) => store.userSlice.user)
  const [inputs, setInputs] = useState<{ login: string; password: string }>({
    login: '',
    password: '',
  })
  
  const [categories, setCategories] = useState<CategoryType[]>([])
  const navigate = useNavigate()
  const dispatcher = useAppDispatch()

  useEffect(() => {
    void (async () => {
      await dispatcher(fetchCheckAdmin())
      const resCat = await axios.get<CategoryType[]>(
        `${import.meta.env.VITE_API}/v1/things/categories`,
        {
          withCredentials: true,
        },
      )
      const resThings = await axios.get<ThingType[]>(
        `${import.meta.env.VITE_API}/v1/things?admin=true`,
        { withCredentials: true },
      )
      setCategories(resCat.data)
      setThings(resThings.data.filter((el) => !el.isApproved))
    })()
  }, [user])

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const loginHandler = async (): Promise<void> => {
    console.log(inputs)
    await dispatcher(fetchAuthAdmin(inputs))
    await dispatcher(fetchCheck())
    // navigate('/admin')
  }

  if (admin.id)
    return (
      <div className={styles.cards}>
        {things.length > 0 && things.map((thing) => (
          <Card key={`thing-${thing.id}`} thing={thing} setThings={setThings} categories={categories}/>
        ))}
      </div>
    )

  return (
    <div className={styles.form}>
      {user.id > 0 && <h1>вам сюда нельзя</h1>}
      <h1>Вход для администратора</h1>
      <Input
        placeholder='login'
        type='text'
        name='login'
        required
        value={inputs.login}
        onChange={changeHandler}
      />
      <Input
        placeholder='password'
        type='password'
        name='password'
        required
        value={inputs.password}
        onChange={changeHandler}
      />
      <Button onClick={() => void loginHandler()}>Войти</Button>
    </div>
  )
}

import axios from 'axios'
import React, { useEffect } from 'react'
import style from './Main.module.css'

type AllThingsType = {}

export default function Main(): JSX.Element {
  useEffect(() => {
    axios
      .get<AllThingsType>(`${import.meta.env.VITE_URL}/v1/things`, {
        withCredentials: true,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err))
  })
  return <main className={style.main}>Main</main>
}

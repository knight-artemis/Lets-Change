import axios from 'axios'
import React, { useEffect } from 'react'

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
  return <div>Main</div>
}

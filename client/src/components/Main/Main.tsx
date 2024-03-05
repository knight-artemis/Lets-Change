import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Auth from '../Auth/Auth'

export default function Main(): JSX.Element {
  return (
    <Routes>
      <Route
        path='/'
        element={
          <div>Добро пожаловать на сайт проекта &quotДавай меняться&quot</div>
        }
      />
      <Route path='log' element={<Auth />} />
    </Routes>
  )
}

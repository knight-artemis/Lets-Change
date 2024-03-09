import React, { useEffect } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Main from './pages/Main/Main'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import { fetchCheck } from './redux/user/userThunkActions'
import Auth from './pages/Auth/Auth'
import ThingPage from './pages/ThingPage/ThingPage'
import MyThings from './pages/MyThings/MyThings'
import MyDeals from './pages/MyDeals/MyDeals'
import NewThing from './pages/NewThing/NewThing'
import Profile from './pages/Profile/Profile'
import DealToConsider from './pages/DealToConsider/DealToConsider'
import Deal from './pages/Deal/Deal'
// import { setPosition } from './redux/user/userSlice'
// import useGeoLocation from './hooks/useGeoLocation'

// import Main from './components/Main/Main'

function App(): JSX.Element {
  const dispatcher = useAppDispatch()

  useEffect(() => {
    void dispatcher(fetchCheck())
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(
    //     (position) => {
    //       dispatcher(
    //         setPosition([position.coords.latitude, position.coords.longitude]),
    //       )
    //     },
    //     (error) => {
    //       console.error('Error getting geolocation:', error)
    //     },
    //   )
    // } else {
    //   console.error('Geolocation is not supported by this browser.')
    // }
  }, [])
  const user = useAppSelector((store) => store.userSlice.user)
  console.log('USER', user)
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route index element={<Main />} />
          <Route path='/my-things' element={<MyThings />} />
          <Route path='/my-deals' element={<MyDeals />} />
          <Route path='/new-thing' element={<NewThing />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/auth' element={<Auth />} />
          <Route path='/thing/:id' element={<ThingPage />} />
          <Route path='/deal-to-consider/:id' element={<DealToConsider />} />
          <Route path='/deal/:id' element={<Deal/>} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App

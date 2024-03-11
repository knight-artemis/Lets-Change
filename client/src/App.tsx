import React, { useEffect } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Main from './pages/Main/Main'
import { useAppDispatch, useAppSelector } from './redux/hooks'
import { fetchCheck, fetchGetNot } from './redux/user/userThunkActions'
import Auth from './pages/Auth/Auth'
import ThingPage from './pages/ThingPage/ThingPage'
import MyThings from './pages/MyThings/MyThings'
import MyDeals from './pages/MyDeals/MyDeals'
import NewThing from './pages/NewThing/NewThing'
import Profile from './pages/Profile/Profile'
import DealToConsider from './pages/DealToConsider/DealToConsider'
import Deal from './pages/Deal/Deal'
import Admin from './pages/Admin/Admin'
// import { setPosition } from './redux/user/userSlice'
// import useGeoLocation from './hooks/useGeoLocation'

// import Main from './components/Main/Main'

function App(): JSX.Element {
  const dispatcher = useAppDispatch()
  // const notifications = useAppSelector(store => store.userSlice.notifications)

  useEffect(() => {
    void dispatcher(fetchCheck())
    // setInterval(() => {
      void dispatcher(fetchGetNot())
    // }, 10000)
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
  // const user = useAppSelector((store) => store.userSlice.user)
  // // console.log('USER', user, "NOTIFICATIONS", notifications)

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route index element={<Main />} />
          <Route path='/my-things' element={<MyThings />} />
          <Route path='/my-deals/to-me' element={<MyDeals />} />
          <Route path='/my-deals/from-me' element={<MyDeals toMe={false}/>} />
          <Route path='/new-thing' element={<NewThing />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/auth' element={<Auth />} />
          <Route path='/thing/:id' element={<ThingPage />} />
          <Route path='/deal-to-consider/:id' element={<DealToConsider />} />
          <Route path='/deal/:id' element={<Deal />} />
          <Route path='/admin' element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App

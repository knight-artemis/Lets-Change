import React from 'react'
import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Main from './pages/Main/Main'
// import Main from './components/Main/Main'

function App(): JSX.Element {
  return (
    <>
      <Header />
      <Main/>
      <Footer/>
    </>
  )
}

export default App

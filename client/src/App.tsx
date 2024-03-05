import React, { useEffect } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Main from './pages/Main/Main';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { fetchCheck } from './redux/user/userThunkActions';
import Auth from './pages/Auth/Auth';
// import Main from './components/Main/Main'

function App(): JSX.Element {
  const dispatcher = useAppDispatch();

  useEffect(() => void dispatcher(fetchCheck()), []);
  const user = useAppSelector((store) => store.userSlice.user);
  console.log('USER', user);
  return (
    <>
      <Header />
      <Routes>
        <Route index element={<Main />} />
        <Route path='/auth' element={<Auth />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

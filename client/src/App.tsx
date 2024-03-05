import React, { useEffect } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Main from './pages/Main/Main';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { fetchCheck } from './redux/user/userThunkActions';
import Auth from './pages/Auth/Auth';
import ThingPage from './components/ThingPage/ThingPage';
import MyThings from './pages/MyThings/MyThings';
import MyDeals from './pages/MyDeals/MyDeals';
import NewThing from './pages/NewThing/NewThing';
import Profile from './pages/Profile/Profile';

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
        <Route path='/my-things' element={<MyThings />} />
        <Route path='/my-deals' element={<MyDeals />} />
        <Route path='/new-thing' element={<NewThing />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/testpage' element={<ThingPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

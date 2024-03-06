import React from 'react';
import axios from 'axios';
import styles from './MyDeals.module.css';


export default function MyDeals(): JSX.Element {

  return (
    <form
      action='http://localhost:3003/api/v1/test/testUpload'
      method='post'
      encType='multipart/form-data'
    >
      <input type='file' name='photo' multiple />
      <button type='submit'>Загрузить файл</button>
    </form>
  );
}

import React from 'react';
import AuthForm from '../../components/AuthForm/AuthForm';
import styles from './Auth.module.css'

export default function Auth(): JSX.Element {
  return (
    <div className={styles.main}>
      <AuthForm />
    </div>
  );
}

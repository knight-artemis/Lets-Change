import React from 'react'

export default function Auth(): JSX.Element {
  return (
    <form className={style.form}>
      {!isLogin && (
        <>
          <label htmlFor='inp1'>username</label>
          <input
            onChange={changeHandler}
            id='inp1'
            name='username'
            type='text'
            required
            value={inputs.username}
          />
        </>
      )}
      <label htmlFor='inp2'>email</label>
      <input
        onChange={changeHandler}
        id='inp2'
        name='email'
        type='text'
        required
        value={inputs.email}
      />

      <label htmlFor='inp3'>password</label>
      <input
        onChange={changeHandler}
        id='inp3'
        name='password'
        type='password'
        required
        value={inputs.password}
      />
      <>
        <Button
          onClick={() => void addUserHandler()}
          title={isLogin ? 'Авторизоваться' : 'Зарегистрироваться'}
        />
        <LinkBtn
          onClick={() => void authHandler()}
          title={isLogin ? 'Хочу зарегистрироваться' : 'Уже зарегистрирован?'}
        />
      </>
      {message && <p style={{ color: '#1D9947' }}>{message}</p>}
      {error && <p style={{ color: '#fa6a6a' }}>{error}</p>}
    </form>
  )
}

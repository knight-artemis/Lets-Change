import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import style from './MyDeals.module.css'
import SvgLink from '../../components/Controls/SvgLink/SvgLink'
import Button from '../../components/Controls/Button/Button'

export default function MyDeals(): JSX.Element {
  const navigate = useNavigate()

  const fromMeOffers = (): void => {
    // TODO ручка получения мои предложения
  }
  const toMeOffers = (): void => {
    // TODO ручка получения мне предложили
  }

  const zatichka = [1, 2]
  return (
    <>
      <div className={style.wrapper}>
        <div className={style.topContent}>
          <span className={style.span}>Тут можно поглянуть свои сделки</span>
        </div>

        <div className={style.mainContent}>
          <div className={style.sidebar}>
            <Button link onClick={() => void fromMeOffers()}>
              <SvgLink icon='assets/icons/shirt.svg' text='Мои предложения' />
            </Button>
            <Button link onClick={() => void toMeOffers()}>
              <SvgLink icon='assets/icons/shirt.svg' text='Мне предложили' />
            </Button>
          </div>

          <div className={style.list}>
            {zatichka.map((deal) => (
              <div className={style.listItem}>

                <div className={style.photo}>
                  <img
                    src={`${import.meta.env.VITE_THINGS}/1709798550879.jpg`}
                    alt='фотка-шмотка'
                  />
                </div>

                {/* <div className={style.body}> */}
                  <div className={style.nameNtime}>
                    <div className={style.name}>Отличная куртка</div>
                    <div className={style.timeLeft}>осталось <br/> 5 дн.</div>
                  </div>

                  <div className={style.description}>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel
                    odio, placeat alias, repudiandae sapiente tempore ipsum
                    deserunt repellendus iure vero sunt soluta magnam quasi
                    expedita nesciunt est, reiciendis eum voluptatibus!
                  </div>

                </div>
              // </div>
            ))}
          </div>
        </div>
      </div>

      {/* <form
      action='http://localhost:3003/api/v1/test/testUpload'
      method='post'
      encType='multipart/form-data'
    >
      <input type='file' name='photo' multiple />
      <button type='submit'>Загрузить файл</button>
    </form> */}
    </>
  )
}

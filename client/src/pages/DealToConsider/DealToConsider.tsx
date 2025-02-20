/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import style from './DealToConsider.module.css'
import type { OneDealDetailed } from '../../types'
import Button from '../../components/Shared/Button/Button'
import CardSimple from '../../components/Widgets/CardSimple/CardSimple'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { fetchGetNot } from '../../redux/user/userThunkActions'
import WholePage from '../../components/PageSkeleton/WholePage/WholePage'
import SideBar from '../../components/PageSkeleton/SideBar/SideBar'
import MainContent from '../../components/PageSkeleton/MainContent/MainContent'
import Grid from '../../components/PageSkeleton/Grid/Grid'
import Spinner from '../../components/Widgets/Spinner/Spinner'

export default function DealToConsider(): JSX.Element {
  const [deal, setDeal] = useState<OneDealDetailed>()
  const [selectedThingId, setSelectedThingId] = useState<number>(-1)
  const [loading, setLoading] = useState<boolean>(true)

  const { id } = useParams()
  const navigate = useNavigate()
  const dispatcher = useAppDispatch()
  const user = useAppSelector((store) => store.userSlice.user)

  useEffect(() => {
    setLoading(true)
    axios
      .get<OneDealDetailed>(`${import.meta.env.VITE_API}/v1/deals/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setDeal(res.data)
      })
      .catch((err) => console.log('Ошибка получения подробной сделки', err))
    dispatcher(fetchGetNot())
      .then()
      .catch((err) => console.log(err)).finally(() => setLoading(false))
  }, [id])
  
  const acceptedHandler = async (): Promise<void> => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API}/v1/deals/${id}/accepted`,
        { selectedThingId },
        { withCredentials: true },
        )
        navigate('/my-deals/from-me')
      } catch (err) {
        console.log('jopa', err)
      } finally {
        setLoading(false)
      }
  }
  const rejectedHandler = async (): Promise<void> => {
    // тут пишемручку на отказ. мб
    try{
    await axios.patch(
      `${import.meta.env.VITE_API}/v1/deals/${id}/rejected`,
      {},
      { withCredentials: true },
    )
    navigate('/my-deals/from-me')
  } catch (err) {
    console.log('jopa', err)
  } finally {
    setLoading(false)
  }
  }

  const selectorHandler = (thingId: number): void => {
    setSelectedThingId(thingId)
  }

  const findSelectedIndex = (): string => {
    if (selectedThingId < 0) return 'ничего'
    return deal?.initiatorThings.find(
      (hisThing) => hisThing.id === selectedThingId,
    )?.thingName as string
  }

  if (loading) return <Spinner/>   

  return user.id === deal?.initiatorId ? (
    <WholePage>
      <SideBar center>
        <div className={style.textCol}>Желаемая вещь:</div>
        <div className={style.topLine}>
          <div className={style.oneThing}>
            <CardSimple hoverable thing={deal?.Thing} thingId={deal?.thingId} />
          </div>
        </div>
      </SideBar>
      <MainContent>
        <div className={style.topContent}>
          <span className={style.span}>
            Одну из этих вещей ты предлагаешь в обмен:
          </span>
        </div>
        <Grid>
          {deal?.initiatorThings.map((hisOneThing) => (
            <div key={hisOneThing.id} className={style.oneThing}>
              <input
                style={{ display: 'none' }}
                className={style.checkbox}
                type='radio'
                id={`thing-${hisOneThing.id}`}
                name='selectedThing'
                checked={selectedThingId === hisOneThing.id}
              />

              <label
                htmlFor={`thing-${hisOneThing.id}`}
                className={style.radioLabel}
              >
                <div className={style.borderWrapper}>
                  <CardSimple
                    hoverable
                    thing={hisOneThing}
                    thingId={hisOneThing.id}
                  />
                </div>
              </label>
            </div>
          ))}
        </Grid>

        <div className={style.bottomLine}>
          <Button color='danger' onClick={() => void rejectedHandler()}>
            Передумал меняться
          </Button>
        </div>
      </MainContent>
    </WholePage>
  ) : (
    <WholePage>
      <SideBar center>
        <div className={style.textCol}>Моя вещь:</div>
        <div className={style.topLine}>
          <div className={style.oneThing}>
            <CardSimple hoverable thing={deal?.Thing} thingId={deal?.thingId} />
          </div>
        </div>
      </SideBar>
      <MainContent>
        <div className={style.topContent}>
          <span className={style.span}>
            Одну из этих вещей мне предлагают в обмен:
          </span>
        </div>
        <Grid>
          {deal?.initiatorThings.map((hisOneThing) => (
            <div key={hisOneThing.id} className={style.oneThing}>
              <input
                style={{ display: 'none' }}
                className={style.checkbox}
                type='radio'
                id={`thing-${hisOneThing.id}`}
                name='selectedThing'
                checked={selectedThingId === hisOneThing.id}
              />

              <label
                htmlFor={`thing-${hisOneThing.id}`}
                className={style.radioLabel}
              >
                <div className={style.borderWrapper}>
                  <CardSimple
                    hoverable
                    thing={hisOneThing}
                    thingId={hisOneThing.id}
                  />
                </div>
              </label>
              {selectedThingId === hisOneThing.id ? (
                <Button
                  color='good'
                  onClick={() => selectorHandler(hisOneThing.id)}
                >
                  ВЫБРАНО
                </Button>
              ) : (
                <Button onClick={() => selectorHandler(hisOneThing.id)}>
                  выбрать
                </Button>
              )}
            </div>
          ))}
        </Grid>

        <div className={style.selectedText}>Выбрано: {findSelectedIndex()}</div>
        <div className={style.bottomLine}>
          <Button
            disabled={selectedThingId < 0}
            color='good'
            onClick={() => void acceptedHandler()}
          >
            Давай меняться
          </Button>
          <Button color='danger' onClick={() => void rejectedHandler()}>
            Не хочу меняться
          </Button>
        </div>
      </MainContent>
    </WholePage>
  )
}

/*

    <div className={style.wrapper}>
      <div className={style.textCol}>Моя вещь:</div>
      <div className={style.topLine}>
        <div className={style.oneThing}>
          <CardSimple hoverable thing={deal?.Thing} thingId={deal?.thingId} />
        </div>
      </div>
      <div className={style.textCol}>
        Предлагаемые вещи (нажми, что бы выбрать):
      </div>
      <div className={style.middleLine}>
        {deal?.initiatorThings.map((hisOneThing) => (
          <div key={hisOneThing.id} className={style.oneThing}>
            <input
              // style={{ display: 'none' }}
              className={style.checkbox}
              type='radio'
              id={`thing-${hisOneThing.id}`}
              name='selectedThing'
              checked={selectedThingId === hisOneThing.id}
            />

            <label
              htmlFor={`thing-${hisOneThing.id}`}
              className={style.radioLabel}
            >
              <div className={style.borderWrapper}>
                <CardSimple
                  hoverable
                  thing={hisOneThing}
                  thingId={hisOneThing.id}
                />
              </div>
            </label>
            <Button onClick={() => selectorHandler(hisOneThing.id)}>
              выбрать
            </Button>
          </div>
        ))}
      </div>
      <div className={style.selectedText}>
        Выбрано: {deal?.initiatorThings[selectedThingId]?.thingName}
      </div>
      <div className={style.bottomLine}>
        <Button
          disabled={selectedThingId < 0}
          color='good'
          onClick={() => void acceptedHandler()}
        >
          Давай меняться
        </Button>
        <Button color='danger' onClick={() => void rejectedHandler()}>
          Не хочу меняться
        </Button>
      </div>
    </div> 
    */

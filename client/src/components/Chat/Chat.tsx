import React, { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import axios from 'axios'
import { io } from 'socket.io-client'
import styles from './Chat.module.css'
import Input from '../Shared/Input/Input'
import Button from '../Shared/Button/Button'
import { useAppSelector } from '../../redux/hooks'
import type { MsgType, OneDealDetailed } from '../../types'

type ChatPropsType = {
  deal: OneDealDetailed | undefined
}

export default function Chat({ deal }: ChatPropsType): JSX.Element {
  const user = useAppSelector((store) => store.userSlice.user)
  const [userOnline, setUserOnline] = useState(false)
  const [msgs, setMsgs] = useState<MsgType[]>([])
  const [msgInput, setMsgInput] = useState<string>('')
  const socket = useMemo(() => {
    if (user.id && deal) {
      return io(`${import.meta.env.VITE_CHAT}`, {
        extraHeaders: {
          newuserid: `${user.id}`,
          dealid: `${deal.id}`,
        },
      })
    }
  }, [user.id, deal])
  // const [message, setMessage] = useState('')

  const sendMsgHandler = async (): Promise<void> => {
    if (msgInput.trim() && deal && user) {
      try {
        const mes = await axios.post(
          `${import.meta.env.VITE_API}/v1/deals/${deal.id}/messages`,
          { text: msgInput, userId: user.id },
          { withCredentials: true },
        )
        socket?.emit('message', mes.data)
        if (!userOnline) {
          if (user.id === deal.initiatorId) {
            await axios.patch(
              `${import.meta.env.VITE_API}/v1/deals/${deal.id}/note`,
              { recieverNote: true, initiatorNote: false },
            )
          } else if (user.id === deal.receiverId) {
            await axios.patch(
              `${import.meta.env.VITE_API}/v1/deals/${deal.id}/note`,
              { initiatorNote: true, recieverNote: false },
            )
          }
        }
        setMsgInput('')
      } catch (error) {
        console.log(error)
      }
    }
  }

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setMsgInput(e.target.value)
  }

  useEffect(() => {
    if (deal) {
      axios
        .get<MsgType[]>(
          `${import.meta.env.VITE_API}/v1/deals/${deal?.id}/messages`,
          {
            withCredentials: true,
          },
        )
        .then((res) => setMsgs(res.data))
        .catch((err) => console.log(err))
      return () => {
        socket?.close()
      }
    }
  }, [deal])

  useEffect(() => {
    socket?.on(`res-deal-${deal?.id}`, (data: MsgType) => {
      if (data.userId !== user.id && !userOnline) setUserOnline(true)
      setMsgs([data, ...msgs])
    })
  }, [msgs])

  useEffect(() => {
    socket?.on(`user-enter-${deal?.id}`, (userId): void => {
      // console.log('вошел в чат', userId, user.id)
      setUserOnline(Number(userId) !== user.id)
    })
    socket?.on(`user-exit-${deal?.id}`, (userId) => {
      console.log('вышел из чата', userId, user.id)
      setUserOnline(!(Number(userId) !== user.id))
    })
  }, [socket])

  // console.log(socket)

  return (
    <>
      {userOnline ? (
        <p>
          {user.id === deal?.initiatorId
            ? deal.recieverName
            : deal?.initiatorName}{' '}
          онлайн
        </p>
      ) : (
        <p>
          {user.id === deal?.initiatorId
            ? deal.recieverName
            : deal?.initiatorName}{' '}
          офлайн
        </p>
      )}
      <div className={styles.chat}>
        {msgs.map((msg, index) => (
          <div
            key={`msg-${msg.id}`}
            className={clsx(
              styles.msg,
              msg.userId === user.id ? styles.myMsg : styles.hisMsg,
            )}
          >
            {user.id !== msg.userId && (
              <p className={styles.userName}>{msg.userName}</p>
            )}
            {msg.text}
          </div>
        ))}
      </div>
      <div className={styles.input}>
        <Input
          name='chatMsg'
          onChange={changeHandler}
          value={msgInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void sendMsgHandler()
          }}
        />
        <Button onClick={() => void sendMsgHandler()}>отправить</Button>
      </div>
    </>
  )
}
